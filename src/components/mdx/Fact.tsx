import { facts } from '@/data/facts'

interface FactProps {
  id: string
}

export function Fact({ id }: FactProps) {
  const fact = facts[id]
  if (!fact?.value) {
    return (
      <span className="inline-block rounded bg-[--clay]/15 px-1 font-mono text-[0.8em] text-[--clay]">
        {'{{TODO}}'}
      </span>
    )
  }
  return <span>{fact.value}</span>
}
