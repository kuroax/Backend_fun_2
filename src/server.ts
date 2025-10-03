import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { typeDefs } from "./graphql/schemas";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./config/db";

dotenv.config();

async function startServer() {
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // optionally plugins, etc.
  });

  await server.start();  // must call start before applying middleware

  // Middleware stack
  app.use(
    cors(),
    helmet(),
    morgan("dev"),
    express.json(),
    // Mount GraphQL endpoint
    expressMiddleware(server, {
      context: async ({ req }) => {
        // e.g. extract auth token from headers
        const token = req.headers.authorization || "";
        return { token };
      }
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>(resolve => httpServer.listen(PORT, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

startServer().catch((error) => {
  console.error("❌ Error starting server:", error);
  process.exit(1);
});
