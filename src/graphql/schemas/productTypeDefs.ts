import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  scalar DateTime

  # --------------------------
  # Enums
  # --------------------------
  enum CurrencyCode {
    USD
    EUR
    MXN
    GBP
    JPY
  }

  # --------------------------
  # Types
  # --------------------------
  """
  Represents an image belonging to a product
  """
  type Image {
    url: String!
    alt: String
    isMain: Boolean
  }

  """
  Represents a product in the catalog
  """
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    discountPrice: Float
    currency: CurrencyCode!
    stock: Int!
    sku: String!
    category: Category!
    images: [Image!]!
    rating: Float
    reviewCount: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Error {
    code: String!
    message: String!
  }

  # --------------------------
  # Unions (for error handling)
  # --------------------------
  union ProductResponse = Product | Error

  # --------------------------
  # Inputs
  # --------------------------
  input ImageInput {
    url: String!
    alt: String
    isMain: Boolean
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    discountPrice: Float
    currency: CurrencyCode = USD
    stock: Int!
    sku: String!
    categoryId: ID!
    images: [ImageInput!]!
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    discountPrice: Float
    currency: CurrencyCode
    stock: Int
    sku: String
    categoryId: ID
    images: [ImageInput!]
  }

  input GetAllProductsInput {
    limit: Int
    offset: Int
    categoryId: ID
    search: String
  }

  input GetProductsByCategoryInput {
    categoryId: ID!
    limit: Int
    offset: Int
  }


  # --------------------------
  # Queries
  # --------------------------
  extend type Query {
    getAllProducts(input: GetAllProductsInput): [Product!]!
    getProductById(id: ID!): ProductResponse
    getProductsByCategory(input: GetProductsByCategoryInput!): [Product!]!
  }

  # --------------------------
  # Mutations
  # --------------------------
  extend type Mutation {
    createProduct(input: CreateProductInput!): ProductResponse!
    updateProductById(id: ID!, input: UpdateProductInput!): ProductResponse!
    deleteProductById(id: ID!): ProductResponse!
  }
`;
