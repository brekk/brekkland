import "@/components/ColorBox.scss"
import type { PreinitializedWritableAtom as Atom, Batched } from "nanostores"
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
  mods: string[]
  ref: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

type Comp = Batched<Accessibility, string>

const comparisonsToIcon = ($a: Comp, $b: Comp) =>
  $b.aaa || $a.aaa ? (
    <AAA />
  ) : $b.aaaLarge || $a.aaaLarge ? (
    <AAALarge />
  ) : $b.aa || $a.aa ? (
    <AA />
  ) : $b.aaLarge || $a.aaLarge ? (
    <AALarge />
  ) : null

const useComparison = (a: Comp, b: Comp) => {
  const $a = useStore(a)
  const $b = useStore(b)
  return [
    $a.aa && $b.aa ? "aa" : "no-aa",
    $a.aaLarge && $b.aaLarge ? "aa-large" : "no-aa-large",
    $a.aaa && $b.aaa ? "aaa" : "no-aaa",
    $a.aaaLarge && $b.aaaLarge ? "aaa-large" : "no-aaa-large",
  ]
}

export const Picker = ({
  ref,
  label,
  onChange,
  isOpen: $isOpen,
  short,
  color: $color,
  toggle,
  children,
  mods = [],
}: PickerProps) => {
  return (
    <div className={bem("picker", mods)} id={`color-${short}`}>
      <div
        className={bem("swatch", [short])}
        style={{ backgroundColor: $color }}
        onClick={toggle}
      >
        {children}
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
  store: Atom<string>,
): Omit<PickerProps, "mods" | "label" | "children"> => {
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

const makePickerComponent = (
  label: string,
  key: string,
  store: Atom<string>,
  ab: [Comp, Comp],
) => {
  const C = () => {
    const pickerProps = usePicker(key, store)
    const children = comparisonsToIcon(...ab)
    const mods = useComparison(...ab)
    const dynaProps = { ...pickerProps, mods, label, children }
    return <Picker {...dynaProps} />
  }
  C.displayName = label + "Picker"
  return C
}

export const ColorBoxBg = makePickerComponent("Background", "bg", $bg, [
  $contrastFgBg,
  $contrastBgAccent,
])
export const ColorBoxFg = makePickerComponent("Foreground", "fg", $fg, [
  $contrastFgBg,
  $contrastFgAccent,
])
export const ColorBoxAccent = makePickerComponent("accent", "accent", $accent, [
  $contrastBgAccent,
  $contrastFgAccent,
])
