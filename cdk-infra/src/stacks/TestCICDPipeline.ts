import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class TestCICDPipeline extends Stack {
  public gitToken: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "TestCICDPipeline", {
      pipelineName: "TestCICDPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("rana-rayhan/aws-cdk-typescript-pg", "master"),
        commands: ["cd cdk-infra", "npm ci", "npx cdk synth"],
        primaryOutputDirectory: "cdk-infra/cdk.out",
      }),
    });
  }
}
