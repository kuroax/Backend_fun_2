import { Schema, model, Document, Types } from "mongoose";

export interface IAddress extends Document {
  user: Types.ObjectId;      // reference to User
  fullName: string;          // contact name for delivery
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      maxlength: 20, // covers global postal formats
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 56, // ISO country name max
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 🔹 Ensure only one default address per user
addressSchema.pre("save", async function (this: IAddress) {
  if (this.isDefault) {
    await Address.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
});

// 🔹 Indexes for performance
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

export const Address = model<IAddress>("Address", addressSchema);
