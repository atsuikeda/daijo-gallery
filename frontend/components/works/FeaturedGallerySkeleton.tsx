export default function FeaturedGallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-(--color-main)/10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="aspect-3/4 bg-(--color-sub) animate-pulse" />
      ))}
    </div>
  )
}
