import "@/components/ColorBox.scss"
import blem from "#/utilities/blem.ts"
const bem = blem("ColorBox")

import { colorFg, colorBg, colorBody, palette } from "@/stores/colors"
import { useStore } from "@nanostores/react"

import type { PreinitializedWritableAtom } from "nanostores"
interface Props {
  color: string
}

export const colorBoxWithStore =
  <T = string,>(store: PreinitializedWritableAtom<T>, short: string, color: string) => {
    const $color = useStore(store)
    return (
      <div className={bem("")}>
        <label htmlFor={`color-${color}`}>{color}</label>
        <input
          type="color"
          id={`color-${color}`}
          defaultValue={$color as string}
          onChange={(e) => {
            // e.stopPropagation()
            const val = e.target.value
            store.set(val as T)
            document.getElementById("body")?.style.setProperty(`--color-${short}`, val)
          }}
        />
        <input type="text" value={$color as string} readOnly />
      </div>
    )
  }

interface ColorOnly {
  color: string
}

export const ColorBoxBg = () =>
  colorBoxWithStore(colorBg, "bg", "Background")


export const ColorBoxFg = () =>
  colorBoxWithStore(colorFg, "fg", "Foreground")

export const ColorBoxBody = () =>
  colorBoxWithStore(colorBody, "body", "Body")
