import { handler } from "../src";

describe("CDK Pipeline Stack", () => {
  test("Snapshot", async () => {
    const result = await handler({}, {});
    expect(result).toMatchSnapshot();
  });
});
