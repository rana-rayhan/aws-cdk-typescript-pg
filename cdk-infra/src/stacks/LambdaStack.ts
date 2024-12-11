import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { config } from "dotenv";
config();

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, "AppEntryLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "lambda", "dist", "index.js"),
      runtime: Runtime.NODEJS_22_X,
      environment: {
        DB_HOST: process.env.DB_HOST || "",
        DB_PORT: process.env.DB_PORT || "",
        DB_USER: process.env.DB_USER || "",
        DB_PASSWORD: process.env.DB_PASSWORD || "",
        DB_DATABASE: process.env.DB_DATABASE || "",
      },
    });

    const api = new LambdaRestApi(this, "LambdaRestApi", {
      handler: lambda,
    });
  }
}
