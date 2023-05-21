import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { type AppContext, getUserFromJwt } from "./auth.js";
import { clientFormatError } from "./error.js";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";
import { avatarMulter, categoriesMulter, productsMulter, uploadMiddleware } from "./uploader.js";

// prisma client
const prismaClient = new PrismaClient({ log: ["query"] , errorFormat: "minimal"});

// read configuration
dotenv.config();
const port = parseInt(process.env.PORT ?? "4000");
const isDevelopment = process.env.NODE_ENV === "development";

// express server
const app = express();
const httpServer = http.createServer(app);

// create apollo server
const apolloServer = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: isDevelopment,
  formatError: !isDevelopment ? clientFormatError : undefined
});

// start apollo server
await apolloServer.start();


// express middleware
app.use("/graphql", cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(apolloServer, {
  context: async ({ req }) => {
    let jwtToken = req.headers.authorization || "";
    if (jwtToken.indexOf(" ") > 0) jwtToken = jwtToken.split(" ")[1];
    return {
      user: getUserFromJwt(jwtToken),
      prismaClient: prismaClient,
    };
  },
}));

// express static file serve
app.use("/uploads", express.static('uploads'));

// express uploads
app.post("/uploads-avatar", cors({ origin: "*" }), avatarMulter.single("avatar"), uploadMiddleware);
app.post("/upload-category", cors({ origin: "*" }), categoriesMulter.single("category"), uploadMiddleware);
app.post("/upload-product", cors({ origin: "*" }), productsMulter.single("product"), uploadMiddleware);

// server has been started
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀  Server ready at: http://localhost:${port}/`);
