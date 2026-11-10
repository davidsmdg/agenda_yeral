import React from 'react'
import { getStroke } from 'perfect-freehand'

// Convierte los puntos de perfect-freehand en un path SVG suave como pluma real
function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

export default function FreehandCanvas({
  active,
  penColor,
  penSize,
  isHighlighter,
  strokes,
  setStrokes,
}) {
  const [currentPoints, setCurrentPoints] = React.useState([])
  const svgRef = React.useRef(null)

  function handlePointerDown(e) {
    if (!active) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pressure = e.pressure || 0.5
    setCurrentPoints([[x, y, pressure]])
  }

  function handlePointerMove(e) {
    if (!active || e.buttons !== 1) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pressure = e.pressure || 0.5
    setCurrentPoints((prev) => [...prev, [x, y, pressure]])
  }

  function handlePointerUp() {
    if (!active || currentPoints.length === 0) return
    setStrokes((prev) => [
      ...prev,
      {
        points: currentPoints,
        color: penColor,
        size: isHighlighter ? 18 : penSize,
        opacity: isHighlighter ? 0.35 : 0.92,
      },
    ])
    setCurrentPoints([])
  }

  const getPath = (points, size) => {
    const outlinePoints = getStroke(points, {
      size,
      thinning: isHighlighter ? 0.1 : 0.55,
      smoothing: 0.6,
      streamline: 0.5,
      simulatePressure: true,
    })
    return getSvgPathFromStroke(outlinePoints)
  }

  return (
    <svg
      ref={svgRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 w-full h-full z-30 ${
        active ? 'cursor-crosshair touch-none pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {strokes.map((stroke, idx) => (
        <path
          key={idx}
          d={getPath(stroke.points, stroke.size)}
          fill={stroke.color}
          opacity={stroke.opacity}
          style={{ mixBlendMode: stroke.opacity < 0.5 ? 'multiply' : 'normal' }}
        />
      ))}
      {currentPoints.length > 0 && (
        <path
          d={getPath(currentPoints, isHighlighter ? 18 : penSize)}
          fill={penColor}
          opacity={isHighlighter ? 0.35 : 0.92}
          style={{ mixBlendMode: isHighlighter ? 'multiply' : 'normal' }}
        />
      )}
    </svg>
  )
}
