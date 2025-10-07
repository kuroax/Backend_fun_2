import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;   // reference to Product
  quantity: number;          // number of units
  price: number;             // price snapshot at purchase time
}

export interface IShippingAddressMX {
  fullName: string;
  street: string;
  extNumber: string;
  intNumber?: string;
  neighborhood: string;      // colonia
  municipality: string;      // municipio / alcaldía
  state: string;
  postalCode: string;
  country: string;           // always "México"
  phoneNumber: string;
  deliveryInstructions?: string;
}

export interface IOrderMX extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payments: Types.ObjectId[];
  shippingAddress: IShippingAddressMX;   // snapshot (immutable)
  addressId?: Types.ObjectId;            // reference to saved Address
  createdAt: Date;
  updatedAt: Date;
}

const orderSchemaMX = new Schema<IOrderMX>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],

    shippingAddress: {
      fullName: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
      street: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
      extNumber: { type: String, required: true, trim: true, maxlength: 10 },
      intNumber: { type: String, trim: true, maxlength: 10 },
      neighborhood: { type: String, required: true, trim: true, maxlength: 100 },
      municipality: { type: String, required: true, trim: true, maxlength: 100 },
      state: { type: String, required: true, trim: true, maxlength: 100 },
      postalCode: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{5}$/, // strict 5-digit format
      },
      country: { type: String, required: true, trim: true, default: "México" },
      phoneNumber: { type: String, required: true, trim: true, maxlength: 20 },
      deliveryInstructions: { type: String, trim: true, maxlength: 300 },
    },

    addressId: { type: Schema.Types.ObjectId, ref: "Address" },
  },
  { timestamps: true }
);

// 🔹 Auto-calculate total price
orderSchemaMX.pre("save", async function (this: IOrderMX) {
  if (this.isModified("items")) {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
});

// 🔹 Indexes for performance
orderSchemaMX.index({ user: 1, status: 1 });
orderSchemaMX.index({ createdAt: -1 });
orderSchemaMX.index({ status: 1 });

export const OrderMX = model<IOrderMX>("Order", orderSchemaMX);
