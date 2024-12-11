import "reflect-metadata";
import express from "express";
import awsServerlessExpress from "aws-serverless-express";
import { User } from "./entities/User";
import { initializeDatabase, AppDataSource } from "./config/db";

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Get all users
app.get("/", async (req, res) => {
  try {
    res.json({ message: "root" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/test", async (req, res) => {
  try {
    res.json({ message: "test" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    await initializeDatabase();
    const users = await AppDataSource.getRepository(User).find();
    res.json({ message: "Success", users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.get("/users/data", async (req, res) => {
  try {
    await initializeDatabase();
    const users = await AppDataSource.getRepository(User).find();
    res.json({ message: "Success", users: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
// Lambda handler
export const handler = (event: any, context: any) => {
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context);
};
// app.listen(4000, () => console.log(`running port: ${4000}`));
