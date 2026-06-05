import "@/components/Settings.scss"
import { SlidersVertical } from "lucide-react"
import { ColorBoxFg, ColorBoxBg, ColorBoxAccent } from "@/components/ColorBox.tsx"
import blem from "#/utilities/blem.ts"
import { useState } from "react"

const bem = blem("Settings")
export const Settings = () => {
  const [$visible, $setVisible] = useState(false)
  const activeClass = [$visible ? "active" : "inactive"]
  const toggle = (e) => {

    e.preventDefault()
    $setVisible(!$visible)
  }
  return (
    <div className={bem("")}>
      <button
        className={bem("button", [...activeClass, "settings"])}
        onClick={toggle}
      >
        <SlidersVertical />
      </button>
      <div className={bem("pane", activeClass)} onClick={() => /*$setVisible(false)}>*/ { }}>
        <SlidersVertical className={bem("context-indicator")} onClick={toggle} />
        <div className={bem("wrapper", activeClass)}>
          <ColorBoxFg />
          <ColorBoxBg />
          <ColorBoxAccent />
        </div>
      </div>
    </div >
  )
}

export default Settings
