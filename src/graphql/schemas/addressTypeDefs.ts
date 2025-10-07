import { gql } from "graphql-tag";

export const addressTypeDefs = gql`
  scalar DateTime

  """
  Representa una dirección mexicana para envíos y facturación.
  """
  type Address {
    id: ID!
    user: User!
    fullName: String!
    street: String!
    extNumber: String!
    intNumber: String
    neighborhood: String!      # colonia
    municipality: String!      # municipio o alcaldía
    state: String!
    postalCode: String!
    country: String!
    phoneNumber: String!
    deliveryInstructions: String
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Datos para crear una dirección mexicana.
  """
  input CreateAddressInput {
    userId: ID!
    fullName: String!
    street: String!
    extNumber: String!
    intNumber: String
    neighborhood: String!
    municipality: String!
    state: String!
    postalCode: String!
    country: String = "México"
    phoneNumber: String!
    deliveryInstructions: String
    isDefault: Boolean = false
  }

  """
  Datos para actualizar una dirección existente.
  """
  input UpdateAddressInput {
    fullName: String
    street: String
    extNumber: String
    intNumber: String
    neighborhood: String
    municipality: String
    state: String
    postalCode: String
    country: String
    phoneNumber: String
    deliveryInstructions: String
    isDefault: Boolean
  }

  type Error {
    code: String!
    message: String!
  }

  union AddressResponse = Address | Error

  extend type Query {
    getAddressById(id: ID!): AddressResponse
    getUserAddresses(userId: ID!): [Address!]!
  }

  extend type Mutation {
    createAddress(input: CreateAddressInput!): AddressResponse!
    updateAddressById(id: ID!, input: UpdateAddressInput!): AddressResponse!
    deleteAddressById(id: ID!): AddressResponse!
  }
`;
