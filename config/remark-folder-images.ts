import { visit } from "unist-util-visit"
import { normalize, sep } from "node:path"
import type { Predicate, StringPred, NullString } from "#/types"
import {
  unless,
  when,
  replace,
  always as K,
  either,
  both,
  includes,
  __ as $,
  any,
  toLower,
  map,
  anyPass,
  endsWith,
  curry,
  pipe,
  startsWith,
  prop,
  curryN,
  path,
  equals,
  ifElse,
  cond,
} from "ramda"
import { collapse, slug, trimLocal, chop, bisect } from "../utilities/string"
const EXTENSIONS = [
  ".mp3",
  ".wav",
  ".ogg",
  ".m4a",
  ".3gp",
  ".flac",
  ".aac",
  ".mp4",
  ".webm",
  ".ogv",
  ".mov",
  ".mkv",
  ".avi",
  ".pdf",
]
const extensionTests: StringPred[] = map<string, (x: string) => boolean>(
  endsWith,
  EXTENSIONS,
)
const endsWithExtension = anyPass(extensionTests)

const doctorIndex = endsWith("/index.md")
const slashy = (x: string) => "/" + x + "/"

const checkPathScope = curryN(
  3,
  (scope: string, normalized: string, parts: string[]) => {
    const index = parts.indexOf(scope)
    const check = doctorIndex(normalized)
    return [scope, check ? parts[index + 1] : null]
  },
)

type ExplicitPair = [string, string]
type ImplicitPair = ExplicitPair | string

const SPECIAL_PAGE_PATHS = map<ImplicitPair, ExplicitPair>(
  (x: string | [string, string]) => (Array.isArray(x) ? x : [x, x]),
  ["posts", "projects", "docs", "pages", ["special", "pages"]],
)

const getCollection = (normalized: string, pathParts: string[]) =>
  cond(
    map<ExplicitPair, [StringPred, (x: string) => ExplicitPair]>(
      ([check, path]) => [
        pipe(slashy, includes(path)),
        () => checkPathScope(path, normalized, pathParts),
      ],
      SPECIAL_PAGE_PATHS,
    ),
  )(normalized)

const dropImagesAndAttachments = when(
  either(startsWith("images/"), startsWith("attachments/")),
  collapse(/^(images|attachments)\//),
)
const falsy = (x: any) => !x

const convertToWebP = unless(
  anyPass([falsy, startsWith("http"), endsWith(".svg"), endsWith(".webp")]),
  replace(/\.(jpg|jpeg|png|gif|bmp|tiff|tif)$/i, ".webp"),
)

// Custom remark plugin to handle ALL content images (folder-based AND single-file)
export function remarkFolderImages() {
  return function transformer(tree: any, file: any) {
    visit(tree, "image", (node: any) => {
      const { url } = node
      // Skip if already absolute or external URL
      if (!url || url.startsWith("/") || url.startsWith("http")) {
        return
      }

      // Skip non-image files (audio, video, PDF) - these are handled by remarkObsidianEmbeds
      const urlLower = toLower(url)

      if (endsWithExtension(urlLower)) {
        return
      }

      // Determine content type and whether it's folder-based
      let $collection: NullString = null
      let $contentSlug: NullString = null

      if (file.path) {
        const normalizedPath = normalize(file.path)
        const pathParts = normalizedPath.split(sep)
        const [_collection, _contentSlug] = getCollection(
          normalizedPath,
          pathParts,
        )
        $collection = _collection
        $contentSlug = _contentSlug
      }

      const imagePath = trimLocal(url)

      if (!$collection && imagePath.startsWith("attachments/")) {
        $collection = "pages"
      }

      if (!$collection) {
        return
      }

      if ($contentSlug) {
        const cleanImagePath = dropImagesAndAttachments(imagePath)
        node.url = convertToWebP(
          `/${$collection}/${$contentSlug}/${cleanImagePath}`,
        )
      } else if (imagePath.startsWith("attachments/")) {
        node.url = convertToWebP(`/${$collection}/${imagePath}`)
      } else {
        node.url = convertToWebP(`/${$collection}/attachments/${imagePath}`)
      }

      if (node.data && node.data.hProperties) {
        node.data.hProperties.src = url
      }
    })
  }
}
