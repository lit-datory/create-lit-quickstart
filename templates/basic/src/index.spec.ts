import assert from "node:assert";
import { describe, it } from "node:test";

describe("Example of a spec", () => {
  it("works", () => {
    assert.strictEqual(process.env.EXAMPLE_ENV, "bye world")
  })
})
