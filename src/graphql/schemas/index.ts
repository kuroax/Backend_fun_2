// src/graphql/schemas/index.ts
import { gql } from "graphql-tag";
import { mergeTypeDefs } from "@graphql-tools/merge";

import { userTypeDefs } from "./userTypeDefs.js";
import { productTypeDefs } from "./productTypeDefs.js";
import { categoryTypeDefs } from "./categoryTypeDefs.js";
import { addressTypeDefs } from "./addressTypeDefs.js";   
import { orderTypeDefs } from "./orderTypeDefs.js";       
import { cartTypeDefs } from "./cartTypeDefs.js";
import { paymentTypeDefs } from "./paymentTypeDefs.js";

/**
 * Root SDL — ensures base Query and Mutation types exist.
 */
const rootTypeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

/**
 * Merge all type definitions using @graphql-tools/merge.
 * Required for schemas using `extend type` across multiple files.
 */
export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  userTypeDefs,
  productTypeDefs,
  categoryTypeDefs,
  addressTypeDefs,  
  orderTypeDefs,  
  cartTypeDefs,
  paymentTypeDefs,
]);
