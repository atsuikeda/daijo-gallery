'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tag } from '@/types/work'

interface TagSearchProps {
  tags: Tag[]
}

export default function TagSearch({ tags }: TagSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTagId = Number(searchParams.get('tag')) || null

  const handleTagClick = (tagId: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTagId === tagId) {
      params.delete('tag')
    } else {
      params.set('tag', tagId.toString())
    }
    params.set('page', '1')
    router.push(`/works?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag.id)}
          className={`
            px-4 py-1.5
            rounded-full
            text-sm font-medium
            border
            transition-all duration-200
            cursor-pointer
            ${
              activeTagId === tag.id
                ? 'bg-(--color-main) text-white border-(--color-main)'
                : 'bg-white text-(--color-text) border-gray-300 hover:border-(--color-main) hover:text-(--color-main)'
            }
          `}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
