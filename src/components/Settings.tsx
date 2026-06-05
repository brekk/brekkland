import "@/components/Settings.scss"
import { SlidersVertical } from "lucide-react"
import {
  ColorBoxFg,
  ColorBoxBg,
  ColorBoxAccent,
} from "@/components/ColorBox.tsx"
import blem from "#/utilities/blem.ts"
import { useState } from "react"
import { $settingsVisible } from "@/stores/settings"
import { useStore } from "@nanostores/react"

const bem = blem("Settings")

interface SubProps {
  activeClass: string[]
  toggle: (e: React.MouseEvent<unknown>) => void
}

const useSettingsStore = () => {
  const isVisible = useStore($settingsVisible)

  const activeClass = [isVisible ? "active" : "inactive"]
  const toggle = (e: React.MouseEvent<unknown>) => {
    e.preventDefault()
    $settingsVisible.set(!isVisible)
  }
  return { isVisible, toggle, activeClass }
}

export const DumbSettingsPane = ({ activeClass, toggle }: SubProps) => (
  <div className={bem("pane", activeClass)}>
    <SlidersVertical className={bem("context-indicator")} onClick={toggle} />
    <div className={bem("wrapper", activeClass)}>
      <ColorBoxFg />
      <ColorBoxBg />
      <ColorBoxAccent />
    </div>
  </div>
)

const DumbSettingsToggle = ({ toggle, activeClass }: SubProps) => (
  <button
    className={bem("button", [...activeClass, "settings"])}
    onClick={toggle}
  >
    <SlidersVertical />
  </button>
)

export const SettingsToggle = () => {
  const $settings = useSettingsStore()
  return (
    <DumbSettingsToggle {...$settings} />
  )
}

export const SettingsPane = () => {
  const $settings = useSettingsStore()
  return (
    <DumbSettingsPane {...$settings} />
  )
}

export const Settings = () => {
  const $settings = useSettingsStore()
  return (
    <div className={bem("")}>
      <DumbSettingsToggle {...$settings} />
      <DumbSettingsPane {...$settings} />
    </div>
  )
}

export default Settings
