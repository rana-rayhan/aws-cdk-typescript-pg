import * as cdk from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStageStack } from "./PipelineStageStack";

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "TestCICDPipeline", {
      pipelineName: "TestCICDPipeline",

      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("rana-rayhan/aws-cdk-typescript-pg", "cdk-pipeline"),
        commands: ["cd cdk-pipeline", "npm ci", "npx cdk synth"],
        primaryOutputDirectory: "cdk-pipeline/cdk.out",
      }),
    });
    //stage
    const testStage = pipeline.addStage(
      new PipelineStageStack(this, "PipelineTestStage", {
        stageName: "test",
      })
    );
    testStage.addPre(
      new ShellStep("Pre-Test", {
        commands: ["cd cdk-pipeline", "npm ci", "npm test"],
      })
    );
  }
}
