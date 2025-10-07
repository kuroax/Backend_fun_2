import { gql } from "graphql-tag";

export const orderTypeDefs = gql`
  scalar DateTime

  """
  Representa un producto incluido en un pedido.
  """
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  """
  Representa la dirección de envío mexicana usada en el pedido (snapshot).
  """
  type ShippingAddress {
    fullName: String!
    street: String!
    extNumber: String!
    intNumber: String
    neighborhood: String!
    municipality: String!
    state: String!
    postalCode: String!
    country: String!
    phoneNumber: String!
    deliveryInstructions: String
  }

  """
  Representa un pedido realizado por un usuario.
  """
  type Order {
    id: ID!
    user: User!
    items: [OrderItem!]!
    totalPrice: Float!
    status: String!
    payments: [Payment!]!
    shippingAddress: ShippingAddress!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Input para colocar un nuevo pedido en México.
  """
  input PlaceOrderInput {
    userId: ID!
    addressId: ID!                # referencia a AddressMX
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  """
  Input para actualizar el estado del pedido (administrador o sistema).
  """
  input UpdateOrderStatusInput {
    orderId: ID!
    status: String!
  }

  """
  Respuesta para operaciones de pedidos.
  """
  type OrderPayload {
    success: Boolean!
    message: String
    order: Order
  }

  extend type Query {
    getOrdersByUser(userId: ID!): [Order!]!
    getOrderById(id: ID!): Order
  }

  extend type Mutation {
    placeOrder(input: PlaceOrderInput!): OrderPayload!
    updateOrderStatus(input: UpdateOrderStatusInput!): OrderPayload!
    cancelOrder(orderId: ID!): OrderPayload!
  }
`;
