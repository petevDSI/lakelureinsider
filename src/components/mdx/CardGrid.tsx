import { Card, type CardProps } from './Card'

interface CardGridProps {
  cards: CardProps[]
  feature?: boolean
}

export function CardGrid({ cards, feature = false }: CardGridProps) {
  if (!cards || cards.length === 0) return null
  return (
    <div className="not-prose my-10 grid gap-5 sm:grid-cols-3">
      {cards.map((card, i) => (
        <Card key={card.href} {...card} featured={feature && i === 0} />
      ))}
    </div>
  )
}
