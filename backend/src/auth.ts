import { type PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";


// load configutation
dotenv.config();
const secret = process.env.SECRET ?? "";

// app interface
interface AuthUser {
  id: number;
  nam: string;
  rol: string;
};
export interface AppContext {
  prismaClient: PrismaClient;
  user: AuthUser;
};

// check auth function
export enum Role {
  ADMIN,
  PRODUCT_MANAGER,
  SALES_MAN,
  TECHNICAL,
}

export const checkAuthorization = (role: string, ...allowedRoles: Role[]) => {
  for (let allowedRole of allowedRoles) if (role === Role[allowedRole]) return true;
  throw(new GraphQLError(`${role != "" ? role : "user without a role"} is unauthorized to access resources, only allowd for role indexs: ${allowedRoles}`));
};

// decode user
export const decodeUser = (user: AuthUser) => {
  return jwt.sign(user, secret);
};

// verify user
export const getUserFromJwt = (authorizationToken: string): AuthUser => {
  const emptyUser = { id: 0, nam: "", rol: ""};
  if (authorizationToken == null || authorizationToken === "") return emptyUser;
  try {
    const result = jwt.verify(authorizationToken, secret);
    return result as AuthUser;
  } catch (ex) {
    return emptyUser;
  }
};