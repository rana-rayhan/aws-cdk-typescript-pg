import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { config } from "dotenv";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "supersight",
  entities: [User],
  synchronize: false,
  logging: false,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("***--- Database connection established successfully");
    }
  } catch (error) {
    console.error("***--- Database connection failed:", error);
    throw createError(500, "***--- Failed to connect to the database: " + error);
  }
};

export const databaseConnectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("***--- Database connection established successfully");
    }
    next();
  } catch (error) {
    console.error("***--- Database connection failed:", error);
    next(createError(500, "***--- Failed to connect to the database: " + error));
  }
};
