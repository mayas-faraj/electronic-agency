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
}

interface ServiceUser {
  name: string;
  role: string;
  sub: string;
  aud?: string;
}
export interface AppContext {
  prismaClient: PrismaClient;
  user: AuthUser;
}

// check auth function
export enum Role {
  ADMIN,
  CONTENT_WRITER,
  CONTENT_READER,
  LOGESTICS_MANAGER,
}

export const checkAuthorization = (role: string, ...allowedRoles: Role[]) => {
  for (let allowedRole of allowedRoles)
    if (role === Role[allowedRole]) return true;
  throw new GraphQLError(
    `${
      role != "" ? role : "user without a role"
    } is unauthorized to access resources, only allowd for role indexs: ${allowedRoles}`
  );
};

// decode user
export const generateJwtToken = (user: AuthUser) => {
  return jwt.sign(user, secret);
};

export const generateServiceJwtToken = (user: ServiceUser) => {
  let matchedRole = user.role;
  switch (user.role) {
    case "CONTENT_WRITER":
      matchedRole = "CONTENT_MANAGER";
      break;
    case "CONTENT_READER":
      matchedRole = "CONTENT_WRITER";
      break;
    case "LOGESTICS_MANAGER":
      matchedRole = "LOGISTICS_MANAGER";
      break;
  }

  user.role = matchedRole;
  return jwt.sign(user, secret);
};

// verify user
export const getUserFromJwt = (authorizationToken: string): AuthUser => {
  const emptyUser = { id: 0, nam: "", rol: "" };
  if (authorizationToken == null || authorizationToken === "") return emptyUser;
  try {
    const result = jwt.verify(authorizationToken, secret);
    return result as AuthUser;
  } catch (ex) {
    return emptyUser;
  }
};
