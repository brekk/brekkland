import {
  __ as $,
  prepend,
  drop,
  map,
  split,
  isEmpty,
  cond,
  concat,
  always as K,
  anyPass,
  both,
  complement,
  curryN,
  defaultTo,
  either,
  endsWith,
  equals,
  find,
  identity as I,
  ifElse,
  includes,
  indexOf,
  length,
  pipe,
  prop,
  propEq,
  propOr,
  replace,
  slice,
  startsWith,
  toLower,
  toUpper,
  trim,
  tryCatch,
  when,
} from "ramda"

import type { Project, LinkMatch } from "@/types"
import { visit } from "unist-util-visit"

const REGEX = {
  WIKI_LINK: /!?\[\[([^\]]+)\]\]/g,
  CODE: /```[\s\S]*?```/g,
  BACKTICK: /`([^`]*)`/g,
}

type NullString = string | null
interface AnchoredLink {
  link: string
  anchor: NullString
}

const truthy = (x: any) => !!x

// globalPostsCache
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

const slugify = (x: string): string =>
  pipe(
    toLower,
    replace(/[^a-z0-9\s-]/g, ""),
    replace(/\s+/g, "-"),
    replace(/-+/g, "-"),
    replace(/^-+|-+$/g, ""),
  )(x)

function decodeAnchor(x: string): string
function decodeAnchor(x: NullString): NullString {
  return pipe(defaultTo(""), tryCatch(decodeURIComponent, K(x)))(x)
}

const parseLinkWithAnchor = (link: string): AnchoredLink =>
  pipe(
    indexOf("#"),
    ifElse(
      equals(-1),
      K({ link, anchor: null }),
      pipe<number[], [NullString, NullString], NullString, AnchoredLink>(
        (x) => [slice(0, x, link), slice(x + 1, length(link), link)],
        ([a, b]) => (b ? decodeAnchor(a!) : null),
        (anchor) => ({ link, anchor }),
      ),
    ),
  )(link)

const isCode = (v: string) => v === "inlineCode" || v === "code"

const isInCodeBlock = (parent: any): boolean => {
  if (!parent) {
    return false
  } else {
    const { type } = parent
    if (isCode(type)) {
      return true
    }

    let currentNode = parent
    while (currentNode) {
      const { type: t2 } = currentNode
      if (isCode(t2)) {
        return true
      }
      currentNode = currentNode.parent
    }

    return false
  }
}

const searchWithinByIndex = (content: string, index: number, regex: RegExp) => {
  let $match

  while (($match = regex.exec(content)) !== null) {
    const start = $match.index
    const end = $match.index + $match[0].length

    // Check if the wikilink is inside this code block
    if (index >= start && index < end) {
      return true
    }
  }
  return false
}

const isWikilinkInCode = (content: string, wikilinkIndex: number): boolean => {
  const code = searchWithinByIndex(content, wikilinkIndex, REGEX.CODE)
  const inline = searchWithinByIndex(content, wikilinkIndex, REGEX.BACKTICK)
  return code || inline
}

type Predicate<T> = (x: T) => boolean
type StringPred = Predicate<string>

const pathStartsWith = curryN(
  2,
  (y: string, x: string): boolean => startsWith("/" + y, x) || startsWith(y, x),
)

const collapse = replace($, "")

const nonePass = <T>(preds: Predicate<T>[], x: T) =>
  complement(anyPass(preds))(x)

const notARealLink = (x: string): boolean =>
  nonePass([startsWith("http"), startsWith("mailto:"), startsWith("#")], x)

const checkInternalness = pipe(
  parseLinkWithAnchor,
  propOr("", "link"),
  anyPass([
    endsWith(".md"),
    pathStartsWith("pages/") as StringPred,
    pathStartsWith("blog/") as StringPred,
    pathStartsWith("special/") as StringPred,
    pathStartsWith("projects/") as StringPred,
    complement(includes("/")),
  ]),
)

const isInternalLink = (x: string): boolean =>
  pipe(trim, both(notARealLink, checkInternalness))(x)

const chop = curryN(2, (i: number, x: string): string => x.slice(i, x.length))

const dropEntityMd = curryN(2, (v: string, x: string): string =>
  pipe(replace(v, ""), replace(/\.md$/, ""))(x),
)

const makeRelativeUrl = (url: string): string =>
  pipe<string[], string, string>(
    when(either(equals("/index"), equals("/index/")), K("/")),
    ifElse(
      pathStartsWith("special/"),
      pipe(
        when<string, string>(startsWith("/"), chop(1)),
        collapse("special/"),
        ifElse(equals("home"), K("/"), concat("/")),
      ),
      when(startsWith("pages/"), pipe(collapse("pages/"), concat("/"))),
    ),
  )(url)

const isIndexPath = both(
  endsWith("/index"),
  pipe(split("/"), length, equals(2)),
)

const indexHandle = (x: string): string =>
  when<string, string>(isIndexPath, collapse("/index"))(x)

const processLink = (x: string): string =>
  cond([
    [
      pathStartsWith("posts/") as StringPred,
      pipe(dropEntityMd("posts/"), indexHandle),
    ],
    [pathStartsWith("special/") as StringPred, dropEntityMd("special/")],
    [
      pathStartsWith("pages/") as StringPred,
      pipe(
        dropEntityMd("pages/"),
        when<string, string>(endsWith("/index"), collapse("/index")),
        when(isEmpty, K("homepage")),
      ),
    ],
  ])(x) as string

const extractLinkTextFromAnchor = (url: string): AnchoredLink =>
  pipe(trim, parseLinkWithAnchor, ({ link, anchor }) => ({
    link: processLink(link),
    anchor,
  }))(url)

interface ReplacementNode {
  parent: any
  index: number
  newChildren: any[]
}

const dropLeadingHash = when<string, string>(startsWith("#"), drop(1))

const remarkWikilinks = () => {
  function transformer(tree: any, file: any) {
    const nodes: ReplacementNode[] = []
    visit(tree, "text", (node: any, index: number, parent: any) => {
      if (!node.value || typeof node.value !== "string") {
        return
      }
      if (isInCodeBlock(parent)) {
        return
      }
      let match
      const newChildren: any[] = []
      let lastIndex = 0
      let hasWikilinks = false
      while ((match = REGEX.WIKI_LINK.exec(node.value)) !== null) {
        hasWikilinks = true
        const [fullMatch, content] = match
        const isImage = fullMatch.startsWith("!")
        const [_link, _text] = content.split("|")
        if (match.index > lastIndex) {
          newChildren.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          })
        }
        const linkPath = trim(_link)
        const displayText = _text ? trim(_text) : linkPath
        if (isImage) {
          newChildren.push({
            type: "image",
            url: linkPath,
            alt: displayText,
            title: null,
            data: {
              hName: "img",
              hProperties: {
                src: linkPath,
                alt: displayText,
              },
            },
          })
        } else {
          const { link, anchor } = parseLinkWithAnchor(linkPath)
          const isAnchored = linkPath.startsWith("#")
          const samePage = isAnchored || isEmpty(link)
          let url: string
          let linkData: string
          if (samePage) {
            url = pipe(
              dropLeadingHash,
              decodeAnchor,
              slugify,
              concat("#"),
            )(linkPath)
            linkData = ""
          } else if (link.startsWith("posts/")) {
            const f = pipe(
              collapse("posts/"),
              when(isIndexPath, collapse("index/")),
            )(link)
            // url = `/posts/${f}`
            url = f
            linkData = f
          } else if (link.includes("/")) {
            if (isIndexPath(link)) {
              const f = collapse("/index", link)
              // url = `/posts/${f}`
              url = f
              linkData = f
            } else {
              return
            }
          } else {
            url = slugify(link)
            linkData = link
          }
          if (anchor && !samePage && !url.includes("#")) {
            url += "#" + slugify(anchor)
          }
          newChildren.push({
            type: "link",
            url: url,
            title: null,
            data: {
              hName: "a",
              hProperties: {
                className: ["wikilink"],
                "data-wikilink": linkData,
                "data-display-override": displayText,
              },
            },
            children: [
              {
                type: "text",
                value:
                  displayText ||
                  (samePage ? dropLeadingHash(linkPath) : trim(link)),
              },
            ],
          })
          lastIndex = REGEX.WIKI_LINK.lastIndex
        }
        if (lastIndex < node.value.length) {
          newChildren.push({
            type: "text",
            value: node.value.slice(lastIndex),
          })
        }
        if (hasWikilinks && parent && parent.children) {
          nodes.push({ parent, index, newChildren })
        }
      }
    })
    nodes.reverse().forEach(({ parent, index, newChildren }) => {
      if (parent?.children && Array.isArray(parent.children)) {
        parent.children.splice(index, 1, ...newChildren)
      }
    })
  }
}
