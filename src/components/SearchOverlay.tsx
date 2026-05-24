import blem from "#/utilities/blem"
import LogoBox from "@/components/LogoBox.astro"
const bem = blem("SearchOverlay")
import { search, isSearching } from "@/stores/search.ts"
import { useStore } from "@nanostores/react"
import "@/components/SearchOverlay.scss"

const SearchOverlay = () => {
  const $search = useStore(search)
  const $isSearching = useStore(isSearching)
  return (
    <div
      className={bem("", [$isSearching ? "searching" : "idle"])}
      onClick={(e) => {
        e.preventDefault()
        console.log("no longer searching")
        isSearching.set(false)
      }}
    >
      <div className={bem("wrapper")}>
        <LogoBox mods={["floating"]} />
        <label className={bem("search-label")} htmlFor="global-search">
          Search
        </label>
        <input
          type="text"
          className={bem("global-search")}
          placeholder="Search Brekk.land"
          id="global-search"
          defaultValue={$search}
          onChange={(e) => search.set(e.target.value)}
        />
      </div>
    </div>
  )
}

export default SearchOverlay
