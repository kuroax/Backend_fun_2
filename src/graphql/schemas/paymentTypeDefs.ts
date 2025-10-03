import {gql} from "graphql-tag";

export const paymentTypeDefs = gql`
  type Payment {
    id: ID!
    order: Order!
    user: User!
    provider: String!
    transactionId: String!
    amount: Float!
    currency: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    payments(orderId: ID!): [Payment!]!
  }

  extend type Mutation {
    initiatePayment(orderId: ID!, provider: String!): Payment
    confirmPayment(paymentId: ID!, status: String!, transactionId: String!): Payment
  }
`;
