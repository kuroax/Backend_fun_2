import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;   // reference to Product
  quantity: number;          // number of units
  price: number;             // snapshot of product price at purchase time
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;                 // reference to User
  items: IOrderItem[];                  // products purchased
  totalPrice: number;                   // computed final price
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payments: Types.ObjectId[];           // references to Payment docs
  shippingAddress: IShippingAddress;    // embedded snapshot (keeps history)
  addressId?: Types.ObjectId;           // optional reference to saved Address
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
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
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      addressLine1: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150,
      },
      addressLine2: {
        type: String,
        trim: true,
        maxlength: 150,
      },
      city: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      state: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
      },
      country: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 56,
      },
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true }
);

// 🔹 Auto-calculate totalPrice before saving
orderSchema.pre("save", async function (this: IOrder) {
  if (this.isModified("items")) {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
});

// 🔹 Indexes
orderSchema.index({ user: 1, status: 1 });   // filter orders by user & status
orderSchema.index({ createdAt: -1 });        // sort by recent orders
orderSchema.index({ status: 1 });            // reporting by status

export const Order = model<IOrder>("Order", orderSchema);
