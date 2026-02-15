'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TextSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    startTransition(() => {
      router.replace(`/works?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="作品名で検索"
        className="w-full max-w-xs px-3 py-2 text-sm border border-(--color-main)/15 rounded-(--btn-radius) bg-white text-(--color-text) placeholder:text-(--color-text)/30 focus:outline-none focus:ring-2 focus:ring-(--color-accent)/30 focus:border-(--color-accent) transition"
      />
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 px-4 py-2 text-sm bg-(--color-main) text-white rounded-(--btn-radius) hover:bg-(--color-main-hover) active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
      >
        {isPending ? '検索中...' : '検索'}
      </button>
    </form>
  )
}
