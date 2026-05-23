import blem from "#/utilities/blem"
const bem = blem("SearchOverlay")
import { search, isSearching } from "@/stores/search.ts"
import { useStore } from "@nanostores/react"

const SearchOverlay = () => {
  const $search = useStore(search)
  const $isSearching = useStore(isSearching)
  return (
    <div className={bem("", [$isSearching ? "searching" : "idle"])}>
      
      <input
        type="text"
        className={bem("global-search")}
        placeholder="Search Brekk.land"
        id="global-search"
        defaultValue={$search}
        onChange={(e) => search.set(e.target.value)}
      />
    </div>
  )
}

export default SearchOverlay
