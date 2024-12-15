import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";

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

    // Import the RDS Security Group from the Postgres Stack
    const rdsEndpoint = cdk.Fn.importValue("SupersightRdsInstanceEndpoint");
    const rdsSecurityGroupId = cdk.Fn.importValue("SupersightRdsSecurityGroup");
    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "ImportedRdsSecurityGroup",
      rdsSecurityGroupId
    );

    // Define Lambda Security Group
    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, "LambdaSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      securityGroupName: "LambdaSecurityGroup",
      description: "Security group for Lambda functions",
    });

    rdsSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(this.lambdaSecurityGroup.securityGroupId),
      ec2.Port.tcp(5432),
      "Allow Lambda to connect to PostgreSQL"
    );

    this.myLambda = new NodejsFunction(this, "MyLambda", {
      handler: "handler",
      entry: join(__dirname, "..", "..", "..", "lambda", "src", "index.ts"),
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(120),
      environment: {
        DB_HOST: rdsEndpoint || "",
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
