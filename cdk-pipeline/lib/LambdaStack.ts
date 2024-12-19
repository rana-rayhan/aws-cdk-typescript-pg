import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  stageName?: string;
}
export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: LambdaStackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "MyLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "lambda", "index.ts"),
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(120),
      environment: {
        stageName: props?.stageName || "dev",
        DB_PORT: "5432",
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",
        DB_DATABASE: "mydatabase",
      },
    });
  }
}
