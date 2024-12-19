import request from "supertest";
import { app } from "../src";

describe("CDK Pipeline Stack", () => {
  test("GET / should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Success");
  });
});
