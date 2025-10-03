import { gql } from "graphql-tag";

export const categoryTypeDefs = gql`
  scalar DateTime

  """
  Represents a product category in the catalog
  """
  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    isActive: Boolean!
    products(limit: Int, offset: Int): [Product!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Error {
    code: String!
    message: String!
  }

  union CategoryResponse = Category | Error

  # --------------------------
  # Inputs
  # --------------------------
  input CreateCategoryInput {
    name: String!
    slug: String!
    description: String
    isActive: Boolean = true
  }

  input UpdateCategoryInput {
    name: String
    slug: String
    description: String
    isActive: Boolean
  }

  input GetAllCategoriesInput {
    limit: Int
    offset: Int
    isActive: Boolean
  }

  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    getAllCategories(input: GetAllCategoriesInput): [Category!]!
    getCategoryById(id: ID!): CategoryResponse
    getCategoryBySlug(slug: String!): CategoryResponse
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    createCategory(input: CreateCategoryInput!): CategoryResponse!
    updateCategoryById(id: ID!, input: UpdateCategoryInput!): CategoryResponse!
    deleteCategoryById(id: ID!): CategoryResponse!
  }
`;
