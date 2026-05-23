"use client"
import TextField from "@/components/TextField.tsx"
import "@/components/Search.scss"
import blem from "#/utilities/blem"
import { useStore } from "@nanostores/react"
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
import Magnifier from "@/components/SearchLogo"
import { search, isSearching } from "@/stores/search.ts"


const BASE = "Search"
const bem = blem(BASE)

const Search = () => {
  const $isSearching = useStore(isSearching)
  return (
    <button className={bem("")} onClick={(e) => isSearching.set(true)}>
      <Magnifier className={bem("search-icon")} />
    </button>
  )
}

export default Search
