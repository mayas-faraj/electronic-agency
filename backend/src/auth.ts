import { type PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";

// load configutation
dotenv.config();
const secret = process.env.SECRET ?? "";

// app interface
interface User {
  name: string;
  roles: string[];
  sub: string;
  aud?: string;
}
export interface AppContext {
  prismaClient: PrismaClient;
  user: User;
}

// decode user
export const generateJwtToken = (user: User) => {
  return jwt.sign(user, secret);
};

// verify user
export const getUserFromJwt = (authorizationToken: string): User => {
  const emptyUser = { name: "", sub: "", aud: "", roles: [] };
  if (authorizationToken == null || authorizationToken === "") return emptyUser;
  try {
    const result = jwt.verify(authorizationToken, secret);
    return result as User;
  } catch (ex) {
    return emptyUser;
  }
};
