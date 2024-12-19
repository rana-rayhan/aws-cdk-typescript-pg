import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export class MyLambdaStack extends cdk.Stack {
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly myLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.myLambda = new NodejsFunction(this, "MyLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "lambda", "src", "index.ts"),
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(120),
      environment: {
        DB_PORT: "5432",
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",
        DB_DATABASE: "mydatabase",
      },
    });

    const api = new LambdaRestApi(this, "LambdaRestApi", {
      handler: this.myLambda,
    });
  }
}
