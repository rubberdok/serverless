/* eslint-disable */
import * as types from './graphql.js';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n          query getUsers {\n            users {\n              users {\n                id\n              }\n              total\n            }\n          }\n        ": types.GetUsersDocument,
    "\n              mutation createOrganization1 {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            ": types.CreateOrganization1Document,
    "\n              mutation createOrganization {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            ": types.CreateOrganizationDocument,
    "\n              mutation updateOrganization1 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            ": types.UpdateOrganization1Document,
    "\n              mutation updateOrganization2 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            ": types.UpdateOrganization2Document,
    "\n              mutation addMember1 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            ": types.AddMember1Document,
    "\n              mutation addMember2 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            ": types.AddMember2Document,
    "\n              mutation removeMember1 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            ": types.RemoveMember1Document,
    "\n              mutation removeMember2 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            ": types.RemoveMember2Document,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          query getUsers {\n            users {\n              users {\n                id\n              }\n              total\n            }\n          }\n        "): (typeof documents)["\n          query getUsers {\n            users {\n              users {\n                id\n              }\n              total\n            }\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation createOrganization1 {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation createOrganization1 {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation createOrganization {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation createOrganization {\n                createOrganization(data: { name: \"test\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation updateOrganization1 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation updateOrganization1 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation updateOrganization2 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation updateOrganization2 {\n                updateOrganization(data: { name: \"test\", id: \"id\" }) {\n                  organization {\n                    id\n                    name\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation addMember1 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation addMember1 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation addMember2 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation addMember2 {\n                addMember(data: { userId: \"user\", organizationId: \"org\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation removeMember1 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation removeMember1 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n              mutation removeMember2 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "): (typeof documents)["\n              mutation removeMember2 {\n                removeMember(data: { id: \"id\" }) {\n                  member {\n                    id\n                    organization {\n                      id\n                      members {\n                        id\n                      }\n                    }\n                  }\n                }\n              }\n            "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;