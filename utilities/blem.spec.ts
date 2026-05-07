import { blem } from "#/utilities/blem"

import { expect, test } from "vitest"

test("blem", () => {
  const xxx = blem("XXX")
  const b = xxx("")
  expect(b).toEqual("XXX")
  const e = xxx("yyy")
  expect(e).toEqual("XXX__yyy")
  const em = xxx("yyy", "zzz")
  expect(em).toEqual("XXX__yyy XXX__yyy--zzz")
  const ems = xxx("yyy", ["zzz", "222"])
  expect(ems).toEqual("XXX__yyy XXX__yyy--zzz XXX__yyy--222")
})
