import * as cdk from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "TestCICDPipeline", {
      pipelineName: "TestCICDPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("rana-rayhan/aws-cdk-typescript-pg", "master"),
        commands: ["cd ", "npm i", "npx cdk synth"],
        primaryOutputDirectory: "cdk.out",
      }),
    });
  }
}
