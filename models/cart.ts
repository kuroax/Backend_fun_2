import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;   // reference to Product
  quantity: number;          // number of units
  price: number;             // snapshot of product price at time added
}

export interface ICart extends Document {
  user: Types.ObjectId;      // reference to User
  items: ICartItem[];
  totalPrice: number;        // computed total price
  isActive: boolean;         // useful to keep multiple carts (e.g., abandoned carts)
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Auto-calculate total price before saving
cartSchema.pre("save", async function (this: ICart) {
  if (!this.isModified("items")) return;
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

export const Cart = model<ICart>("Cart", cartSchema);
