import "reflect-metadata";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import awsServerlessExpress from "aws-serverless-express";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { initializeDatabase, AppDataSource } from "./config/db";
config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Get all users
app.get("/", async (req: Request, res: Response) => {
  try {
    await initializeDatabase();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/users/data", async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ message: "Success" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

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

// app.listen(4000, async () => console.log("running on 4000"));

// Lambda handler function for AWS
export const handler = async (event: any, context: any) => {
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context);
};
