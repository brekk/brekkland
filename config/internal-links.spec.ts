import { test, describe, expect } from "vitest"

import {
  processLink,
  indexHandle,
  isIndexPath,
  makeRelativeUrl,
  notARealLink,
  pathStartsWith,
  isWikilinkInCode,
  searchWithinByIndex,
  extractLinkTextFromAnchor,
  closured,
  decodeAnchor,
  parseLinkWithAnchor,
  isCode,
  isInCodeBlock,
  dropEntityMd,
  isInternalLink,
  setGlobalPostsCache,
  getGlobalPostsCache,
  populateGlobalPostsCache,
  extractWikilinks,
  resolveWikilink,
  validateWikilinks,
  remarkStandardLinks,
  extractStandardLinks,
  remarkInternalLinks,
  extractAllInternalLinks,
  findLinkedMentions,
  processWikilinksInHTML,
  processContentAwareWikilinks,
  remarkFolderImages,
  remarkImageCaptions,
} from "./internal-links.ts"

test("closured", () => {
  const initCache = ["yes"]
  const context = closured(initCache)
  expect(context.get()).toEqual(initCache)
  context.set(["no"])
  expect(context.get()).toEqual(["no"])
})

test("parseLinkWithAnchor", () => {
  expect(parseLinkWithAnchor("//scribble.dibb/ya-burnt#hooray")).toEqual({
    link: "//scribble.dibb/ya-burnt",
    anchor: "hooray",
  })
})
test("decodeAnchor", () => {
  expect(decodeAnchor(null)).toEqual("")
  expect(decodeAnchor("hello%20world")).toEqual("hello world")
})

test("isCode", () => {
  expect(isCode("inlineCode")).toBeTruthy()
  expect(isCode("code")).toBeTruthy()
  expect(isCode("")).toBeFalsy()
})

test("isInCodeBlock", () => {
  expect(isInCodeBlock(false)).toBeFalsy()
  expect(isInCodeBlock({ type: false })).toBeFalsy()
  expect(isInCodeBlock({ type: "code" })).toBeTruthy()
  expect(isInCodeBlock({ parent: { type: "code" } })).toBeTruthy()
})

test("searchWithinByIndex", () => {
  expect(searchWithinByIndex("blahblahblah", 2, new RegExp(".*"))).toBeTruthy()
  expect(
    searchWithinByIndex("blahblahblah", 2, new RegExp("blah")),
  ).toBeTruthy()
  expect(searchWithinByIndex("blahblahblah", 2, new RegExp("bleh"))).toBeFalsy()
})
test("isWikilinkInCode", () => {
  expect(isWikilinkInCode("", 0)).toBeFalsy()
  expect(isWikilinkInCode("`[[blah]]`", 2)).toBeTruthy()
})
test("pathStartsWith", () => {
  const yoSlash = pathStartsWith("yo")
  expect(yoSlash("yoyo")).toBeTruthy()
  expect(yoSlash("yo/yes")).toBeTruthy()
  expect(yoSlash("no")).toBeFalsy()
})

test("notARealLink", () => {
  expect(notARealLink("//")).toBeFalsy()
  expect(notARealLink("http:")).toBeFalsy()
  expect(notARealLink("https:")).toBeFalsy()
  expect(notARealLink("mailto:")).toBeFalsy()
  expect(notARealLink("#")).toBeFalsy()
  expect(notARealLink("")).toBeTruthy()
})

test("makeRelativeUrl", () => {
  expect(
    ["/index", "special/check", "special/home", "pages/cool"].map(
      makeRelativeUrl,
    ),
  ).toEqual(["/", "/check", "/", "/cool"])
})

test("isIndexPath", () => {
  expect(isIndexPath("squib/index")).toBeTruthy()
  expect(isIndexPath("squib")).toBeFalsy()
})

test("isInternalLink", () => {
  expect(
    ["https:", "http:", "//", "pages/x", "blog/x", "x"].filter(isInternalLink),
  ).toEqual(["pages/x", "blog/x", "x"])
})

test("dropEntityMd", () => {
  expect(dropEntityMd("skib", "skibjib.md")).toEqual("jib")
})

test("indexHandle", () => {
  expect(indexHandle("jobble/index")).toEqual("jobble")
  expect(indexHandle("jobble/nobble")).not.toEqual("jobble")
})

test("processLink", () => {
  expect(processLink("posts/jimp.md")).toEqual("jimp")
  expect(processLink("posts/jamp/index.md")).toEqual("jamp")
  expect(processLink("pages/homepage/index.md")).toEqual("homepage")
})

test("extractLinkTextFromAnchor", () => {
  expect(extractLinkTextFromAnchor("//fiz.boo/bar/baaz#quux")).toEqual("")
})
