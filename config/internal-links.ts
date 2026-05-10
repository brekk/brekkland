import {
  includes,
  propOr,
  both,
  endsWith,
  complement,
  anyPass,
  startsWith,
  trim,
  when,
  slice,
  indexOf,
  length,
  tryCatch,
  toLower,
  toUpper,
  ifElse,
  always as K,
  identity as I,
  defaultTo,
  find,
  tryCatch,
  endsWith,
  pipe,
  curryN,
  equals,
  propEq,
  prop,
  replace,
} from "ramda"

import type { Project, LinkMatch } from "@/types"
import { visit } from "unist-util-visit"

type NullString = string | null
interface AnchoredLink {
  link: string
  anchor: NullString
}

const truthy = (x) => !!x

function closured(_cache: any[] = []) {
  let cache = _cache
  const set = (x: any[]) => {
    cache = x
  }
  const get = () => cache
  return {
    get,
    set,
  }
}

const isFolderBasedContent = (slug: string, allContent: any[]) =>
  pipe(
    find(propEq(slug, "id")),
    ifElse(truthy, pipe(prop("id"), endsWith("/index")), K(false)),
  )(allContent)

const slug = (x: string) =>
  pipe(
    toLower,
    replace(/[^a-z0-9\s-]/g, ""),
    replace(/\s+/g, "-"),
    replace(/-+/g, "-"),
    replace(/^-+|-+$/g, ""),
  )(x)

const decodeAnchor = (x: NullString): NullString =>
  pipe(defaultTo(""), tryCatch(decodeURIComponent, K(x)))(x)

const parseLinkWithAnchor = (link: string): AnchoredLink =>
  pipe(
    indexOf("#"),
    ifElse(
      equals(-1),
      K({ link, anchor: null }),
      pipe<number[], [NullString, NullString], NullString, AnchoredLink>(
        (x) => [slice(0, x, link), slice(x + 1, length(link), link)],
        ([a, b]) => (b ? decodeAnchor(a) : null),
        (anchor) => ({ link, anchor }),
      ),
    ),
  )(link)

const isInCodeBlock = (parent: any): boolean => {
  // Check if the immediate parent is a code-related node
  if (!parent) {
    return false
  } else {
    const { type } = parent
    // Check for inline code or code blocks
    if (type === "inlineCode" || type === "code") {
      return true
    }

    // Walk up the AST to check for code block ancestors
    let currentNode = parent
    while (currentNode) {
      const { type: t2 } = currentNode
      if (t2 === "inlineCode" || t2 === "code") {
        return true
      }
      // Try to find the parent node in the tree (simplified check)
      currentNode = currentNode.parent
    }

    return false
  }
}

const isWikilinkInCode = (content: string, wikilinkIndex: number): boolean => {
  // First check for code blocks (triple backticks)
  const codeBlockRegex = /```[\s\S]*?```/g
  let codeBlockMatch

  while ((codeBlockMatch = codeBlockRegex.exec(content)) !== null) {
    const codeBlockStart = codeBlockMatch.index
    const codeBlockEnd = codeBlockMatch.index + codeBlockMatch[0].length

    // Check if the wikilink is inside this code block
    if (wikilinkIndex >= codeBlockStart && wikilinkIndex < codeBlockEnd) {
      return true
    }
  }

  // Then check for inline code (single backticks)
  const backtickRegex = /`([^`]*)`/g
  let match

  while ((match = backtickRegex.exec(content)) !== null) {
    const codeStart = match.index
    const codeEnd = match.index + match[0].length

    // Check if the wikilink is inside this code block
    if (wikilinkIndex >= codeStart && wikilinkIndex < codeEnd) {
      return true
    }
  }

  return false
}
type Predicate<T> = (x: T) => boolean
const leadSlash = (fn: Predicate<string>, x: string) => fn(x) || fn("/" + x)

/*
const startsWithlike = curryN<2, (y: string, x: string) => boolean>(2, (y, x) =>
  leadSlash(startsWith(y), x),
)
*/
// currying is apparently a bridge too far for typescript
const startsWithlike = (y: string) => (x: string) => leadSlash(startsWith(y), x)

const nonePass = <T>(preds: Predicate<T>[], x: T) =>
  complement(anyPass(preds))(x)

const notARealLink = (x: string): boolean =>
  nonePass([startsWith("http"), startsWith("mailto:"), startsWith("#")], x)

const checkInternalness = pipe(
  parseLinkWithAnchor,
  propOr("", "link"),
  anyPass([
    endsWith(".md"),
    startsWithlike("pages/"),
    startsWithlike("projects/"),
    complement(includes("/")),
  ]),
)

const isInternalLink = (x: string): boolean =>
  pipe(trim, both(notARealLink, checkInternalness))(x)
