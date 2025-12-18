import { User } from "./user.js";
import { Product } from "./product.js";
import { Category } from "./category.js";
import { Address } from "./address.js";
import { Order } from "./order.js";
import { Cart } from "./cart.js";
import { Payment } from "./payment.js";

// 🧠 Define a TypeScript type for all models
export const models = {
  User,
  Product,
  Category,
  Address,
  Order,
  Cart,
  Payment,
};

export type Models = typeof models;
