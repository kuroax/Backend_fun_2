import { Schema, model, Document } from "mongoose";

export interface IProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  stock: number;
  sku: string;
  category: Schema.Types.ObjectId;
  images: IProductImage[];
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (this: IProduct, value: number) {
          return value < this.price;
        },
        message: "Discount price must be less than regular price",
      },
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
      default: "MXN",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
        alt: {
          type: String,
          trim: true,
          maxlength: 150,
          default: "",
        },
        isMain: { type: Boolean, default: false },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// 🔹 Ensure only one "isMain" image per product (new async/await style)
productSchema.pre("save", async function (this: IProduct) {
  const mainImages = this.images.filter((img) => img.isMain);
  if (mainImages.length > 1) {
    throw new Error("Only one image can be marked as main");
  }
});

// 🔹 Compound index: filter products by category + price
productSchema.index({ category: 1, price: 1 });

// 🔹 Text index: allow full-text search by name/description
productSchema.index({ name: "text", description: "text" });

export const Product = model<IProduct>("Product", productSchema);
