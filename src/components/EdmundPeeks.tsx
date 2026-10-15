'use client'

import { useEffect, useState } from 'react'

// Edmund peeks in from the edges of the /edmund page.
//  - Bottom: rises into view a couple of seconds after load and stays.
//  - Right edge: leans in while the story section is on screen.
//  - Left edge: leans in while the shop section is on screen.
// The whole layer ignores taps, is hidden from screen readers, and the side
// peeks are dropped on phones so they never cover text.

function useSectionVisible(id: string, threshold: number) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = document.getElementById(id)
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [id, threshold])
  return visible
}

const CSS = `
.edp { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 30; }
.edp img { position: absolute; display: block; height: auto; user-select: none; -webkit-user-drag: none; }

.edp .bottom {
  width: clamp(150px, 24vw, 260px);
  right: clamp(8px, 6vw, 80px);
  bottom: 0;
  transform: translateY(100%);
  animation: edp-rise 1.1s cubic-bezier(.2,.9,.3,1.15) 2s forwards;
}
@keyframes edp-rise { to { transform: translateY(50%); } }

.edp .side { width: clamp(95px, 11vw, 150px); transition: transform .8s cubic-bezier(.2,.9,.3,1.1); display: none; }
.edp .right { right: 0; top: 34%; transform: translateX(100%); }
.edp .right.on { transform: translateX(28%); }
.edp .left { left: 0; top: 50%; transform: translateX(-100%); }
.edp .left.on { transform: translateX(-28%); }

@media (min-width: 700px) { .edp .side { display: block; } }

@media (prefers-reduced-motion: reduce) {
  .edp .bottom { animation: none; transform: translateY(50%); }
  .edp .side { transition: none; }
}
`

export function EdmundPeeks() {
  const showRight = useSectionVisible('story', 0.2)
  const showLeft = useSectionVisible('shop', 0.2)

  return (
    <div className="edp" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {/* eslint-disable @next/next/no-img-element */}
      <img className="bottom" src="/images/edmund-peek-bottom.webp" alt="" width={625} height={492} decoding="async" />
      <img className={`side right${showRight ? ' on' : ''}`} src="/images/edmund-peek-right.webp" alt="" width={492} height={625} decoding="async" />
      <img className={`side left${showLeft ? ' on' : ''}`} src="/images/edmund-peek-left.webp" alt="" width={492} height={625} decoding="async" />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  )
}
