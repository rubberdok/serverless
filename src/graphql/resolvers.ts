import { mergeResolvers } from "@graphql-tools/merge";

import { resolvers as authResolvers } from "./auth/resolvers.js";
import { resolvers as cabinResolvers } from "./cabins/resolvers.js";
import type { Resolvers } from "./__types__.js";
import { resolvers as scalarResolvers } from "./scalars/resolvers.js";
import { resolvers as userResolvers } from "./users/resolvers.js";

export const resolvers: Resolvers = mergeResolvers([userResolvers, cabinResolvers, scalarResolvers, authResolvers]);
