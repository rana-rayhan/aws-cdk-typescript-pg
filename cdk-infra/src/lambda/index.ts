import "reflect-metadata";
import awsServerlessExpress from "aws-serverless-express";

import app from "./app";

// Lambda handler function for AWS
export const handler = (event: any, context: any) => {
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context);
};
