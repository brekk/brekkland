import "@/components/GradientBox.scss"
import type { BrekklandGradient } from "@/stores/settings"
import type { PreinitializedWritableAtom } from "nanostores"
import React, { useCallback, useRef, useState } from "react"
import { HexColorPicker } from "react-colorful"
import type { ChangeEvent } from "react"
import blem from "#/utilities/blem.ts"
import { GRADIENT_RECORD, $settingsGradient } from "@/stores/settings"
import { Hexagon, TriangleDashed, Pyramid, Antenna, Cpu } from "lucide-react"

import { useStore } from "@nanostores/react"
const bem = blem("GradientBox")

const ICON_RECORD = [
  Pyramid,
  TriangleDashed,
  Cpu,
  Antenna,
  Hexagon,
]

const GradientBox = () => {
  const [$i, $setI] = useState(0)
  const $gradient = useStore($settingsGradient)
  const clicky = (e: React.MouseEvent<unknown>) => {
    e.preventDefault()
    $setI((i) => {
      const j = (i + 1) % GRADIENT_RECORD.length
      $settingsGradient.set(GRADIENT_RECORD[j] as BrekklandGradient)

      return j
    })
  }
  const Icon = ICON_RECORD[$i]

  return <div className={bem("")} onClick={clicky}>
    <Icon />
  </div>
}
export default GradientBox
