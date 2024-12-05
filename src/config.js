import dotenv from "dotenv";

dotenv.config(); 

export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const PORT = process.env.PORT || 5000;
export const HOST = process.env.HOST || "http://localhost";
export const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
