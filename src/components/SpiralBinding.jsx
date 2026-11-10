import React from 'react'

export default function SpiralBinding() {
  // 16 anillos metálicos de encuadernación central para vista de libro abierto (Tablet / Desktop)
  const rings = Array.from({ length: 16 })

  return (
    <div className="hidden lg:flex flex-col justify-between items-center py-8 px-1 w-10 z-40 select-none pointer-events-none relative">
      {/* Sombra profunda de pliegue entre las dos hojas */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-[#8e7f6d]/35 via-[#3e332a]/40 to-[#8e7f6d]/35 blur-[2px]" />

      {rings.map((_, idx) => (
        <div key={idx} className="relative flex items-center justify-center w-full h-5">
          {/* Perforación izquierda en el papel */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#322721] shadow-inner -mr-1.5 z-10 border border-[#C8BCAE]/60" />

          {/* Alambre metálico doble con brillo especular */}
          <div className="w-9 h-2.5 rounded-full bg-gradient-to-b from-[#e6e1da] via-[#9b9288] to-[#4a433d] shadow-[0_2px_4px_rgba(0,0,0,0.45)] border-t border-white/60 z-20 -rotate-3" />

          {/* Perforación derecha en el papel */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#322721] shadow-inner -ml-1.5 z-10 border border-[#C8BCAE]/60" />
        </div>
      ))}
    </div>
  )
}
