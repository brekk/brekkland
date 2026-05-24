
import blem from "#/utilities/blem"
import "@/components/LogoBox.scss"
import { Brekkland, Swapped } from "@/svg-components/Brekkland.tsx"
const bem = blem("LogoBox")
interface Props {
  className?: string,
  mods?: string[]
}

const LogoBox = ({ className = '', mods = [] }: Props) => (
  <div className={className + " " + bem("", mods)}>
    <div className={bem("wrapper")}>
      <Brekkland className={bem("logo")} />
      <Swapped className={bem("logo", ["swapped"])} />
    </div>
  </div>)


export default LogoBox
