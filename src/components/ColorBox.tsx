import "@/components/ColorBox.scss"
import blem from "#/utilities/blem.ts"
const bem = blem("ColorBox")

import { colorFg, colorBg, colorBody, palette } from "@/stores/colors"
import { useStore } from "@nanostores/react"

import type { PreinitializedWritableAtom } from "nanostores"
interface Props {
  color: string
  store: PreinitializedWritableAtom<string>
}

export const ColorBox = ({ color, store }: Props) => {
  const $color = useStore(store)
  return (
    <div className={bem("")}>
      <label htmlFor={`color-${color}`}>{color}</label>
      <input
        type="color"
        id={`color-${color}`}
        onChange={(e) => {
          e.stopPropagation()
          store.set(e.target.value)
        }}
      />
      <input type="text" value={$color} readOnly />
    </div>
  )
}

export default ColorBox
