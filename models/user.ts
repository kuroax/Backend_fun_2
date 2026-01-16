import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * ---------------------------------------
 * DB role constants (single source of truth)
 * ---------------------------------------
 */
export const DB_USER_ROLES = ["user", "admin"] as const;
export type DbUserRole = (typeof DB_USER_ROLES)[number];

/**
 * ---------------------------------------
 * User interface
 * ---------------------------------------
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: DbUserRole;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * ---------------------------------------
 * User schema
 * ---------------------------------------
 */
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
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // 👈 hidden by default (security)
    },
    role: {
      type: String,
      enum: DB_USER_ROLES, // 👈 uses shared constant
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ---------------------------------------
 * Password hashing middleware
 * ---------------------------------------
 */
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * ---------------------------------------
 * Password comparison method
 * ---------------------------------------
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * ---------------------------------------
 * Indexes
 * ---------------------------------------
 */
userSchema.index({ email: 1 });

/**
 * ---------------------------------------
 * Model export
 * ---------------------------------------
 */
export const User = model<IUser>("User", userSchema);
