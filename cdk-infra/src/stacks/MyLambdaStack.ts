import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export class MyLambdaStack extends cdk.Stack {
  public readonly myLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.myLambda = new NodejsFunction(this, "MyLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "lambda", "index.ts"),
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(120),
      environment: {
        DB_PORT: "5432",
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",
        DB_DATABASE: "mydatabase",
      },
      bundling: {
        externalModules: [
          "reflect-metadata",
          "express",
          "dotenv",
          "typeorm",
          "http-errors",
          "@aws-sdk/client-secrets-manager",
          "aws-serverless-express",
        ],
      },
    });
    //
    const api = new LambdaRestApi(this, "LambdaRestApi", {
      handler: this.myLambda,
    });
  }
}
// it  roking with cdk deploy and lambda insdie cdk-infra
