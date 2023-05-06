import { verify, sign } from "jsonwebtoken";
import dotenv from "dotenv";

// load configutation
dotenv.config();
const secret = process.env.SECRET ?? "";

// user interface
export interface UserContext {
  id: number;
  nam: string;
  rol: string;
}

// decode user
export const decodeUser = (user: UserContext) => {
    return sign(user, secret);
}

// verify user
export const getUserFromJwt = (authorizationToken: string): UserContext => {
  try {
    const result = verify(authorizationToken, secret);
    return result as UserContext;
  } catch (ex) {
    return {
      id: 0,
      nam: "",
      rol: "",
    };
  }
};
