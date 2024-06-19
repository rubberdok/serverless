import { type ResultPromise, execa } from "execa";

const timeout = 240_00;

describe("Development scripts", () => {
	let timeoutHandle: NodeJS.Timeout | undefined;
	let inactivtiyHandle: NodeJS.Timeout | undefined;
	let proc: ResultPromise | undefined;

	afterAll(() => {
		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
		}
		if (inactivtiyHandle) {
			clearTimeout(inactivtiyHandle);
		}
		proc?.kill();
	});

	beforeAll(async () => {
		await execa({})("pnpm", ["run", "setup"]);
	}, 60_000);

	describe("pnpm run dev", () => {
		it(
			`starts the dev server in less than ${timeout / 1000} seconds`,
			async () => {
				let serverListening = false;
				let prismaGenerated = false;
				let workerReady = false;
				let graphqlGenerated = false;
				proc = execa({
					lines: true,
					timeout,
					stdout: ["pipe", "inherit"],
					env: {
						// pino-pretty does some tricks with stdout, so we run with NODE_ENV=production for regular log output
						NODE_ENV: "production",
						FEIDE_CLIENT_SECRET: "test",
						POSTMARK_API_TOKEN: "test",
					},
				})("pnpm", ["run", "dev"], { shell: true });

				/**
				 * If we haven't received a log message from the process in 5 seconds, kill the process
				 */
				inactivtiyHandle = setTimeout(() => {
					if (!proc?.killed) {
						proc?.kill("SIGINT");
					}
				}, timeout);

				timeoutHandle = setTimeout(() => {
					console.log("Max timeout reached, killing process");
					proc?.kill();
					clearTimeout(inactivtiyHandle);
				}, timeout);

				for await (const line of proc) {
					const message = line.toString();
					if (message) {
						clearTimeout(inactivtiyHandle);
						inactivtiyHandle = setTimeout(() => {
							console.log("Killing process due to inactivity");
							proc?.kill("SIGINT");
						}, 60_000);
					}
					if (message.includes("Restarting './src/server.ts'")) {
						serverListening = false;
					}
					if (message.includes("Server listening at http://0.0.0.0:4000")) {
						console.log("Server registered as listening");
						serverListening = true;
					}

					if (message.includes("[prisma] Watching...")) {
						prismaGenerated = false;
					}
					if (message.includes("Generated Prisma Client")) {
						console.log("Prisma generated");
						prismaGenerated = true;
					}

					if (message.includes("[gql] [STARTED] Parse Configuration")) {
						graphqlGenerated = false;
					}
					if (message.includes("[gql] [SUCCESS] Generate outputs")) {
						console.log("GraphQL generated");
						graphqlGenerated = true;
					}

					if (message.includes("Starting worker")) {
						workerReady = false;
					}
					if (message.includes("Worker ready")) {
						console.log("Worker ready");
						workerReady = true;
					}
				}

				await proc;

				expect(serverListening).toBe(true);
				expect(prismaGenerated).toBe(true);
				expect(workerReady).toBe(true);
				expect(graphqlGenerated).toBe(true);
				expect(proc.killed).toBe(true);
			},
			timeout + 30_000,
		);
	});
});
