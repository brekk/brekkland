import { el, elDef } from "#/utilities/react"
import { __ as $ } from "ramda"

export const ICON_DEFAULT = {
  size: 15,
  className: "icon",
}
export const icon = elDef(ICON_DEFAULT)
export const exact = el($, ICON_DEFAULT)
