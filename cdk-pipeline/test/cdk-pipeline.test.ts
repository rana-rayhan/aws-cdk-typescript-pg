import { handler } from "../lambda";

describe("CDK Pipeline Stack", () => {
  test("Lambda Stack should return status code: 200", async () => {
    const result = await handler({}, {});

    expect(result.statusCode).toBe(200);
  });
});
