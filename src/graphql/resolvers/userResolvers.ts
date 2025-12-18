import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { GraphQLError } from "graphql";

import { IUser } from "#models/user.js";
import { IResolvers } from "@graphql-tools/utils";
import { GraphQLContext } from "#appTypes/context"; // ✅ type-only alias (no .js)

export const userResolvers: IResolvers = {
  Query: {
    // Get all users (admin only)
    users: async (_p, _a, { models, user }: GraphQLContext): Promise<IUser[]> => {
      if (!user || user.role !== "admin") {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
      }
      try {
        return await models.User.find().sort({ createdAt: -1 });
      } catch (error: any) {
        throw new GraphQLError(`Failed to fetch users: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Get user by ID
    user: async (_p, { id }: { id: string }, { models, user }: GraphQLContext): Promise<IUser | null> => {
      if (!user) {
        throw new GraphQLError("Not authenticated", { extensions: { code: "UNAUTHENTICATED" } });
      }
      try {
        const foundUser = await models.User.findById(id);
        if (!foundUser) {
          throw new GraphQLError("User not found", { extensions: { code: "BAD_USER_INPUT" } });
        }
        return foundUser;
      } catch (error: any) {
        throw new GraphQLError(`Failed to fetch user: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Get authenticated user's profile
    me: async (_p, _a, { user, models }: GraphQLContext): Promise<IUser | null> => {
      if (!user) {
        throw new GraphQLError("Not authenticated", { extensions: { code: "UNAUTHENTICATED" } });
      }
      try {
        return await models.User.findById(user.id);
      } catch (error: any) {
        throw new GraphQLError(`Failed to fetch profile: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Mutation: {
    // Register new user
    registerUser: async (_p, { input }: { input: Partial<IUser> }, { models }: GraphQLContext): Promise<IUser> => {
      try {
        const existingUser = await models.User.findOne({ email: input.email });
        if (existingUser) {
          throw new GraphQLError("Email is already registered", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const newUser = new models.User(input);
        await newUser.save();
        return newUser;
      } catch (error: any) {
        throw new GraphQLError(`Failed to register user: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Login user
    loginUser: async (
      _p,
      { email, password }: { email: string; password: string },
      { models }: GraphQLContext
    ): Promise<{ token: string; user: IUser }> => {
      try {
        const user = await models.User.findOne({ email });
        if (!user) {
          throw new GraphQLError("Invalid email or password", { extensions: { code: "UNAUTHENTICATED" } });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new GraphQLError("Invalid email or password", { extensions: { code: "UNAUTHENTICATED" } });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        );

        return { token, user };
      } catch (error: any) {
        throw new GraphQLError(`Login failed: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Update user info
    updateUser: async (
      _p,
      { id, input }: { id: string; input: Partial<IUser> },
      { models, user }: GraphQLContext
    ): Promise<IUser> => {
      if (!user) {
        throw new GraphQLError("Not authenticated", { extensions: { code: "UNAUTHENTICATED" } });
      }

      try {
        const updatedUser = await models.User.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          throw new GraphQLError("User not found", { extensions: { code: "BAD_USER_INPUT" } });
        }
        return updatedUser;
      } catch (error: any) {
        throw new GraphQLError(`Failed to update user: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Delete user (admin only)
    deleteUser: async (
      _p,
      { id }: { id: string },
      { models, user }: GraphQLContext
    ): Promise<{ message: string }> => {
      if (!user || user.role !== "admin") {
        throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
      }

      try {
        const deletedUser = await models.User.findByIdAndDelete(id);
        if (!deletedUser) {
          throw new GraphQLError("User not found", { extensions: { code: "BAD_USER_INPUT" } });
        }
        return { message: "User successfully deleted" };
      } catch (error: any) {
        throw new GraphQLError(`Failed to delete user: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Generate password reset token
    requestPasswordReset: async (
      _p,
      { email }: { email: string },
      { models }: GraphQLContext
    ): Promise<{ message: string; resetToken?: string }> => {
      try {
        const user = await models.User.findOne({ email });
        if (!user) {
          throw new GraphQLError("No user found with this email", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        return {
          message: "Password reset token generated successfully",
          resetToken, // visible only in development
        };
      } catch (error: any) {
        throw new GraphQLError(`Failed to create reset token: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    // Reset user password
    resetUserPassword: async (
      _p,
      { userId, resetToken, newPassword }: { userId: string; resetToken: string; newPassword: string },
      { models }: GraphQLContext
    ): Promise<{ message: string }> => {
      try {
        const user = await models.User.findById(userId);
        if (!user) {
          throw new GraphQLError("User not found", { extensions: { code: "BAD_USER_INPUT" } });
        }

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        if (
          user.resetPasswordToken !== hashedToken ||
          !user.resetPasswordExpires ||
          user.resetPasswordExpires < new Date()
        ) {
          throw new GraphQLError("Invalid or expired reset token", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: "Password reset successful" };
      } catch (error: any) {
        throw new GraphQLError(`Failed to reset password: ${error.message}`, {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};
