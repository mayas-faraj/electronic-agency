import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { type AppContext, getUserFromJwt } from "./auth.js";
import { clientFormatError } from "./error.js";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";

// prisma client
const prismaClient = new PrismaClient({ errorFormat: "minimal"});

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
  formatError: clientFormatError 
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
app.get('/uploads/:folder/:file', (req, res) => {
  const { folder, file } = req.params;
  const targetUrl = `http://208.64.33.65:5000/uploads/${folder}/${file}`;
  res.redirect(302, targetUrl);
});

// server has been started
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
console.log(`🚀  Server ready at: http://localhost:${port}/`);
