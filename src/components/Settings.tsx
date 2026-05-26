import "@/components/Settings.scss"
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
        className={bem("button", [...activeClass, "settings"])}
        onClick={(e) => {
          e.preventDefault()
          $setVisible(true)
        }}
      >
        <SlidersVertical />
      </button>
      <div className={bem("pane", activeClass)} onClick={() => /*$setVisible(false)}>*/ { }}>
        <SlidersVertical className={bem("context-indicator")} />
        <div className={bem("wrapper", activeClass)}>

          <ColorBoxFg />
          <ColorBoxBg />
          <ColorBoxBody />
        </div>
      </div>
    </div >
  )
}

export default Settings
