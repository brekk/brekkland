import "@/components/ColorBox.scss"
import type { ChangeEvent } from "react"
import blem from "#/utilities/blem.ts"
const bem = blem("ColorBox")

import { colorFg, colorBg, colorBody, palette } from "@/stores/colors"
import { useStore } from "@nanostores/react"

import type { PreinitializedWritableAtom } from "nanostores"

export const colorBoxWithStore =
  <T = string,>(store: PreinitializedWritableAtom<T>, short: string, color: string) => {
    const $color = useStore(store)

    const onChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      // e.stopPropagation()
      const val = e.target.value
      store.set(val as T)
      document.getElementById("body")?.style.setProperty(`--color-${short}`, val)
    }
    const label = `color-${color}`
    return (
      <div className={bem("")}>
        <label htmlFor={label}>{color}</label>
        <input
          type="color"
          id={label}
          defaultValue={$color as string}
          onChange={onChange}
        />
        <input type="text" defaultValue={$color as string} onChange={onChange} />
      </div>
    )
  }


export const ColorBoxBg = () =>
  colorBoxWithStore(colorBg, "bg", "Background")


export const ColorBoxFg = () =>
  colorBoxWithStore(colorFg, "fg", "Foreground")

export const ColorBoxBody = () =>
  colorBoxWithStore(colorBody, "body", "Body")
