#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LambdaStack } from "./stacks/LambdaStack";

const app = new cdk.App();
new LambdaStack(app, "LambdaStack");
