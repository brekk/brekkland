import { SlidersVertical } from "lucide-react"
import { ColorBoxFg, ColorBoxBg, ColorBoxBody } from "@/components/ColorBox.tsx"
import blem from "#/utilities/blem.ts"
import { useState } from "react"

const bem = blem("Settings")
export const Settings = () => {
  const [$visible, $setVisible] = useState(false)
  const activeClass = [$visible ? "active" : "inactive"]
  return (
    <div className={bem("")}>
      <button
        className={bem("settings", activeClass)}
        onClick={(e) => {
          e.preventDefault()
          $setVisible(true)
        }}
      >
        <SlidersVertical />
      </button><div className={bem("pane", activeClass)}>
        <ColorBoxFg />
        <ColorBoxBg />
        <ColorBoxBody />
      </div>
    </div>

  )
}

export default Settings
