import "@/components/ColorBox.scss"
import type { PreinitializedWritableAtom } from "nanostores"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"

import { useClickAway } from "@uidotdev/usehooks"
import type { ChangeEvent } from "react"
import blem from "#/utilities/blem.ts"

import { colorFg, colorBg, colorBody, palette } from "@/stores/colors"
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
        document
          .getElementById("body")
          ?.style.setProperty(varName, newColor)
      }

      return (
        <div className={bem("picker")}>
          <div
            className={bem("swatch")}
            style={{ backgroundColor: $color }}
            onClick={() => $setIsOpen(true)}
          />

          {$isOpen && (
            <div className={bem("popover")} ref={ref as any}>
              <HexColorPicker color={$color} onChange={onChange} />
            </div>
          )}
        </div>
      )
    }

export const ColorBoxBg = () => {
  const C = makePicker("bg", colorBg, "Background")
  return <C />
}

export const ColorBoxFg = () => {
  const C = makePicker("fg", colorFg, "Foreground")
  return <C />
}

export const ColorBoxBody = () => {
  const C = makePicker("body", colorBody, "Body")
  return <C />
}
