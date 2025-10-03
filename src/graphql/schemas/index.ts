import { mergeTypeDefs } from "@graphql-tools/merge";
import {gql} from "graphql-tag";

import { userTypeDefs } from "./userTypeDefs";
import { productTypeDefs } from "./productTypeDefs";
import { categoryTypeDefs } from "./categoryTypeDefs";
import { cartTypeDefs } from "./cartTypeDefs";
import { orderTypeDefs } from "./orderTypeDefs";
import { paymentTypeDefs } from "./paymentTypeDefs";

// Root Query and Mutation (so other schemas can extend them)
const baseTypeDefs = gql`
  type Query
  type Mutation
`;

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  productTypeDefs,
  categoryTypeDefs,
  cartTypeDefs,
  orderTypeDefs,
  paymentTypeDefs,
]);
