import { Schema, model, Document } from "mongoose";

export interface ICartItem {
  product: Schema.Types.ObjectId;   // reference to Product
  quantity: number;                 // number of units
  price: number;                    // snapshot of product price at time added
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;      // reference to User
  items: ICartItem[];
  totalPrice: number;               // computed total price
  isActive: boolean;                // active cart vs abandoned
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔹 Auto-calculate total price before saving (modern style)
cartSchema.pre("save", async function (this: ICart) {
  if (this.isModified("items")) {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
});

// 🔹 Indexes
cartSchema.index({ user: 1, isActive: 1 }); // quickly find active cart per user
cartSchema.index({ createdAt: 1 });         // track abandoned carts over time

export const Cart = model<ICart>("Cart", cartSchema);
