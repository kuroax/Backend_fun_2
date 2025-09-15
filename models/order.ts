import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
