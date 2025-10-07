import { Schema, model, Document, Types } from "mongoose";

export interface IAddressMX extends Document {
  user: Types.ObjectId;
  fullName: string;
  street: string;
  extNumber: string;
  intNumber?: string;
  neighborhood: string;      // colonia
  municipality: string;      // alcaldía / municipio
  state: string;
  postalCode: string;
  country: string;           // always "México"
  phoneNumber: string;
  deliveryInstructions?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchemaMX = new Schema<IAddressMX>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
      match: /^[0-9]{5}$/, // ensures 5-digit postal code
    },
    country: {
      type: String,
      default: "México",
      trim: true,
      minlength: 4,
      maxlength: 56,
    },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 20 },
    deliveryInstructions: { type: String, trim: true, maxlength: 300 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔹 Ensure one default address per user
addressSchemaMX.pre("save", async function (this: IAddressMX) {
  if (this.isDefault) {
    await AddressMX.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
});

// 🔹 Useful indexes
addressSchemaMX.index({ user: 1 });
addressSchemaMX.index({ user: 1, isDefault: 1 });
addressSchemaMX.index({ postalCode: 1 });

export const AddressMX = model<IAddressMX>("Address", addressSchemaMX);
