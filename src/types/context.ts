import { Models } from "@models/index.js";
import { IUser } from "@models/user.js";

/**
 * GraphQLContext
 * ------------------------------------------------------------
 * This interface defines the shape of the `context` object
 * that Apollo Server injects into every resolver.
 *
 * It ensures that all resolvers have type-safe access to:
 *  - The Mongoose models (`models`)
 *  - The authenticated user (`user`, optional)
 */
export interface GraphQLContext {
  /**
   * All registered Mongoose models in the app.
   * These are imported and grouped inside models/index.ts
   */
  models: Models;

  /**
   * The authenticated user (if logged in).
   * This is set inside the context function in server.ts
   * after verifying the JWT token.
   */
  user?: IUser | null;
}
