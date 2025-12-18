import { Schema, model, Document, Types } from "mongoose";

export type PaymentProvider = "STRIPE" | "PAYPAL" | "CIEBANCO" | "MERCADO_PAGO";
export type PaymentStatus = "INITIATED" | "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";

export interface IPayment extends Document {
  order: Types.ObjectId;             // reference to OrderMX
  user: Types.ObjectId;              // reference to User
  provider: PaymentProvider;         // enum of supported providers
  transactionId: string;             // returned by provider
  authorizationCode?: string;        // bank / provider auth code
  method?: string;                   // card, transfer, cash, etc.
  amount: number;                    // payment amount
  currency: string;                  // MXN, USD, etc.
  status: PaymentStatus;             // current payment state
  receiptUrl?: string;               // link to proof of payment
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: {
      type: String,
      enum: ["STRIPE", "PAYPAL", "CIEBANCO", "MERCADO_PAGO"],
      required: true,
    },
    transactionId: { type: String, required: true, trim: true },
    authorizationCode: { type: String, trim: true, maxlength: 100 },
    method: { type: String, trim: true, maxlength: 50 },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "MXN", trim: true, maxlength: 10 },
    status: {
      type: String,
      enum: ["INITIATED", "PENDING", "SUCCESSFUL", "FAILED", "REFUNDED"],
      default: "INITIATED",
    },
    receiptUrl: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// 🔹 Indexes for fast lookups
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1, provider: 1 }, { unique: true });
paymentSchema.index({ user: 1, createdAt: -1 });

// 🔹 Validation hook: ensure amount is positive
paymentSchema.pre("save", function (next) {
  if (this.amount <= 0) {
    return next(new Error("Payment amount must be greater than zero."));
  }
  next();
});

export const Payment = model<IPayment>("Payment", paymentSchema);
