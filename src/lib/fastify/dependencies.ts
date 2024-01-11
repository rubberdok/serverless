import type { PrismaClient } from "@prisma/client";
import { Queue } from "bullmq";
import fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { Redis } from "ioredis";
import { env } from "~/config.js";
import type { User } from "~/domain/users.js";
import { CabinRepository } from "~/repositories/cabins/index.js";
import { EventRepository } from "~/repositories/events/repository.js";
import { ListingRepository } from "~/repositories/listings/repository.js";
import { MemberRepository } from "~/repositories/organizations/members.js";
import { OrganizationRepository } from "~/repositories/organizations/organizations.js";
import { UserRepository } from "~/repositories/users/index.js";
import { feideClient } from "~/services/auth/clients.js";
import { AuthService } from "~/services/auth/service.js";
import { CabinService } from "~/services/cabins/service.js";
import { EventService } from "~/services/events/service.js";
import { ListingService } from "~/services/listings/index.js";
import { MailService } from "~/services/mail/index.js";
import { OrganizationService } from "~/services/organizations/service.js";
import { PermissionService } from "~/services/permissions/service.js";
import { UserService } from "~/services/users/service.js";
import type { ApolloServerDependencies } from "../apollo-server.js";
import postmark from "../postmark.js";
import prisma from "../prisma.js";
import { createRedisClient } from "../redis.js";
import { envToLogger } from "./logging.js";

interface IAuthService {
	userLoginCallback(req: FastifyRequest, data: { code: string }): Promise<User>;
	studyProgramCallback(
		req: FastifyRequest,
		data: { code: string },
	): Promise<User>;
	authorizationUrl(
		req: FastifyRequest,
		postAuthorizationRedirectUrl?: string | null,
		kind?: "login" | "studyProgram",
	): string;
	logout(req: FastifyRequest): Promise<void>;
	login(req: FastifyRequest, user: User): Promise<User>;
}

export interface ServerDependencies {
	createRedisClient: typeof createRedisClient;
	prisma: PrismaClient;
	authService: IAuthService;
	apolloServerDependencies: ApolloServerDependencies;
	app: FastifyInstance;
}

/**
 * Utility function to create a `Dependencies` object with the specified overrides.
 * @param overrides - The overrides to apply to the default `Dependencies` object.
 * @returns A `Dependencies` object with the specified overrides.
 */
export function dependenciesFactory(): ServerDependencies {
	const app = fastify({
		logger: envToLogger[env.NODE_ENV],
		ignoreTrailingSlash: true,
	});

	const cabinRepository = new CabinRepository(prisma);
	const userRepository = new UserRepository(prisma);
	const memberRepository = new MemberRepository(prisma);
	const organizationRepository = new OrganizationRepository(prisma);
	const eventRepository = new EventRepository(prisma);
	const listingRepository = new ListingRepository(prisma);

	const mailService = new MailService(postmark, env.NO_REPLY_EMAIL);
	const permissionService = new PermissionService(
		memberRepository,
		userRepository,
		organizationRepository,
	);
	const organizationService = new OrganizationService(
		organizationRepository,
		memberRepository,
		permissionService,
	);
	const listingService = new ListingService(
		listingRepository,
		permissionService,
	);
	const cabinService = new CabinService(
		cabinRepository,
		mailService,
		permissionService,
	);
	const redisQueueClient = new Redis(env.REDIS_CONNECTION_STRING, {
		keepAlive: 1_000 * 60 * 3, // 3 minutes
		maxRetriesPerRequest: 0,
	});
	const mailQueue = new Queue<
		{ subject: string; receiverId: string },
		{ status: string },
		"welcome"
	>("email", { connection: redisQueueClient });
	const userService = new UserService(
		userRepository,
		permissionService,
		mailQueue,
	);
	const eventService = new EventService(
		eventRepository,
		permissionService,
		userService,
	);
	const authService = new AuthService(userService, feideClient);

	const apolloServerDependencies: ApolloServerDependencies = {
		cabinService,
		userService,
		organizationService,
		eventService,
		listingService,
		permissionService,
	};

	const defaultDependencies: ServerDependencies = {
		authService,
		apolloServerDependencies,
		prisma: prisma,
		createRedisClient,
		app,
	};

	return defaultDependencies;
}
