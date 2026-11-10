import React, { useEffect, useRef } from 'react'
import rough from 'roughjs'

/**
 * Dibuja un rectángulo o círculo estilo boceto hecho a mano con lápiz/tinta usando Rough.js
 */
export default function RoughBox({
  children,
  className = '',
  stroke = '#9A8B7A',
  fill = 'transparent',
  fillStyle = 'hachure',
  roughness = 1.4,
  bowing = 1.2,
  shape = 'rectangle',
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    const draw = () => {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild)
      }
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return

      const rc = rough.svg(svg)
      let node
      if (shape === 'ellipse') {
        node = rc.ellipse(width / 2, height / 2, width - 8, height - 8, {
          stroke,
          strokeWidth: 1.4,
          roughness,
          bowing,
          fill: fill !== 'transparent' ? fill : undefined,
          fillStyle,
        })
      } else {
        node = rc.rectangle(3, 3, Math.max(width - 6, 10), Math.max(height - 6, 10), {
          stroke,
          strokeWidth: 1.35,
          roughness,
          bowing,
          fill: fill !== 'transparent' ? fill : undefined,
          fillStyle,
          fillWeight: 0.7,
        })
      }
      svg.appendChild(node)
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(container)
    return () => observer.disconnect()
  }, [stroke, fill, fillStyle, roughness, bowing, shape])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
