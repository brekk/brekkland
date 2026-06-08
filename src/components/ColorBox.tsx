import "@/components/ColorBox.scss"
import type { PreinitializedWritableAtom, Batched } from "nanostores"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"
import type { Accessibility } from "#/colorable.d.ts"

import { useClickAway } from "@uidotdev/usehooks"
import type { ChangeEvent } from "react"
import { AA, AAA, AAALarge, AALarge } from "@/svg-components/Contrast.tsx"
import blem from "#/utilities/blem.ts"

import {
  $bg,
  $fg,
  $accent,
  $palette,
  $contrastBgAccent,
  $contrastFgAccent,
  $contrastFgBg,
} from "@/stores/colors"
import { useStore } from "@nanostores/react"
const bem = blem("ColorBox")

type Comp = Batched<Accessibility, string>

export const makePicker =
  (
    short: string,
    store: PreinitializedWritableAtom<string>,
    label: string,
    [comp1, comp2]: [Comp, Comp],
  ) =>
    () => {
      const $color = useStore(store)
      const $comp1 = useStore(comp1)
      const $comp2 = useStore(comp2)
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
      const mods = [
        short,
        $comp1.aa && $comp2.aa ? "aa" : "no-aa",
        $comp1.aaLarge && $comp2.aaLarge ? "aa-large" : "no-aa-large",
        $comp1.aaa && $comp2.aaa ? "aaa" : "no-aaa",
        $comp1.aaaLarge && $comp2.aaaLarge ? "aaa-large" : "no-aaa-large",
      ]

      return (
        <div className={bem("picker", mods)} id={`color-${short}`}>
          <div
            className={bem("swatch", [short])}
            style={{ backgroundColor: $color }}
            onClick={() => $setIsOpen(true)}
          >
            {$comp2.aaa || $comp1.aaa ? (
              <AAA />
            ) : $comp2.aaaLarge || $comp1.aaaLarge ? (
              <AAALarge />
            ) : $comp2.aa || $comp1.aa ? (
              <AA />
            ) : $comp2.aaLarge || $comp1.aaLarge ? (
              <AALarge />
            ) : null}
          </div>

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
  const C = makePicker("bg", $bg, "Background", [
    $contrastFgBg,
    $contrastBgAccent,
  ])
  return <C />
}

export const ColorBoxFg = () => {
  const C = makePicker("fg", $fg, "Foreground", [
    $contrastFgBg,
    $contrastFgAccent,
  ])
  return <C />
}

export const ColorBoxAccent = () => {
  const C = makePicker("accent", $accent, "Accent", [
    $contrastFgAccent,
    $contrastBgAccent,
  ])
  return <C />
}
