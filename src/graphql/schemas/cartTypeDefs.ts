import { gql } from "graphql-tag";

export const cartTypeDefs = gql`
  scalar DateTime

  # --------------------------
  # Types
  # --------------------------
  type CartItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Cart {
    id: ID!
    user: User!
    items: [CartItem!]!
    totalPrice: Float!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Error {
    code: String!
    message: String!
  }

  union CartResponse = Cart | Error

  # --------------------------
  # Inputs
  # --------------------------
  input AddToCartInput {
    userId: ID!
    productId: ID!
    quantity: Int! = 1
  }

  input RemoveFromCartInput {
    userId: ID!
    productId: ID!
  }

  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    cart(userId: ID!): CartResponse
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    addToCart(input: AddToCartInput!): CartResponse!
    removeFromCart(input: RemoveFromCartInput!): CartResponse!
    clearCart(userId: ID!): CartResponse!
  }
`;
