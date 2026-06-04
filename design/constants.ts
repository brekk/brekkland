import { map } from "ramda"

export const path = map((v: string) => import.meta.env.BASE_URL + v, {
  UI: "/ui",
  SOFTWARE: "/software",
  ART: "/art",
  TYPE: "/type",
})
console.log("PATHEMATICS", path)

export const locations = {
  nav: {
    UI: path.UI,
    Software: path.SOFTWARE,
    Art: path.ART,
    Type: path.TYPE,
  },
}

export default { locations, path }
