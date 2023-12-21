import { assertIsAuthenticated } from "~/graphql/auth.js";
import type { MutationResolvers } from "./../../../types.generated.js";
export const createListing: NonNullable<MutationResolvers["createListing"]> = async (_parent, { data }, ctx) => {
  assertIsAuthenticated(ctx);
  const { closesAt, ...rest } = data;
  const listing = await ctx.listingService.create(ctx.user.id, {
    closesAt: new Date(closesAt),
    ...rest,
  });
  return { listing };
};
