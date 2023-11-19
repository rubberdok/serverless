import assert from "assert";

import { ApolloServer } from "@apollo/server";
import { FastifySessionObject } from "@fastify/session";
import { ResultOf, TypedDocumentNode, VariablesOf } from "@graphql-typed-document-node/core";
import { FastifyReply, FastifyRequest } from "fastify";
import { GraphQLFormattedError } from "graphql";
import { mock, mockDeep } from "jest-mock-extended";

import { getFormatErrorHandler, ApolloContext } from "@/lib/apollo-server.js";

import { resolvers } from "../resolvers.generated.js";
import { typeDefs } from "../type-defs.generated.js";

interface QueryResult<T extends TypedDocumentNode<ResultOf<T>, VariablesOf<T>>> {
  data?: ResultOf<T>;
  errors?: readonly GraphQLFormattedError[];
}

class ApolloServerClient {
  constructor(public server: ApolloServer<ApolloContext>) {}

  async query<T extends TypedDocumentNode<ResultOf<T>, VariablesOf<T>>>(
    request: { query: T; variables?: VariablesOf<T> },
    options?: { contextValue?: ApolloContext }
  ): Promise<QueryResult<T>> {
    // @ts-expect-error We can get more accurate typing for variables by using the `VariablesOf` helper
    // so we ignore the TS error raised here.
    const res = await this.server.executeOperation<ResultOf<T>, VariablesOf<T>>(
      {
        query: request.query,
        variables: request.variables,
      },
      {
        contextValue: options?.contextValue,
      }
    );

    assert(res.body.kind === "single");

    let errors: readonly GraphQLFormattedError[] | undefined;
    if (res.body.singleResult.errors) {
      errors = res.body.singleResult.errors;
    }

    let data: ResultOf<T> | undefined;
    if (res.body.singleResult.data) {
      data = res.body.singleResult.data;
    }

    return { data, errors };
  }

  public async mutate<T extends TypedDocumentNode<ResultOf<T>, VariablesOf<T>>>(
    request: { mutation: T; variables?: VariablesOf<T> },
    options?: { contextValue?: ApolloContext }
  ): Promise<QueryResult<T>> {
    const { mutation, variables } = request;
    return this.query({ query: mutation, variables }, options);
  }
}

export const createMockApolloServer = () => {
  const server = new ApolloServer<ApolloContext>({
    typeDefs: typeDefs,
    resolvers: resolvers,
    formatError: getFormatErrorHandler(),
  });

  const userService = mockDeep<ApolloContext["userService"]>();
  const organizationService = mockDeep<ApolloContext["organizationService"]>();
  const cabinService = mockDeep<ApolloContext["cabinService"]>();
  const authService = mockDeep<ApolloContext["authService"]>();

  function createMockContext(session: Partial<FastifySessionObject>) {
    const contextValue = {
      req: mock<FastifyRequest>({
        session: mock<FastifySessionObject>(session),
      }),
      res: mock<FastifyReply>(),
      userService,
      organizationService,
      cabinService,
      authService,
    };
    return contextValue;
  }

  const client = new ApolloServerClient(server);

  return { userService, organizationService, cabinService, authService, createMockContext, server, client };
};