import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

import { initializeDatabase, AppDataSource, databaseConnectionMiddleware } from "./config/db";
import { User } from "./entities/User";
config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Get secret
app.get("/secret", async (req, res) => {
  const client = new SecretsManagerClient({ region: "eu-north-1" });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: "github-token",
        VersionStage: "AWSCURRENT",
      })
    );
    res.status(200).json({ response: response.SecretString });
  } catch (error) {
    res.status(200).json({ error });
  }
});

app.use(databaseConnectionMiddleware);

// Get all users
app.get("/", async (req, res) => {
  try {
    //
    // await initializeDatabase();
    const users = await AppDataSource.getRepository(User).find();
    res.json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/test", async (req, res) => res.json({ message: "Success" }));

app.get("/users/data", async (req, res) => {
  try {
    // await initializeDatabase();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const message = err.message || "An error occurred";
  return res.status(err.status || 500).json({ message });
});

export default app;
