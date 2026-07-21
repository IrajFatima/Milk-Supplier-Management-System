import jwt,{ SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { JwtPayload } from "../types/auth.types.js";


export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};