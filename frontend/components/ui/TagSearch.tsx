'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tag } from '@/types/work'

interface TagSearchProps {
  tags: Tag[]
}

export default function TagSearch({ tags }: TagSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const activeTagId = Number(searchParams.get('tag')) || null

  const handleTagClick = (tagId: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTagId === tagId) {
      params.delete('tag')
    } else {
      params.set('tag', tagId.toString())
    }
    params.set('page', '1')
    startTransition(() => {
      router.replace(`/works?${params.toString()}`)
    })
  }

  return (
    <div className={`flex flex-wrap gap-2 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag.id)}
          disabled={isPending}
          className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
            activeTagId === tag.id
              ? 'bg-(--color-main) text-white border-(--color-main)'
              : 'bg-white text-(--color-text)/60 border-(--color-main)/15 hover:border-(--color-main) hover:text-(--color-main)'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
