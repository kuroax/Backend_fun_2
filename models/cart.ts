import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number; // capture price at order time
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "paypal" | "cash";
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cash"],
      required: true,
    },
    shippingAddress: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Index to quickly find orders by user and status
orderSchema.index({ user: 1, status: 1 });

export const Order = model<IOrder>("Order", orderSchema);
