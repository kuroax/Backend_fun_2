import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number; // snapshot of product price at purchase time
}

export interface IOrder extends Document {
  user: Types.ObjectId;       // reference to User
  items: IOrderItem[];        // products purchased
  totalPrice: number;         // final total at checkout
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";

  // Relationship with Payment model
  payments: Types.ObjectId[]; // references to Payment docs

  // Shipping info
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],

    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Index for quick lookups by user and status
orderSchema.index({ user: 1, status: 1 });

export const Order = model<IOrder>("Order", orderSchema);
