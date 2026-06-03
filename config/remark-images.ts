import { visit } from "unist-util-visit"
export function imageCaption() {
  return function transformer(tree: any) {
    visit(tree, "image", (node: any) => {
      // If the image has a title attribute, store it as caption data
      if (node.title) {
        if (!node.data) {
          node.data = {}
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {}
        }
        node.data.hProperties["data-caption"] = node.title
        node.data.hProperties.title = node.title
      }
    })
  }
}
