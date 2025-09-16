import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  order: Types.ObjectId;          // link to Order
  user: Types.ObjectId;           // link to User
  provider: "stripe" | "paypal";  // payment provider
  transactionId: string;          // returned by provider
  amount: number;                 // payment amount
  currency: string;               // e.g. USD, EUR
  status: "initiated" | "successful" | "failed" | "refunded";
  rawResponse?: any;              // optional: store provider response (safe subset)
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["stripe", "paypal"], required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["initiated", "successful", "failed", "refunded"],
      default: "initiated",
    },
    rawResponse: { type: Schema.Types.Mixed }, // optional: partial provider response
  },
  { timestamps: true }
);

// Index for quick lookups by order or transaction
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1, provider: 1 }, { unique: true });

export const Payment = model<IPayment>("Payment", paymentSchema);
