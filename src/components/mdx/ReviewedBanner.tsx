interface Props {
  date?: string
}

export function ReviewedBanner({ date }: Props) {
  if (!date) return null
  return (
    <div className="my-6 rounded-lg border-l-4 border-[--lake] bg-[--sand] px-4 py-3 text-sm text-[--ink]">
      <strong>Last reviewed: {date}.</strong> Conditions change without notice — verify details with the linked primary sources before your trip.
    </div>
  )
}
