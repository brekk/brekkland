import "@/components/ColorBox.scss"
import type { PreinitializedWritableAtom } from "nanostores"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

import { useClickAway } from "@uidotdev/usehooks"
import type { ChangeEvent } from "react"
import blem from "#/utilities/blem.ts"

import { $bg, $fg, $accent, $palette } from "@/stores/colors"
import { useStore } from "@nanostores/react"
const bem = blem("ColorBox")

export const makePicker =
  (short: string, store: PreinitializedWritableAtom<string>, label: string) =>
    () => {
      const $color = useStore(store)
      const [$isOpen, $setIsOpen] = useState(false)

      const ref = useClickAway(() => {
        $setIsOpen(false)
      })
      const onChange = (newColor: string) => {
        store.set(newColor)
        const varName = `--color-${short}`
        const [hatemail] = document.getElementsByTagName("html")
        hatemail?.style.setProperty(varName, newColor)
        document.getElementById("body")?.style.setProperty(varName, newColor)
      }

      return (
        <div className={bem("picker", [short])} id={`color-${short}`}>
          <div
            className={bem("swatch", [short])}
            style={{ backgroundColor: $color }}
            onClick={() => $setIsOpen(true)}
          />

          {$isOpen && (
            <div className={bem("popover")} ref={ref as any}>
              <strong className={bem("label")}>{label}</strong>
              <HexColorPicker color={$color} onChange={onChange} />
            </div>
          )}
        </div>
      )
    }

export const ColorBoxBg = () => {
  const C = makePicker("bg", $bg, "Background")
  return <C />
}

export const ColorBoxFg = () => {
  const C = makePicker("fg", $fg, "Foreground")
  return <C />
}

export const ColorBoxAccent = () => {
  const C = makePicker("accent", $accent, "Accent")
  return <C />
}
