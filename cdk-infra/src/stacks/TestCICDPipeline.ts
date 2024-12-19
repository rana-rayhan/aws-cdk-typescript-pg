import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { PipelineStageStack } from "./PipelineStageStack";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";

export class TestCICDPipeline extends Stack {
  public gitToken: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "TestCICDPipeline", {
      pipelineName: "TestCICDPipeline",

      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("rana-rayhan/aws-cdk-typescript-pg", "cdk-pipeline"),
        commands: ["cd cdk-infra", "npm ci", "npx cdk synth"],
        primaryOutputDirectory: "cdk-infra/cdk.out",
      }),
    });
    //stage
    const testStage = pipeline.addStage(
      new PipelineStageStack(this, "PipelineTestStage", {
        stageName: "test-lambda",
      })
    );
    testStage.addPre(
      new ShellStep("Pre-Test", {
        commands: ["cd cdk-infra", "npm ci", "npm test"],
      })
    );
  }
}
