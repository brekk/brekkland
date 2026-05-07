"use client"
import TextField from "@/components/TextField.tsx"
import blem from "#/utilities/blem"
import { useStore } from "@nanostores/react"
import { pipe, path } from "ramda"
import { search } from "@/stores/search"
import { Search as MagIcon, X as Kill } from "lucide-react"
import Debug from "@/components/Debug"
import {
  type BemProps,
  bemifyProps,
  el,
  eventValue,
  blemEl,
} from "#/utilities/react"
import { exact, icon } from "@/components/Icons"

const BASE = "Search"
const bem = blem(BASE)

const Search = () => {
  const $search = useStore(search)
  const onClick = () => search.set("")
  return (
    <div className={bem("")}>
      <TextField
        iconHead={icon(MagIcon, { className: bem("icon", "search") })}
        iconTail={
          $search
            ? icon(Kill, {
                className: bem("icon", "kill"),
                onClick,
              })
            : null
        }
        id="global-search"
        bem={bem}
        value={$search}
        onChange={pipe(eventValue, search.set)}
      />
    </div>
  )
}

export default Search
