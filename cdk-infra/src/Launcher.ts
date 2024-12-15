import * as cdk from "aws-cdk-lib";
import { MyVpcStack } from "./stacks/MyVpcStack";
import { MyPostgresStack } from "./stacks/MyPostgresStack";
import { MyLambdaStack } from "./stacks/MyLambdaStack";

const app = new cdk.App();

// Create VPC Stack
const vpcStack = new MyVpcStack(app, "MyVpcStack");

// Create PostgreSQL Stack
new MyPostgresStack(app, "PostgresStack", {
  vpc: vpcStack.vpc,
});

// Create Lambda Stack
new MyLambdaStack(app, "LambdaStack", {
  vpc: vpcStack.vpc,
});
