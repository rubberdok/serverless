import { AuthenticationError } from "~/domain/errors.js";
import { User } from "~/domain/users.js";
import { ApolloContext } from "~/lib/apollo-server.js";

type AuthenticatedContext = ApolloContext & {
  req: { session: { userId: string; authenticated: true } };
  user: User;
};

/**
 * Assert that the user is authenticated
 *
 * @throws {AuthenticationError} - If the user is not authenticated
 * @param ctx - The context to check
 * @returns void, narrows the type of ctx to AuthenticatedContext
 */
export function assertIsAuthenticated(ctx: ApolloContext): asserts ctx is AuthenticatedContext {
  const { authenticated, userId } = ctx.req.session;
  if (authenticated && typeof userId === "string" && userId !== "" && ctx.user !== null) return;
  throw new AuthenticationError("You must be logged in to perform this action.");
}
