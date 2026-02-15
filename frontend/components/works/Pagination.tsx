'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `/works?${params.toString()}`
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-6" aria-label="ページナビゲーション">
      <button
        disabled={currentPage <= 1}
        onClick={() => router.push(createPageURL(currentPage - 1))}
        className="px-4 py-2 text-sm rounded-(--btn-radius) transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-(--color-sub) text-(--color-main) hover:bg-(--color-main) hover:text-white"
      >
        前へ
      </button>
      <span className="text-sm tabular-nums text-(--color-text)/60">
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => router.push(createPageURL(currentPage + 1))}
        className="px-4 py-2 text-sm rounded-(--btn-radius) transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-(--color-sub) text-(--color-main) hover:bg-(--color-main) hover:text-white"
      >
        次へ
      </button>
    </nav>
  )
}
