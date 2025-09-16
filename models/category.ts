import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;       // SEO-friendly unique identifier
  isActive: boolean;  // allows hiding/deactivating categories
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name:{ 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        maxlength: 50 
    },
    description:{ 
        type: String, 
        maxlength: 500 
    },
    slug:{ 
        type: String,
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    isActive:{ 
        type: Boolean, 
        default: true 
    },
  },
  { timestamps: true }
);

// Index for faster category lookups by slug
categorySchema.index({ slug: 1 });

export const Category = model<ICategory>("Category", categorySchema);
