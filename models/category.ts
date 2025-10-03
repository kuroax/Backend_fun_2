import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;       // SEO-friendly unique identifier
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50, // keep names concise, prevent abuse
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500, // enough for SEO, prevents overlong input
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 2,
      maxlength: 100, // safety cap, even though slugs are short
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔹 Pre-save hook to enforce slug formatting (modern async/await)
categorySchema.pre("save", async function (this: ICategory) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // replace spaces & special chars with -
      .replace(/^-+|-+$/g, "");  // remove leading/trailing hyphens
  }
});

// 🔹 Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

export const Category = model<ICategory>("Category", categorySchema);
