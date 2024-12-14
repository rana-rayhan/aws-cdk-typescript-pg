import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

interface LambdaStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class MyLambdaStack extends cdk.Stack {
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly myLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // // Define Lambda Security Group
    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, "LambdaSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: "LambdaSecurityGroup",
      description: "Security group for Lambda functions",
    });

    this.myLambda = new NodejsFunction(this, "MyLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "lambda", "src", "index.ts"),
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(120),
      environment: {
        DB_HOST: "postgresstack-supersightrdsinstancea1889fb6-pygy9gaas7qv.czk868048us1.eu-north-1.rds.amazonaws.com",
        DB_PORT: "5432",
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",
        DB_DATABASE: "mydatabase",
      },

      vpc: props.vpc,
      securityGroups: [this.lambdaSecurityGroup],
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    const api = new LambdaRestApi(this, "LambdaRestApi", {
      handler: this.myLambda,
    });
  }
}
