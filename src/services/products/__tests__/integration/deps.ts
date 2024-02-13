import { faker } from "@faker-js/faker";
import { QueueEvents } from "bullmq";
import { Redis } from "ioredis";
import { mockDeep } from "jest-mock-extended";
import { env } from "~/config.js";
import { Queue } from "~/lib/bullmq/queue.js";
import { Worker } from "~/lib/bullmq/worker.js";
import prisma from "~/lib/prisma.js";
import { ProductRepository } from "~/repositories/products/repository.js";
import { ProductService, type ProductServiceType } from "../../service.js";
import {
	type PaymentProcessingQueueType,
	type PaymentProcessingWorkerType,
	getPaymentProcessingHandler,
} from "../../worker.js";
import { MockVippsClientFactory } from "../mock-vipps-client.js";

export async function makeDependencies(overrides?: {
	productService?: ProductServiceType;
}) {
	const queueName = faker.string.uuid();
	const productRepository = new ProductRepository(prisma);
	const { client, factory } = MockVippsClientFactory();
	const redis = new Redis(env.REDIS_CONNECTION_STRING, {
		maxRetriesPerRequest: null,
	});
	const paymentProcessingQueue: PaymentProcessingQueueType = new Queue(
		queueName,
		{
			connection: redis,
		},
	);

	const productService =
		overrides?.productService ??
		ProductService({
			vippsFactory: factory,
			paymentProcessingQueue,
			productRepository,
			config: {
				useTestMode: true,
				returnUrl: env.SERVER_URL,
			},
		});
	const { handler } = getPaymentProcessingHandler({
		productService,
		log: mockDeep(),
	});

	const worker: PaymentProcessingWorkerType = new Worker(queueName, handler, {
		connection: redis,
	});

	const queueEventsRedis = new Redis(env.REDIS_CONNECTION_STRING, {
		maxRetriesPerRequest: null,
	});

	const queueEvents = new QueueEvents(queueName, {
		connection: queueEventsRedis,
	});

	const close = async () => {
		await queueEvents.close();
		await paymentProcessingQueue.close();
		await worker.close(true);
		queueEventsRedis.disconnect();
		redis.disconnect();
	};

	await worker.waitUntilReady();
	await queueEvents.waitUntilReady();
	await paymentProcessingQueue.waitUntilReady();

	return {
		productService,
		close,
		vippsMock: client,
		queueEvents,
		paymentProcessingQueue,
		worker,
		queueName,
	};
}
