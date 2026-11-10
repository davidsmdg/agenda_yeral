import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  Calendar,
  RefreshCw,
  Mail,
  Send,
  Palette,
  Sticker,
  Clock,
  CheckCircle2,
  Bookmark,
} from 'lucide-react'

export const COVER_THEMES = [
  {
    id: 'espresso',
    name: 'Cuero Espresso',
    bg: 'from-[#4A352B] via-[#3A2820] to-[#2B1D17]',
    spine: 'from-[#2A1B15] via-[#3E2B22] to-[#231611]',
    border: '#6A4E40',
    stitch: '#A68A78',
    band: '#8C2D2D',
  },
  {
    id: 'rose',
    name: 'Rosa Empolvado',
    bg: 'from-[#C88EA7] via-[#B57B95] to-[#99627A]',
    spine: 'from-[#7E4D63] via-[#99627A] to-[#6D4155]',
    border: '#DFB2C6',
    stitch: '#F5DCE7',
    band: '#5E3A4B',
  },
  {
    id: 'sage',
    name: 'Verde Salvia',
    bg: 'from-[#6B8E78] via-[#567763] to-[#435F4E]',
    spine: 'from-[#354D3E] via-[#496654] to-[#2C4034]',
    border: '#8FB39C',
    stitch: '#D1E3D7',
    band: '#D4A373',
  },
  {
    id: 'midnight',
    name: 'Azul Noche',
    bg: 'from-[#2C3E55] via-[#1F2D3D] to-[#15202B]',
    spine: 'from-[#101820] via-[#1E2C3B] to-[#0E151C]',
    border: '#486180',
    stitch: '#98AFC7',
    band: '#C99E52',
  },
]

const COVER_STICKERS = [
  { id: 'coffee', emoji: '☕', label: 'Coffee First' },
  { id: 'star', emoji: '✨', label: 'Brilla Hoy' },
  { id: 'flower', emoji: '🌸', label: 'Bloom' },
  { id: 'heart', emoji: '💌', label: 'Notas' },
]

export default function ClosedCoverDesk({
  coverTheme,
  setCoverTheme,
  ownerName,
  setOwnerName,
  coverSubtitle,
  setCoverSubtitle,
  placedStickers,
  setPlacedStickers,
  currentDay,
  months,
  onOpenBook,
  onQuickAddNote,
  gmailConnected,
  outlookConnected,
  onSimulateSync,
  syncingProvider,
}) {
  const [quickNoteText, setQuickNoteText] = useState('')
  const [quickHour, setQuickHour] = useState('12:00')
  const [quickSavedToast, setQuickSavedToast] = useState(false)
  const [unclasping, setUnclasping] = useState(false)

  const theme = COVER_THEMES.find((t) => t.id === coverTheme) || COVER_THEMES[0]

  const handleTriggerOpen = (targetDayCursor = 0, targetMonthIdx = null) => {
    setUnclasping(true)
    onOpenBook(targetDayCursor, targetMonthIdx)
  }

  const handleToggleSticker = (sticker) => {
    setPlacedStickers((prev) => {
      const exists = prev.find((s) => s.id === sticker.id)
      if (exists) return prev.filter((s) => s.id !== sticker.id)
      return [
        ...prev,
        {
          ...sticker,
          x: 24 + ((prev.length * 65) % 180),
          y: 340 + ((prev.length * 35) % 90),
          rotate: (prev.length % 2 === 0 ? -6 : 7),
        },
      ]
    })
  }

  const handleSendQuickNote = (e) => {
    e.preventDefault()
    if (!quickNoteText.trim()) return
    onQuickAddNote(quickHour, quickNoteText.trim())
    setQuickNoteText('')
    setQuickSavedToast(true)
    setTimeout(() => setQuickSavedToast(false), 2200)
  }

  const scheduleEntries = Object.entries(currentDay.schedule || {})
  const pendingPriorities = (currentDay.priorities || []).filter((p) => !p.done)

  return (
    <div className="w-full max-w-[1320px] flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-2 px-2 sm:px-4">
      {/* =====================================================================
          COLUMNA IZQUIERDA / CENTRAL (7 cols): LA AGENDA CERRADA EN 3D SOBRE LA MESA
         ===================================================================== */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-4">
        {/* Café decorativo y bolígrafo sobre el escritorio */}
        <div className="hidden sm:flex items-center gap-2 mb-3 text-xs text-[#D8CFC2]/80 bg-[#382d27]/80 px-3.5 py-1.5 rounded-full border border-[#5c493f]">
          <Sparkles className="w-3.5 h-3.5 text-[#FCE1A8]" />
          <span>Toca la portada de cuero o la banda elástica para abrir tu agenda</span>
        </div>

        <div className="book-perspective relative flex items-center justify-center">
          {/* CONTENEDOR DEL LIBRO CERRADO */}
          <motion.div
            whileHover={{ scale: 1.015, rotateY: -6, rotateX: 2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            onClick={() => handleTriggerOpen(0)}
            className="relative w-[330px] sm:w-[410px] h-[490px] sm:h-[580px] cursor-pointer select-none group preserve-3d"
          >
            {/* SOMBRA PROFUNDA DEL LIBRO SOBRE LA MADERA DEL ESCRITORIO */}
            <div className="absolute -bottom-6 -left-4 right-2 h-12 bg-black/65 blur-xl rounded-full pointer-events-none" />

            {/* BLOQUE DE HOJAS DE PAPEL CREMA QUE SE VEN EN EL CANTO DERECHO E INFERIOR */}
            <div
              className="absolute top-2 bottom-2 -right-4 w-7 rounded-r-md border-y border-r border-[#C8BCAE] shadow-inner"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, #FAF6EE 0px, #FAF6EE 2px, #DFD6C7 2px, #DFD6C7 3px)',
              }}
            />

            {/* PESTAÑAS DE COLORES DE LOS 12 MESES QUE SOBRESALEN AÚN CON LA AGENDA CERRADA */}
            <div className="absolute top-6 bottom-6 -right-8 flex flex-col justify-between py-2 z-0">
              {months.map((m, idx) => (
                <button
                  key={m.short}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTriggerOpen(0, idx)
                  }}
                  style={{ backgroundColor: m.color }}
                  className="w-7 py-1 rounded-r-md border border-l-0 border-[#B8AA99] text-[9px] font-serif font-bold text-[#3A2E25] shadow hover:w-9 hover:translate-x-1 transition-all"
                  title={`Abrir directamente en ${m.name}`}
                >
                  {m.short}
                </button>
              ))}
            </div>

            {/* CINTA SEPARADORA ROJA QUE ASOMA POR DEBAJO DE LA AGENDA CERRADA */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-6 w-5 h-9 bg-gradient-to-b from-[#9E2A2B] to-[#6E1A1B] shadow-md clip-ribbon z-0 rounded-b-sm" />

            {/* TAPA DURA DE CUERO PRINCIPAL */}
            <div
              className={`relative w-full h-full rounded-r-[24px] rounded-l-[10px] bg-gradient-to-br ${theme.bg} shadow-[0_24px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.28)] border flex overflow-hidden z-10`}
              style={{ borderColor: theme.border }}
            >
              {/* Lomo izquierdo con relieve y anillos metálicos asomando */}
              <div
                className={`w-11 sm:w-13 h-full bg-gradient-to-r ${theme.spine} border-r border-black/40 flex flex-col justify-between py-7 items-center relative shadow-xl`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-2 rounded-full bg-gradient-to-b from-[#e8e3dc] via-[#9e9489] to-[#453e38] shadow-md -ml-3 border-t border-white/50"
                  />
                ))}
              </div>

              {/* Superficie frontal de cuero con costura perimetral */}
              <div className="flex-1 p-5 sm:p-7 relative flex flex-col justify-between">
                {/* Costura pespunteada alrededor de la tapa */}
                <div
                  className="absolute inset-3 rounded-r-[18px] rounded-l-[4px] border border-dashed opacity-55 pointer-events-none"
                  style={{ borderColor: theme.stitch }}
                />

                {/* Esquinas metálicas doradas protectoras */}
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-[#F3E5AB] via-[#D4AF37] to-[#8A640F] rounded-bl-xl shadow-md pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-tl from-[#F3E5AB] via-[#D4AF37] to-[#8A640F] rounded-tl-xl shadow-md pointer-events-none" />

                {/* Sello superior de año */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.35em] gold-foil-text font-semibold">
                    Edición Papel • 2026
                  </span>
                  <Bookmark className="w-4 h-4 text-[#F3E5AB]/70" />
                </div>

                {/* MARCO CENTRAL GRABADO EN ORO (GOLD FOIL EMBOSS) */}
                <div className="my-auto mx-2 p-6 sm:p-7 rounded-2xl border double border-[#D4AF37]/65 gold-foil-border bg-black/15 backdrop-blur-[1px] text-center relative">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#F3E5AB]/80 mb-2 font-serif">
                    Personal Planner & Journal
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold gold-foil-text tracking-wide leading-tight break-words">
                    {ownerName || 'Agenda de Yerald'}
                  </h2>
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-3" />
                  <p className="font-hand text-xl sm:text-2xl text-[#FAF6EE]/90">
                    {coverSubtitle || 'Organización diaria, notas & sueños'}
                  </p>
                </div>

                {/* Stickers decorativos pegados en la portada */}
                {placedStickers.map((st) => (
                  <motion.div
                    key={st.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: st.rotate }}
                    style={{ left: st.x, top: st.y }}
                    className="absolute px-2.5 py-1 rounded-xl bg-[#FAF6EE] shadow-lg border-2 border-white flex items-center gap-1.5 z-20"
                  >
                    <span className="text-lg">{st.emoji}</span>
                    <span className="font-hand text-sm font-bold text-[#2B2D42]">
                      {st.label}
                    </span>
                  </motion.div>
                ))}

                {/* Pie de portada con botón de llamada a la acción */}
                <div className="mb-2 flex items-center justify-between text-xs text-[#FAF6EE]/80">
                  <span className="font-serif italic">Gmail & Outlook Ready</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-[#FFF3B0] font-medium group-hover:bg-white/25 transition">
                    <BookOpen className="w-3.5 h-3.5" /> Abrir Agenda →
                  </span>
                </div>
              </div>

              {/* BANDA ELÁSTICA VERTICAL QUE CIERRA LA AGENDA */}
              <motion.div
                animate={
                  unclasping
                    ? { x: 90, opacity: 0 }
                    : { x: 0, opacity: 1 }
                }
                transition={{ duration: 0.32 }}
                style={{ backgroundColor: theme.band }}
                className="absolute top-0 bottom-0 right-7 sm:right-9 w-5 sm:w-6 shadow-[0_0_12px_rgba(0,0,0,0.6),inset_0_0_4px_rgba(255,255,255,0.2)] z-30 border-x border-black/25 flex items-center justify-center"
              >
                {/* Hebilla metálica en la banda elástica */}
                <div className="w-full h-8 bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#9A7418] border-y border-black/40 shadow-sm flex items-center justify-center">
                  <span className="text-[8px] font-serif font-bold text-[#2B1D17] tracking-tighter">
                    2026
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================================
          COLUMNA DERECHA (5 cols): OPCIONES DEL USUARIO MIENTRAS ESTÁ CERRADA
         ===================================================================== */}
      <div className="lg:col-span-5 flex flex-col gap-4 z-20">
        {/* TARJETA 1: VISTAZO RÁPIDO AL DÍA DE HOY + ANOTE RÁPIDO SIN ABRIR LA AGENDA */}
        <div className="paper-sheet-right rounded-2xl p-4 sm:p-5 border border-[#D8CFC2] shadow-xl relative overflow-hidden">
          <div className="washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-5 rotate-1" />

          <div className="flex items-center justify-between border-b border-[#DFD6C7] pb-2.5 mt-1">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A7968] font-bold block">
                Resumen sobre el escritorio
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2B2D42]">
                Hoy: {currentDay.dayName} {currentDay.dayNumber}
              </h3>
            </div>
            <button
              onClick={() => handleTriggerOpen(0)}
              className="px-3.5 py-1.5 rounded-xl bg-[#2B2D42] hover:bg-[#1D3557] text-[#FAF6EE] text-xs font-semibold flex items-center gap-1.5 shadow transition"
            >
              <BookOpen className="w-3.5 h-3.5" /> Abrir en Hoy
            </button>
          </div>

          {/* Próximas citas del día visibles desde afuera */}
          <div className="my-3 space-y-1.5">
            <div className="text-xs font-serif font-semibold text-[#6E5E4E] flex items-center justify-between">
              <span>Próximos horarios agendados ({scheduleEntries.length}):</span>
              <span>{pendingPriorities.length} prioridades</span>
            </div>

            <div className="max-h-28 overflow-y-auto pr-1 space-y-1">
              {scheduleEntries.slice(0, 3).map(([hour, item]) => (
                <div
                  key={hour}
                  className="flex items-center justify-between text-xs bg-[#F3ECE0] px-2.5 py-1.5 rounded-lg border border-[#E2D8C8]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-serif font-bold text-[#7A6A58]">{hour}</span>
                    <span className="font-hand text-lg text-[#2B2D42] truncate">
                      {item.text}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/80 text-[#5C4B3B] border border-[#D8CFC2]">
                    {item.source}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anote rápido desde afuera que se guarda directo en la hoja del día */}
          <form
            onSubmit={handleSendQuickNote}
            className="pt-2.5 border-t border-dashed border-[#C8BCAE]"
          >
            <label className="block text-[11px] font-semibold text-[#6E5E4E] mb-1.5">
              ✍️ Agendar rápido sin abrir la libreta:
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={quickHour}
                onChange={(e) => setQuickHour(e.target.value)}
                className="bg-[#EFE8DA] border border-[#C8BCAE] rounded-lg px-2 py-1.5 text-xs font-serif font-bold text-[#2B2D42] focus:outline-none"
              >
                {[
                  '07:00',
                  '08:00',
                  '09:00',
                  '10:00',
                  '11:00',
                  '12:00',
                  '13:00',
                  '14:00',
                  '15:00',
                  '16:00',
                  '17:00',
                  '18:00',
                  '19:00',
                  '20:00',
                ].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Ej. Llamar al doctor..."
                className="flex-1 bg-[#FAF6EE] border border-[#C8BCAE] rounded-lg px-2.5 py-1 font-hand text-lg text-[#1D3557] focus:outline-none focus:border-[#2B2D42]"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#B5838D] hover:bg-[#99627A] text-white shadow-sm transition"
                title="Enviar directo a la hoja de hoy"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {quickSavedToast && (
              <p className="text-[11px] text-[#386641] font-medium mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Anotado en el renglón de las {quickHour}!
              </p>
            )}
          </form>
        </div>

        {/* TARJETA 2: PERSONALIZADOR DE LA PORTADA (CUERO, GRABADO DORADO Y STICKERS) */}
        <div className="bg-[#382d27]/95 backdrop-blur-md border border-[#5c493f] rounded-2xl p-4 sm:p-5 text-[#F5EBE0] shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-[#FCE1A8]" />
            <h4 className="font-serif font-bold text-base tracking-wide">
              Personalizar Portada de la Agenda
            </h4>
          </div>

          {/* Selector de color de cuero */}
          <div className="mb-3">
            <span className="text-[11px] text-[#C8BCAE] block mb-1.5">
              Color del forro de cuero:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COVER_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCoverTheme(t.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition ${
                    coverTheme === t.id
                      ? 'bg-white/15 border-[#FCE1A8] text-white font-semibold shadow'
                      : 'bg-[#28201c] border-[#524139] text-[#C8BCAE] hover:text-white'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${t.bg} border border-white/40 shrink-0`}
                  />
                  <span className="truncate">{t.name.replace('Cuero ', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Texto grabado en oro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className="text-[11px] text-[#C8BCAE] block mb-1">
                Título grabado en oro:
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#28201c] border border-[#5c493f] rounded-lg px-2.5 py-1.5 text-xs text-[#FAF6EE] focus:outline-none focus:border-[#FCE1A8]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#C8BCAE] block mb-1">
                Subtítulo manuscrito:
              </label>
              <input
                type="text"
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
                className="w-full bg-[#28201c] border border-[#5c493f] rounded-lg px-2.5 py-1.5 text-xs text-[#FAF6EE] focus:outline-none focus:border-[#FCE1A8]"
              />
            </div>
          </div>

          {/* Stickers para pegar en la tapa */}
          <div>
            <span className="text-[11px] text-[#C8BCAE] flex items-center gap-1 mb-1.5">
              <Sticker className="w-3.5 h-3.5 text-[#E5989B]" /> Pegar stickers en la portada:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COVER_STICKERS.map((st) => {
                const isActive = placedStickers.some((s) => s.id === st.id)
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleToggleSticker(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 border transition ${
                      isActive
                        ? 'bg-[#FAF6EE] text-[#2B2D42] border-white font-semibold'
                        : 'bg-[#28201c] text-[#D8CFC2] border-[#524139] hover:border-[#8C705F]'
                    }`}
                  >
                    <span>{st.emoji}</span>
                    <span>{st.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* TARJETA 3: SINCRONIZAR CUENTAS ANTES DE ABRIR */}
        <div className="bg-[#382d27]/90 border border-[#5c493f] rounded-2xl p-3.5 flex items-center justify-between gap-2 text-xs text-[#F5EBE0]">
          <span className="text-[#C8BCAE]">Actualizar calendarios:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSimulateSync('gmail')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCE8E6] text-[#8C1D18] font-medium hover:scale-[1.02] transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#EA4335] ${
                  syncingProvider === 'gmail' ? 'animate-spin' : ''
                }`}
              />
              Gmail
            </button>
            <button
              onClick={() => onSimulateSync('outlook')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E3F2FD] text-[#0B57D0] font-medium hover:scale-[1.02] transition"
            >
              <Mail className="w-3.5 h-3.5 text-[#0078D4]" />
              Outlook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
