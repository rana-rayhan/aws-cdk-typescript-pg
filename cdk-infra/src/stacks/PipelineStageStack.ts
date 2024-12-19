import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { MyLambdaStack } from "./MyLambdaStack";

export class PipelineStageStack extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new MyLambdaStack(this, "LambdaStagePipeline", { stackName: props.stageName });
  }
}
