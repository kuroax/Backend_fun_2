import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 🔹 Pre-save hook to hash password
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
  const salt   = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔹 Compare entered password with hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔹 Index for faster lookups
userSchema.index({ email: 1 });

export const User = model<IUser>("User", userSchema);
