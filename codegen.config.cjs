// @ts-check

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
  overwrite: true,
  schema: "src/graphql/type-defs.ts",
  emitLegacyCommonJSImports: false,
  generates: {
    "src/graphql/__types__.ts": {
      config: {
        useIndexSignature: true,
        showUnusedMappers: true,
        immutableTypes: true,
        strictScalars: true,

        scalars: {
          DateTime: "Date",
        },

        contextType: "@/graphql/context.js#IContext",

        mapperTypeSuffix: "Model",

        mappers: {
          User: "@prisma/client#User",
          Cabin: "@prisma/client#Cabin",
          Booking: "@prisma/client#Booking",
        },
      },
      plugins: [
        {
          add: {
            content: `
/* eslint-disable */
/* prettier-ignore */

/**
 * This file was automatically generated by 'graphql-codegen'.
 * Please do not edit this file directly.
 */
            `,
          },
        },
        "typescript",
        "typescript-resolvers",
      ],
    },
    "schema.graphql": {
      plugins: [
        {
          add: {
            content: `
# This file was automatically generated by 'graphql-codegen'.
# Please do not edit this file directly.
# To update this file, run \`npm run generate:gql\`
`,
          },
        },
        "schema-ast",
      ],
    },
  },
};

module.exports = config;
