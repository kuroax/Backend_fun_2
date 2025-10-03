import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  order: Types.ObjectId;           // link to Order
  user: Types.ObjectId;            // link to User
  provider: "stripe" | "paypal";   // payment provider
  transactionId: string;           // returned by provider
  amount: number;                  // payment amount
  currency: string;                // ISO currency code
  status: "initiated" | "successful" | "failed" | "refunded";
  rawResponse?: Record<string, any>; // optional: safe subset of provider response
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["stripe", "paypal"],
      required: true,
      lowercase: true,
      trim: true,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255, // prevents abuse with oversized IDs
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // payments can’t be negative
    },
    currency: {
      type: String,
      required: true,
      default: "MXN",
      uppercase: true,
      minlength: 3,
      maxlength: 3, // enforce ISO-4217 format
      trim: true,
    },
    status: {
      type: String,
      enum: ["initiated", "successful", "failed", "refunded"],
      default: "initiated",
    },
    rawResponse: {
      type: Schema.Types.Mixed, // optional provider response subset
      select: false,            // 🚨 hidden by default for security
    },
  },
  { timestamps: true }
);

// 🔹 Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1, provider: 1 }, { unique: true });

export const Payment = model<IPayment>("Payment", paymentSchema);
