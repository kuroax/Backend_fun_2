import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }], // URLs of product images
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Index for category and price for faster filtering/search
productSchema.index({ category: 1, price: 1 });

export const Product = model<IProduct>("Product", productSchema);
