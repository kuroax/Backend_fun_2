import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { IUser } from "../../models/user.js"; // assuming you have IUser interface
import { IResolvers } from "@graphql-tools/utils";
import { GraphQLContext } from "../../types/context.js"; // context type

export const userResolvers: IResolvers = {
  Query: {
    // Fetch all users (admin only ideally)
    users: async (
      _parent,
      _args,
      { models }: GraphQLContext
    ): Promise<IUser[]> => {
      try {
        return await models.User.find().sort({ createdAt: -1 });
      } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },

    // Fetch specific user by ID
    user: async (
      _parent,
      { id }: { id: string },
      { models }: GraphQLContext
    ): Promise<IUser | null> => {
      try {
        const user = await models.User.findById(id);
        if (!user) throw new UserInputError("User not found");
        return user;
      } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },

    // Fetch the authenticated user's profile
    me: async (
      _parent,
      _args,
      { user, models }: GraphQLContext
    ): Promise<IUser | null> => {
      if (!user) throw new AuthenticationError("Not authenticated");
      return await models.User.findById(user.id);
    },
  },

  Mutation: {
    // Register a new user
    registerUser: async (
      _parent,
      { input }: { input: Partial<IUser> },
      { models }: GraphQLContext
    ): Promise<IUser> => {
      try {
        const existingUser = await models.User.findOne({ email: input.email });
        if (existingUser) {
          throw new UserInputError("Email is already registered");
        }

        const newUser = new models.User(input);
        await newUser.save();
        return newUser;
      } catch (error: any) {
        throw new Error(`Failed to register user: ${error.message}`);
      }
    },

    // Login user and return a token
    loginUser: async (
      _parent,
      { email, password }: { email: string; password: string },
      { models }: GraphQLContext
    ): Promise<{ token: string; user: IUser }> => {
      try {
        const user = await models.User.findOne({ email });
        if (!user) throw new AuthenticationError("Invalid email or password");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
          throw new AuthenticationError("Invalid email or password");

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        );

        return { token, user };
      } catch (error: any) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    // Update user info
    updateUser: async (
      _parent,
      { id, input }: { id: string; input: Partial<IUser> },
      { models, user }: GraphQLContext
    ): Promise<IUser> => {
      if (!user) throw new AuthenticationError("Not authenticated");

      try {
        const updatedUser = await models.User.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );

        if (!updatedUser) throw new UserInputError("User not found");
        return updatedUser;
      } catch (error: any) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },

    // Delete a user
    deleteUser: async (
      _parent,
      { id }: { id: string },
      { models, user }: GraphQLContext
    ): Promise<{ message: string }> => {
      if (!user || user.role !== "admin") {
        throw new AuthenticationError("Unauthorized");
      }

      try {
        const deletedUser = await models.User.findByIdAndDelete(id);
        if (!deletedUser) throw new UserInputError("User not found");
        return { message: "User successfully deleted" };
      } catch (error: any) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    },
  },
};
