"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
      <Input
        placeholder="Buscar proyecto..."
        className="pl-9 text-sm bg-background text-foreground border border-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  )
}
