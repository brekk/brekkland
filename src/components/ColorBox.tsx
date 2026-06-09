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
  isOpen: boolean
  toggle: () => void
  label: React.ReactNode
  short: string
  color: string
  onChange: (newColor: string) => void
  comparisons: [Comp, Comp]
  ref: React.RefObject<HTMLDivElement | null>
}

type Comp = Batched<Accessibility, string>

export const Picker = ({
  ref,
  label,
  onChange,
  isOpen: $isOpen,
  short,
  color: $color,
  toggle,
  comparisons: [a, b],
}: PickerProps) => {
  const $a = useStore(a)
  const $b = useStore(b)
  const mods = [
    short,
    $a.aa && $b.aa ? "aa" : "no-aa",
    $a.aaLarge && $b.aaLarge ? "aa-large" : "no-aa-large",
    $a.aaa && $b.aaa ? "aaa" : "no-aaa",
    $a.aaaLarge && $b.aaaLarge ? "aaa-large" : "no-aaa-large",
  ]
  return (
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
}
export const usePicker = (
  short: string,
  store: PreinitializedWritableAtom<string>,
): Omit<PickerProps, "comparisons" | "label"> => {
  const $color = useStore(store)
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
  return {
    short,
    color: $color,
    isOpen: $isOpen,
    toggle: () => $setIsOpen(!$isOpen),
    ref: ref as any,
    onChange,
  }
}

export const ColorBoxBg = () => {
  const dynaProps = usePicker("bg", $bg)
  return (
    <Picker
      label="Background"
      {...dynaProps}
      comparisons={[$contrastFgBg, $contrastBgAccent]}
    />
  )
}

export const ColorBoxFg = () => {
  const dynaProps = usePicker("fg", $fg)
  return (
    <Picker
      label="Foreground"
      {...dynaProps}
      comparisons={[$contrastFgBg, $contrastFgAccent]}
    />
  )
}

export const ColorBoxAccent = () => {
  const dynaProps = usePicker("accent", $accent)
  return <Picker label="Accent" {...dynaProps} comparisons={[
    $contrastFgAccent,
    $contrastBgAccent,
  ]} />
}
