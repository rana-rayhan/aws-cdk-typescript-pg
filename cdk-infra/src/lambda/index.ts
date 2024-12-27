import "reflect-metadata";
import awsServerlessExpress from "aws-serverless-express";

import app from "./app";
app.listen(4000, () => console.log("Server is running on http://localhost:4000"));

// Lambda handler function for AWS
export const handler = (event: any, context: any) => {
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context);
};
