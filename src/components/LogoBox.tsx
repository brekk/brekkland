
import blem from "#/utilities/blem"
import "@/components/LogoBox.scss"
import Logo from "@/assets/brekkland.svg"
import LogoSwapped from "@/assets/brekkland-swapped.svg"
const bem = blem("LogoBox")


const LogoBox = ({ className, mods = [] }) => (
  <div className={className + " " + bem("", mods)}>
    <div className={bem("wrapper")}>
      <Logo className={bem("logo")} />
      <LogoSwapped className={bem("logo", ["swapped"])} />
    </div>
  </div>)


export default LogoBox
