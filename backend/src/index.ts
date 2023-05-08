import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { type AppContext, getUserFromJwt } from "./auth.js";
import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";

// prisma client
const prismaClient = new PrismaClient({ log: ["query"] , errorFormat: "minimal"});

// read configuration
dotenv.config();
const port = parseInt(process.env.PORT ?? "4000");
const isDevelopment = process.env.ENV === "development";

// create apollo server
const apolloServer = new ApolloServer<AppContext>({
  typeDefs,
  resolvers,
  introspection: isDevelopment,
});

// start
const { url } = await startStandaloneServer(apolloServer, {
  listen: { port },
  context: async ({ req }) => {
    let jwtToken = req.headers.authorization || "";
    if (jwtToken.indexOf(" ") > 0) jwtToken = jwtToken.split(" ")[1];
    return {
      user: {nam: 'mayas', rol: 'ADMIN', id: 10},// getUserFromJwt(jwtToken),
      prismaClient: prismaClient,
    };
  },
});

// server has been started
console.log(`🚀  Server ready at: ${url}`);
