'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TextSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    router.push(`/works?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="作品名で検索"
        className="
          w-full max-w-sm
          px-4 py-2.5
          border border-gray-300
          rounded-lg
          bg-white
          text-(--color-text)
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-(--color-accent)/40 focus:border-(--color-accent)
          transition
        "
      />
      <button
        onClick={handleSearch}
        className="
          px-5 py-2.5
          bg-(--color-main) text-white
          rounded-lg
          font-medium
          transition-all duration-200
          hover:bg-(--color-main-hover)
          hover:shadow-md
          active:scale-[0.97]
          cursor-pointer
          whitespace-nowrap
        "
      >
        検索
      </button>
    </div>
  )
}
