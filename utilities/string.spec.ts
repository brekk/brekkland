import { test, expect } from "vitest"
import { bisect, chop, trimLocal, collapse, slug } from "#/utilities/string"
test("slug", () => {
  expect(
    ["Hey it's important & it has `complexity`", "only !@#$#$%@%$#@^&*"].map(
      slug,
    ),
  ).toEqual(["hey-its-important-it-has-complexity", "only"])
})

test("chop", () => {
  expect(chop(4, "0123456789")).toEqual("456789")
})
