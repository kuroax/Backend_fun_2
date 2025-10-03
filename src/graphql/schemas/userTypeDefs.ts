import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  scalar DateTime

  # --------------------------
  # Enums
  # --------------------------
  enum UserRole {
    USER
    ADMIN
  }

  # --------------------------
  # Types
  # --------------------------
  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Auth response containing JWT and user data
  type AuthPayload {
    token: String!
    user: User!
  }

  type Error {
    code: String!
    message: String!
  }

  # --------------------------
  # Unions (for error handling)
  # --------------------------
  union UserResponse = User | Error
  union AuthResponse = AuthPayload | Error

  # --------------------------
  # Inputs
  # --------------------------
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: UserRole = USER
  }

  input AuthenticateUserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
  }

  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    getAllUsers(limit: Int, offset: Int): [User!]!
    getUserById(id: ID!): UserResponse
    getUserByEmail(email: String!): UserResponse
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    createUser(input: CreateUserInput!): AuthResponse!
    authenticateUser(input: AuthenticateUserInput!): AuthResponse!
    updateUserById(id: ID!, input: UpdateUserInput!): UserResponse!
    deleteUserById(id: ID!): UserResponse!
  }
`;
