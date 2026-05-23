import { atom, computed, map } from "nanostores"

export const search = atom<string>("")
export const isSearching = atom<boolean>(false)
