'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tag } from '@/types/work'
import TagButton from '@/components/ui/button/TagButton'

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
        <TagButton
          key={tag.id}
          label={tag.name}
          isActive={activeTagId === tag.id}
          isPending={isPending}
          onClick={() => handleTagClick(tag.id)}
        />
      ))}
    </div>
  )
}
