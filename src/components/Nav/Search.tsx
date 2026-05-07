"use client"
import TextField from "@/components/TextField.tsx"
import blem from "#/utilities/blem"
import { useStore } from "@nanostores/react"
import { pipe, path } from "ramda"
import { search } from "@/stores/search"
import { Search as MagIcon, X as Kill } from "lucide-react"
import Debug from "@/components/Debug"
import SpeechBubble from "@/svg-components/SpeechBubble"
import {
  type BemProps,
  bemifyProps,
  el,
  eventValue,
  blemEl,
} from "#/utilities/react"
import { exact, icon } from "@/components/Icons"
import Magnifier from "@/components/SearchLogo"

const BASE = "Search"
const bem = blem(BASE)

const Search = () => {
  const $search = useStore(search)
  const onClick = () => search.set("")
  return (
    <div className={bem("")}>
      <div className={bem("search-wrapper", ["waiting"])}>
        <div className={bem("search-icon-wrapper")}>
          <Magnifier className={bem("search-icon")} alt="Search" />
<input
          type="text"
          className={bem("input")}
          placeholder="Search Brekk.land"
          id="global-search"
        />
        </div>
       <SpeechBubble /> 
      </div>
    </div>
  )
}

export default Search
