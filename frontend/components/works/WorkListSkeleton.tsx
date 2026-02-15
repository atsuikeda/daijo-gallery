export default function WorkListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-4/5 bg-(--color-sub) animate-pulse" />
          <div className="mt-2 space-y-1.5">
            <div className="h-4 w-3/4 bg-(--color-sub) animate-pulse rounded" />
            <div className="h-3 w-1/4 bg-(--color-sub) animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
