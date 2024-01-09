import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import fastifyApollo, {
	type ApolloFastifyContextFunction,
	fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySession from "@fastify/session";
import fastifySentry from "@immobiliarelabs/fastify-sentry";
import * as Sentry from "@sentry/node";
import RedisStore from "connect-redis";
import type { FastifyInstance } from "fastify";
import { env } from "./config.js";
import { NotFoundError, isUserFacingError } from "./domain/errors.js";
import type { User } from "./domain/users.js";
import { resolvers } from "./graphql/resolvers.generated.js";
import { typeDefs } from "./graphql/type-defs.generated.js";
import {
	type ApolloContext,
	getFormatErrorHandler,
} from "./lib/apollo-server.js";
import type { ServerDependencies } from "./lib/fastify/dependencies.js";
import { healthCheckPlugin } from "./lib/fastify/health-checks.js";
import { helmetOptionsByEnv } from "./lib/fastify/helmet.js";
import { fastifyApolloSentryPlugin } from "./lib/sentry.js";
import { getAuthPlugin } from "./services/auth/plugin.js";

interface Options {
	port: number;
	host: string;
}

/**
 * Initialize the Fastify server with an Apollo Server instance.
 *
 * This function is typically called from `src/index.ts` and is the entrypoint to the application.
 * Roughly speaking, this function performs the following steps:
 * 1. Set up and inject dependencies
 *    - PrismaClient (database client)
 *    - Services and Repositories (business logic, data access, and external services)
 *
 * 2. Set up a Fastify server instance
 *    - Set up Sentry monitoring, which we use to monitor the server for errors and performance issues
 *    - Set up security headers, which we use to prevent some common attacks
 *    - Set up CORS, which we use to allow requests from the client
 *    - Set up cookies, which we use to store the session ID on the client
 *    - Set up sessions, which we use for authentication so that we can identify the user making the request
 *    - Set up rate limits, which we use to prevent brute force attacks
 *
 * 3. Set up and connect to Redis, which is a key-value store that we use to store session data
 *
 * 4. Add some lifecycle hooks to the Fastify server, for instance to close the Redis connection when the server closes
 *
 * 5. Set up Apollo Server
 *    - Set up the Apollo Server instance
 *    - Set up the Apollo Server context function, which is used to inject dependencies into the Apollo Server context
 *    - Set up the Apollo Server plugin, which is used to drain the Fastify request and response objects from the Apollo Server context
 *    - Set up the Apollo Server landing page plugin, which is used to display the Apollo Server landing page
 *
 * 6. Set up two health check routes:
 *    - `/-/health` - returns `200: {"status": "ok"}` if the server is running.
 *
 * 7. Start the Fastify server
 *
 * @returns The Fastify server instance
 */
export async function initServer(
	dependencies: ServerDependencies,
	opts: Options,
): Promise<FastifyInstance> {
	const app = await createServer(dependencies);

	const { port, host } = opts;
	/**
	 * Start the Fastify server
	 */
	try {
		await app.listen({
			port,
			host,
		});
	} catch (err) {
		if (err instanceof Error) {
			// Log the error
			app.log.fatal(err, "Error starting server");
			// Capture the error with Sentry and exit the process
			app.Sentry.captureException(err, {
				level: "fatal",
				tags: {
					kind: "server",
				},
			});
		}
		process.exit(1);
	}

	return app;
}

/**
 * Create the Fastify server with an Apollo Server instance and register plugins.
 *
 * This function is rarely called directly, only in test code and `initServer`.
 * Roughly speaking, this function performs the following steps:
 * 1. Set up and inject dependencies
 *    - PrismaClient (database client)
 *    - Services and Repositories (business logic, data access, and external services)
 *
 * 2. Set up a Fastify server instance
 *    - Set up Sentry monitoring, which we use to monitor the server for errors and performance issues
 *    - Set up security headers, which we use to prevent some common attacks
 *    - Set up CORS, which we use to allow requests from the client
 *    - Set up cookies, which we use to store the session ID on the client
 *    - Set up sessions, which we use for authentication so that we can identify the user making the request
 *    - Set up rate limits, which we use to prevent brute force attacks
 *
 * 3. Set up and connect to Redis, which is a key-value store that we use to store session data
 *
 * 4. Add some lifecycle hooks to the Fastify server, for instance to close the Redis connection when the server closes
 *
 * 5. Set up Apollo Server
 *    - Set up the Apollo Server instance
 *    - Set up the Apollo Server context function, which is used to inject dependencies into the Apollo Server context
 *    - Set up the Apollo Server plugin, which is used to drain the Fastify request and response objects from the Apollo Server context
 *    - Set up the Apollo Server landing page plugin, which is used to display the Apollo Server landing page
 *
 * 6. Set up two health check routes:
 *    - `/-/health` - returns `200: {"status": "ok"}` if the server is running.
 *
 * @returns The Fastify server instance
 */
export async function createServer(
	dependencies: ServerDependencies,
): Promise<FastifyInstance> {
	const { apolloServerDependencies, authService, createRedisClient, app } =
		dependencies;

	/**
	 * Set up Sentry monitoring before anything else
	 * so that we can monitor the server for errors and performance issues, even during
	 * the initial setup.
	 */
	await app.register(fastifySentry, {
		dsn: env.SENTRY_DSN,
		environment: env.NODE_ENV,
		tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
		release: env.SENTRY_RELEASE,
		integrations: [
			new Sentry.Integrations.Prisma({ client: dependencies.prisma }),
			new Sentry.Integrations.GraphQL(),
			new Sentry.Integrations.Apollo(),
			new Sentry.Integrations.Anr({ captureStackTrace: true }),
		],
	});

	// Security headers
	app.register(fastifyHelmet, helmetOptionsByEnv[env.NODE_ENV]);

	/**
	 * Register plugins
	 *
	 * CORS:
	 *   - credentials: allow cookies to be sent to the server
	 *   - origin: allow requests from the specified origins
	 */
	await app.register(fastifyCors, {
		credentials: env.CORS_CREDENTIALS,
		origin: env.CORS_ORIGINS,
	});

	// Cookie parser, dependency of fastifySession
	await app.register(fastifyCookie);

	// Must be called after `Sentry` is registered
	const redisClient = createRedisClient(app);

	// Regsiter session plugin
	await app.register(fastifySession, {
		secret: env.SESSION_SECRET,
		cookieName: env.SESSION_COOKIE_NAME,
		saveUninitialized: true,
		store: new RedisStore({
			client: redisClient,
		}),
		cookie: {
			httpOnly: env.SESSION_COOKIE_HTTP_ONLY,
			secure: env.SESSION_COOKIE_SECURE,
			domain: env.SESSION_COOKIE_DOMAIN,
			sameSite: "none",
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	});

	// Rate limit plugin
	await app.register(fastifyRateLimit, {
		max: env.RATE_LIMIT_MAX,
		redis: redisClient,
		nameSpace: "rate-limit",
	});

	/**
	 * Default `authenticated` session variable to false if it is undefined
	 *
	 * biome-ignore lint/nursery/useAwait: Fastify hooks are either sync with callback, or async. Prefer async.
	 */
	app.addHook("preHandler", async (request) => {
		if (typeof request.session.get("authenticated") === "undefined") {
			request.session.set("authenticated", false);
		}
	});

	/**
	 * Set custom error handler to handle user-facing errors
	 */
	app.setErrorHandler((error, _request, reply) => {
		if (isUserFacingError(error)) {
			switch (error.code) {
				// fallthrough
				case "BAD_REQUEST":
				case "BAD_USER_INPUT":
					reply.status(400);
					break;
				case "PERMISSION_DENIED":
					reply.status(403);
					break;
				case "UNAUTHORIZED":
					reply.status(401);
					break;
				case "NOT_FOUND":
					reply.status(404);
					break;
			}
			reply.send({
				message: error.message,
				code: error.code,
				error: error.name,
			});
		} else {
			// Handle these errors with the default error handler
			reply.send(error);
		}
	});

	/**
	 * Close Redis connection when the server closes
	 */
	app.addHook("onClose", async () => {
		await redisClient.quit();
	});

	// Initialize Apollo Server
	const apollo = new ApolloServer<ApolloContext>({
		typeDefs: typeDefs,
		csrfPrevention: true,
		introspection: true,
		resolvers: resolvers,
		formatError: getFormatErrorHandler(
			app.log.child({ service: "apollo-server" }),
		),
		includeStacktraceInErrorResponses: env.NODE_ENV !== "production",
		plugins: [
			fastifyApolloDrainPlugin(app),
			fastifyApolloSentryPlugin(app),
			env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageDisabled()
				: ApolloServerPluginLandingPageLocalDefault({
						footer: false,
						includeCookies: true,
						embed: true,
				  }),
		],
	});

	// Custom context function to inject dependencies into the Apollo Context
	const contextFunction: ApolloFastifyContextFunction<ApolloContext> = async (
		req,
		res,
	) => {
		const transaction = app.Sentry.startTransaction({
			op: "GraphQL",
			name: "GraphQL",
		});
		const { userId, authenticated } = req.session;
		let user: User | null = null;
		if (userId !== undefined && authenticated) {
			try {
				req.log.debug({ userId }, "Fetching user");
				user = await apolloServerDependencies.userService.get(userId);
				req.log.debug({ userId }, "Found user");
			} catch (err) {
				req.log.info({ userId }, "Error fetching user");
				if (err instanceof NotFoundError) {
					req.log.info({ userId }, "User not found, logging out");
					await authService.logout(req);
				} else {
					throw err;
				}
			}
		}

		return {
			...apolloServerDependencies,
			user,
			req,
			res,
			transaction,
		};
	};

	await apollo.start();
	await app.register(fastifyApollo(apollo), {
		context: contextFunction,
	});

	await app.register(healthCheckPlugin, { prefix: "/-" });
	await app.register(getAuthPlugin(authService), { prefix: "/auth" });

	return app;
}
