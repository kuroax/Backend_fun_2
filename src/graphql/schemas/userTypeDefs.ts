import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  scalar DateTime

  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    role: UserRole = USER
  }

  input UpdateUserInput {
    name: String
    email: String
    role: UserRole
  }

  type MessageResponse {
    message: String!
  }

  type PasswordResetResponse {
    message: String!
    resetToken: String
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    registerUser(input: RegisterUserInput!): User!
    loginUser(email: String!, password: String!): AuthPayload!

    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): MessageResponse!

    requestPasswordReset(email: String!): PasswordResetResponse!
    resetUserPassword(
      userId: ID!
      resetToken: String!
      newPassword: String!
    ): MessageResponse!
  }
`;
