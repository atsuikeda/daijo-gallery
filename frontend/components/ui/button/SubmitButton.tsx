type Props = {
  isPending: boolean
  label: string
  pendingLabel?: string
}

export default function SubmitButton({ isPending, label, pendingLabel = '処理中...' }: Props) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="shrink-0 px-4 py-2 text-sm bg-(--color-main) text-white rounded-(--btn-radius) hover:bg-(--color-main-hover) active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
    >
      {isPending ? pendingLabel : label}
    </button>
  )
}
