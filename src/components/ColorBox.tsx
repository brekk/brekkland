import "@/components/ColorBox.scss"
import type { PreinitializedWritableAtom, Batched } from "nanostores"
import React, { useCallback, useMemo, useRef, useState } from "react"
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

interface PickerProps {
  mods: string[]
  isOpen: boolean
  toggle: () => void
  label: React.ReactNode
  short: string
  color: string
  onChange: (newColor: string) => void
  comparisons: { a: Batched; b: Batched }
  ref: React.RefObject<HTMLDivElement | null>
}

type Comp = Batched<Accessibility, string>

export const Picker = ({
  mods = [],
  ref,
  label,
  onChange,
  isOpen: $isOpen,
  short,
  color: $color,
  toggle,
  comparisons: { a: $a, b: $b },
}: PickerProps) => (
  <div className={bem("picker", mods)} id={`color-${short}`}>
    <div
      className={bem("swatch", [short])}
      style={{ backgroundColor: $color }}
      onClick={toggle}
    >
      {$b.aaa || $a.aaa ? (
        <AAA />
      ) : $b.aaaLarge || $a.aaaLarge ? (
        <AAALarge />
      ) : $b.aa || $a.aa ? (
        <AA />
      ) : $b.aaLarge || $a.aaLarge ? (
        <AALarge />
      ) : null}
    </div>

    {$isOpen && (
      <div className={bem("popover")} ref={ref}>
        <strong className={bem("label")}>{label}</strong>
        <HexColorPicker color={$color} onChange={onChange} />
      </div>
    )}
  </div>
)
export const usePicker = (
  short: string,
  store: PreinitializedWritableAtom<string>,
  [comp1, comp2]: [Comp, Comp],
): Omit<PickerProps, "label"> => {
  const $color = useStore(store)
  const $comp1 = useStore(comp1)
  const $comp2 = useStore(comp2)
  const [$isOpen, $setIsOpen] = useState(false)

  const ref = useClickAway(() => {
    $setIsOpen(false)
  })
  const onChange = useCallback(
    (newColor: string) => {
      store.set(newColor)
      const varName = `--color-${short}`
      const [hatemail] = document.getElementsByTagName("html")
      hatemail?.style.setProperty(varName, newColor)
      document.getElementById("body")?.style.setProperty(varName, newColor)
    },
    [store, short],
  )
  const mods = useMemo(() => [
    short,
    $comp1.aa && $comp2.aa ? "aa" : "no-aa",
    $comp1.aaLarge && $comp2.aaLarge ? "aa-large" : "no-aa-large",
    $comp1.aaa && $comp2.aaa ? "aaa" : "no-aaa",
    $comp1.aaaLarge && $comp2.aaaLarge ? "aaa-large" : "no-aaa-large",
  ], [short, $comp1, $comp2])
  return {
    short,
    color: $color,
    comparisons: { a: $comp1, b: $comp2 },
    isOpen: $isOpen,
    toggle: () => $setIsOpen(!$isOpen),
    ref: ref as any,
    mods,
    onChange,
  }
}

export const ColorBoxBg = () => {
  const dynaProps = usePicker("bg", $bg, [$contrastFgBg, $contrastBgAccent])
  return <Picker label="Background" {...dynaProps} />
}

export const ColorBoxFg = () => {
  const dynaProps = usePicker("fg", $fg, [$contrastFgBg, $contrastFgAccent])
  return <Picker label="Foreground" {...dynaProps} />
}

export const ColorBoxAccent = () => {
  const dynaProps = usePicker("accent", $accent, [
    $contrastFgAccent,
    $contrastBgAccent,
  ])
  return <Picker label="Accent" {...dynaProps} />
}
