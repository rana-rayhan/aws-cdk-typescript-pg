import { StackProps, Stack, Duration, RemovalPolicy, SecretValue, CfnOutput } from "aws-cdk-lib";
import {
  Vpc,
  SecurityGroup,
  Peer,
  Port,
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

interface PostgresStackProps extends StackProps {
  vpc: Vpc;
}

export class MyPostgresStack extends Stack {
  public readonly database: DatabaseInstance;
  public readonly rdsSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: PostgresStackProps) {
    super(scope, id, props);

    // Define RDS Security Group
    this.rdsSecurityGroup = new SecurityGroup(this, "RdsSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: false,
      securityGroupName: "RdsSecurityGroup",
      description: "Security group for RDS instance",
    });

    this.rdsSecurityGroup.addIngressRule(
      Peer.ipv4("91.153.48.32/32"),
      Port.tcp(5432),
      "Allow specific IP to access PostgreSQL"
    );

    this.database = new DatabaseInstance(this, "SupersightRdsInstance", {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_16_1,
      }),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      multiAz: false,
      allocatedStorage: 20,
      storageEncrypted: true,
      publiclyAccessible: true,
      deleteAutomatedBackups: true,
      backupRetention: Duration.days(0),
      removalPolicy: RemovalPolicy.DESTROY,

      databaseName: "mydatabase",
      credentials: {
        username: "postgres",
        password: SecretValue.unsafePlainText("postgres"),
      },

      vpc: props.vpc,
      securityGroups: [this.rdsSecurityGroup],
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
    });

    // Output the RDS endpoint
    new CfnOutput(this, "SupersightRdsInstanceEndpoint", {
      value: this.database.dbInstanceEndpointAddress,
      description: "The endpoint of the PostgreSQL RDS instance",
    });

    new CfnOutput(this, "SupersightRdsSecurityGroup", {
      value: this.rdsSecurityGroup.securityGroupId,
      description: "Security Group for RDS instance",
      exportName: "SupersightRdsSecurityGroup",
    });
  }
}
