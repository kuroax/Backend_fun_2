import { gql } from "graphql-tag";

export const paymentTypeDefs = gql`
  scalar DateTime

  """
  Enumeración de proveedores de pago aceptados en la plataforma.
  """
  enum PaymentProvider {
    STRIPE
    PAYPAL
    CIEBANCO
    MERCADO_PAGO
  }

  """
  Estado actual de un pago.
  """
  enum PaymentStatus {
    INITIATED
    PENDING
    SUCCESSFUL
    FAILED
    REFUNDED
  }

  """
  Representa un registro de pago asociado a un pedido.
  """
  type Payment {
    id: ID!
    order: Order!
    user: User!
    provider: PaymentProvider!
    transactionId: String!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    method: String              # tarjeta, transferencia, efectivo
    receiptUrl: String          # enlace al comprobante (Stripe, PayPal, etc.)
    authorizationCode: String   # código de autorización bancaria
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  """
  Respuesta estructurada para operaciones de pago.
  """
  type PaymentPayload {
    success: Boolean!
    message: String
    payment: Payment
  }

  """
  Input para iniciar un pago.
  """
  input InitiatePaymentInput {
    orderId: ID!
    provider: PaymentProvider!
    method: String
  }

  """
  Input para confirmar o actualizar el estado de un pago existente.
  """
  input ConfirmPaymentInput {
    paymentId: ID!
    status: PaymentStatus!
    transactionId: String!
    authorizationCode: String
    receiptUrl: String
  }

  extend type Query {
    """
    Obtiene todos los pagos asociados a un pedido específico.
    """
    getPaymentsByOrder(orderId: ID!): [Payment!]!
  }

  extend type Mutation {
    """
    Inicia el proceso de pago para un pedido.
    """
    initiatePayment(input: InitiatePaymentInput!): PaymentPayload!

    """
    Confirma o actualiza el estado de un pago existente.
    """
    confirmPayment(input: ConfirmPaymentInput!): PaymentPayload!
  }
`;
