import { Schema, model, Document, Types } from "mongoose";

export interface IProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;        // optional discounted price
  currency: string;              // e.g. "USD", "EUR"
  stock: number;                 // total stock
  sku: string;                   // product SKU (unique identifier)
  category: Types.ObjectId;      // reference to Category model
  images: IProductImage[];
  rating: number;                // average rating
  reviewCount: number;           // number of reviews
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name:{ 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 100 
    },
    description:{ 
      type: String, 
      required: true, 
      maxlength: 1000 
    },
    price:{ 
      type: Number, 
      required: true,
       min: 0 
      },
    discountPrice:{
      type: Number, 
      min: 0 
    }, // optional, less than price
    currency:{ 
      type: String,
      default: "USD",
      trim: true 
    },
    stock:{
      type: Number, 
      required: true, 
      min: 0, 
      default: 0 
    },
    sku:{
      type: String,
      required: true,
      unique: true,
      trim: true 
    },
    category:{
      type: Schema.Types.ObjectId, 
      ref: "Category", 
      required: true 
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
        isMain: { type: Boolean, default: false },
      },
    ],
    rating:{
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index: filter products by category + price
productSchema.index({ category: 1, price: 1 });

// Text index: allow searching by product name or description
productSchema.index({ name: "text", description: "text" });

export const Product = model<IProduct>("Product", productSchema);
