import { gql } from "graphql-tag";

export const addressTypeDefs = gql`
  scalar DateTime

  # --------------------------
  # Types
  # --------------------------
  type Address {
    id: ID!
    user: User!
    fullName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String
    postalCode: String!
    country: String!
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Error {
    code: String!
    message: String!
  }

  # --------------------------
  # Unions
  # --------------------------
  union AddressResponse = Address | Error

  # --------------------------
  # Inputs
  # --------------------------
  input CreateAddressInput {
    userId: ID!
    fullName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String
    postalCode: String!
    country: String!
    isDefault: Boolean = false
  }

  input UpdateAddressInput {
    fullName: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    postalCode: String
    country: String
    isDefault: Boolean
  }

  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    getAddressById(id: ID!): AddressResponse
    getUserAddresses(userId: ID!): [Address!]!
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    createAddress(input: CreateAddressInput!): AddressResponse!
    updateAddressById(id: ID!, input: UpdateAddressInput!): AddressResponse!
    deleteAddressById(id: ID!): AddressResponse!
  }
`;
