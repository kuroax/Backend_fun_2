import { gql } from "graphql-tag";

export const orderTypeDefs = gql`
  scalar DateTime

  # --------------------------
  # Enums
  # --------------------------
  enum OrderStatus {
    PENDING
    PAID
    SHIPPED
    DELIVERED
    CANCELLED
  }

  # --------------------------
  # Types
  # --------------------------
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    totalPrice: Float!
    status: OrderStatus!
    payments: [Payment!]!

    """
    Address snapshot at checkout (copied from Address type).
    Ensures historical accuracy even if the user updates their saved address later.
    """
    shippingAddress: Address!

    # Optional reference to the user's saved Address
    addressId: ID

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Error {
    code: String!
    message: String!
  }

  union OrderResponse = Order | Error

  # --------------------------
  # Inputs
  # --------------------------
  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  input PlaceOrderInput {
    userId: ID!
    items: [OrderItemInput!]!
    addressId: ID! # which saved address to copy
  }

  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    orders(userId: ID!): [Order!]!
    order(id: ID!): OrderResponse
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    placeOrder(input: PlaceOrderInput!): OrderResponse!
    updateOrderStatus(orderId: ID!, status: OrderStatus!): OrderResponse!
  }
`;
