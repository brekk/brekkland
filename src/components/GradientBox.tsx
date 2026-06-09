import "@/components/GradientBox.scss"
import type { BrekklandGradient } from "@/stores/settings"
import type { PreinitializedWritableAtom } from "nanostores"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"
import type { ChangeEvent } from "react"
import blem from "#/utilities/blem.ts"
import { DEFAULT_GRADIENT, GRADIENT_RECORD, $settingsGradient } from "@/stores/settings"
import { Zap, Landmark, Diamond, Hexagon, TableRowsSplit, TriangleDashed, Pyramid, Antenna, Cpu, LayoutDashboard, CirclePile } from "lucide-react"

import { useStore } from "@nanostores/react"
const bem = blem("GradientBox")

const ICON_RECORD = [
  Pyramid,
  TriangleDashed,
  Cpu,
  Antenna,
  Hexagon,
  TableRowsSplit,
  Diamond,
  CirclePile,
  Landmark,
  LayoutDashboard,
  Zap
]

const GradientBox = () => {
  const [$i, $setI] = useState(GRADIENT_RECORD.indexOf(DEFAULT_GRADIENT))
  const $gradient = useStore($settingsGradient)
  const clicky = useCallback((e: React.MouseEvent<unknown>) => {
    e.preventDefault()
    const j = ($i + 1) % GRADIENT_RECORD.length
    $settingsGradient.set(GRADIENT_RECORD[j] as BrekklandGradient)
    $setI(j)
  }, [$gradient, $settingsGradient, $i])
  const Icon = ICON_RECORD[$i]

  return <div className={bem("")} onClick={clicky}>
    <Icon />
  </div>
}
export default GradientBox
