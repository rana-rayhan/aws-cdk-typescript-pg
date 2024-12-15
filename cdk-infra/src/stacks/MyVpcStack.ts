import { Stack, StackProps } from "aws-cdk-lib";
import { Vpc, SubnetType, IpAddresses } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class MyVpcStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { ...props, description: "VPC Stack for Lambda and RDS communication." });

    this.vpc = new Vpc(this, "MyVpc", {
      ipAddresses: IpAddresses.cidr("10.0.0.0/24"),
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "PrivateSubnet",
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
        {
          name: "PublicSubnet",
          subnetType: SubnetType.PUBLIC,
          cidrMask: 28,
        },
      ],
    });
  }
}
