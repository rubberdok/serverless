import { assertIsAuthenticated } from "@/graphql/auth.js";

import type { MutationResolvers } from "./../../../types.generated.js";
export const signUp: NonNullable<MutationResolvers["signUp"]> = async (_parent, { data }, ctx) => {
  assertIsAuthenticated(ctx);
  const { eventId } = data;
  const signUp = await ctx.eventService.signUp(ctx.req.session.userId, eventId);
  return { signUp };
};