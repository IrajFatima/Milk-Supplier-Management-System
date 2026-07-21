import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL as string,

  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is missing.");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is missing.");
}