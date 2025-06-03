"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 size-4 pointer-events-none" />
      <Input
        placeholder="Buscar proyecto..."
        className="pl-9 text-sm bg-white dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 text-indigo-900 dark:text-white placeholder:text-indigo-400 dark:placeholder:text-indigo-500 focus:ring-2 focus:ring-indigo-500"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  )
}
