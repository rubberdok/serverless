import type { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { InvalidArgumentError, NotFoundError } from "~/domain/errors.js";
import {
	type Merchant,
	type Order,
	type PaymentAttempt,
	PaymentAttemptFromDSO,
	type Product,
} from "~/domain/products.js";
import { prismaKnownErrorCodes } from "~/lib/prisma.js";

export class ProductRepository {
	constructor(private db: PrismaClient) {}

	/**
	 * createMerchant creates a merchant.
	 *
	 * @throws {InvalidArgumentError} if a merchant with the same clientId already exists.
	 */
	async createMerchant(merchant: {
		name: string;
		clientSecret: string;
		clientId: string;
		serialNumber: string;
		subscriptionKey: string;
	}): Promise<{ merchant: Merchant }> {
		try {
			const created = await this.db.merchant.create({
				data: merchant,
			});
			return { merchant: created };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (
					err.code === prismaKnownErrorCodes.ERR_UNIQUE_CONSTRAINT_VIOLATION
				) {
					throw new InvalidArgumentError(
						"A merchant with this clientId already exists",
					);
				}
			}
			throw err;
		}
	}

	/**
	 * updateMerchant updates a merchant.
	 * @throws {InvalidArgumentError} if a merchant with the same clientId already exists.
	 */
	async updateMerchant(
		merchant: Partial<{
			name: string;
			clientSecret: string;
			clientId: string;
			serialNumber: string;
			subscriptionKey: string;
		}> & { id: string },
	): Promise<{ merchant: Merchant }> {
		try {
			const updated = await this.db.merchant.update({
				where: {
					id: merchant.id,
				},
				data: merchant,
			});
			return { merchant: updated };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (
					err.code === prismaKnownErrorCodes.ERR_UNIQUE_CONSTRAINT_VIOLATION
				) {
					throw new InvalidArgumentError(
						"A merchant with this clientId already exists",
					);
				}
			}
			throw err;
		}
	}

	/**
	 * createOrder creates an order for a product, and decrements the product's remaining quantity.
	 *
	 */
	async createOrder(order: {
		userId: string;
		product: {
			id: string;
			version: number;
		};
	}): Promise<{ order: Order; product: Product }> {
		const { userId, product } = order;
		const orderPromise = this.db.order.create({
			data: {
				userId,
				productId: product.id,
			},
		});
		const productPromise = this.db.product.update({
			include: {
				merchant: true,
			},
			where: {
				id: product.id,
				version: product.version,
			},
			data: {
				remainingQuantity: {
					decrement: 1,
				},
				version: {
					increment: 1,
				},
			},
		});
		try {
			const [orderResult, productResult] = await this.db.$transaction([
				orderPromise,
				productPromise,
			]);
			return { order: orderResult, product: productResult };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === prismaKnownErrorCodes.ERR_NOT_FOUND) {
					throw new NotFoundError(`
						Product could not be found.
						This is either because the product does not exist,
						or someone else has updated the product in the meantime,
						or the product is out of stock.
					`);
				}
			}
			throw err;
		}
	}

	/**
	 * createPaymentAttempt creates a payment attempt for an order, and increments the order's attempt counter.
	 */
	async createPaymentAttempt(paymentAttempt: {
		order: {
			id: string;
			version: number;
		};
		reference: string;
	}): Promise<{ paymentAttempt: PaymentAttempt; order: Order }> {
		const { reference, order } = paymentAttempt;
		const paymentAttemptPromise = this.db.paymentAttempt.create({
			data: {
				orderId: order.id,
				reference,
			},
		});
		const orderPromise = this.db.order.update({
			where: {
				id: order.id,
				version: order.version,
			},
			data: {
				attempt: {
					increment: 1,
				},
				version: {
					increment: 1,
				},
			},
		});

		try {
			/**
			 * Wrap the promises in a transaction so that we can be sure that the order's attempt counter is incremented
			 * if the payment attempt is created.
			 */
			const [paymentAttemptResult, orderResult] = await this.db.$transaction([
				paymentAttemptPromise,
				orderPromise,
			]);

			return {
				paymentAttempt: PaymentAttemptFromDSO(paymentAttemptResult),
				order: orderResult,
			};
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === prismaKnownErrorCodes.ERR_NOT_FOUND) {
					throw new NotFoundError(`
						Order could not be found.
						This is either because the order does not exist,
						or someone else has updated the order in the meantime.
					`);
				}
			}
			throw err;
		}
	}

	/**
	 * getProduct returns a product.
	 */
	async getProduct(id: string): Promise<{ product: Product | null }> {
		const product = await this.db.product.findUnique({
			include: {
				merchant: true,
			},
			where: {
				id,
			},
		});
		return { product };
	}

	/**
	 * getOrder returns an order.
	 */
	async getOrder(id: string): Promise<{ order: Order | null }> {
		const order = await this.db.order.findUnique({
			where: {
				id,
			},
		});
		return { order };
	}

	/**
	 * getPamentAttempt returns a payment attempt.
	 */
	async getPaymentAttempt(
		by: { id: string } | { reference: string },
	): Promise<{ paymentAttempt: PaymentAttempt | null }> {
		const attempt = await this.db.paymentAttempt.findUnique({
			where: by,
		});
		if (!attempt) {
			return { paymentAttempt: null };
		}
		return { paymentAttempt: PaymentAttemptFromDSO(attempt) };
	}

	/**
	 * updatePaymentAttempt updates a payment attempt.
	 */
	async updatePaymentAttempt(
		paymentAttempt: Pick<PaymentAttempt, "state" | "id" | "version">,
	): Promise<{ paymentAttempt: PaymentAttempt }> {
		try {
			const updated = await this.db.paymentAttempt.update({
				where: {
					id: paymentAttempt.id,
					version: paymentAttempt.version,
				},
				data: {
					state: paymentAttempt.state,
					version: {
						increment: 1,
					},
				},
			});

			return { paymentAttempt: PaymentAttemptFromDSO(updated) };
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === prismaKnownErrorCodes.ERR_NOT_FOUND) {
					throw new NotFoundError(`
					Payment attempt could not be found.
					This is either because the payment attempt does not exist,
					or someone else has updated the payment attempt in the meantime.
				`);
				}
			}
			throw err;
		}
	}

	/**
	 * getProduct returns a product.
	 */
	async getProducts(): Promise<{ products: Product[]; total: number }> {
		const [products, count] = await this.db.$transaction([
			this.db.product.findMany({
				include: {
					merchant: true,
				},
			}),
			this.db.product.count(),
		]);
		return { products, total: count };
	}

	/**
	 * createProduct creates a product.
	 */
	async createProduct(product: {
		name: string;
		price: number;
		merchantId: string;
	}): Promise<{ product: Product }> {
		const created = await this.db.product.create({
			include: {
				merchant: true,
			},
			data: product,
		});
		return { product: created };
	}
}
