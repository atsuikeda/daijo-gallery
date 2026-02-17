type Props = {
  label: string
  isActive: boolean
  isPending: boolean
  onClick: () => void
}

export default function TagButton({ label, isActive, isPending, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? 'bg-(--color-main) text-white border-(--color-main)'
          : 'bg-white text-(--color-text)/60 border-(--color-main)/15 hover:border-(--color-main) hover:text-(--color-main)'
      }`}
    >
      {label}
    </button>
  )
}
