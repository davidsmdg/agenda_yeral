import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  PenTool,
  Highlighter,
  Eraser,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Trash2,
  StickyNote,
  BookOpen,
  BookMarked,
  Mail,
} from 'lucide-react'
import SpiralBinding from './components/SpiralBinding'
import FreehandCanvas from './components/FreehandCanvas'
import RoughBox from './components/RoughBox'
import ClosedCoverDesk, { COVER_THEMES } from './components/ClosedCoverDesk'

const MONTHS = [
  { short: 'ENE', name: 'Enero', color: '#E8D5C4' },
  { short: 'FEB', name: 'Febrero', color: '#F4C2C2' },
  { short: 'MAR', name: 'Marzo', color: '#D4E2D4' },
  { short: 'ABR', name: 'Abril', color: '#FCE1A8' },
  { short: 'MAY', name: 'Mayo', color: '#D6E4F0' },
  { short: 'JUN', name: 'Junio', color: '#E5D4EF' },
  { short: 'JUL', name: 'Julio', color: '#F7D1BA' },
  { short: 'AGO', name: 'Agosto', color: '#CDEAC0' },
  { short: 'SEP', name: 'Septiembre', color: '#F3D1DC' },
  { short: 'OCT', name: 'Octubre', color: '#E2CFC4' },
  { short: 'NOV', name: 'Noviembre', color: '#D9E4DD' },
  { short: 'DIC', name: 'Diciembre', color: '#E8C5C5' },
]

const HOURS = [
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
]

const INITIAL_DAYS = {
  0: {
    dayName: 'Jueves',
    dayNumber: '22',
    monthIndex: 9, // Octubre
    year: '2026',
    quote: '“Un día bien organizado en papel es paz mental para todo el día.”',
    schedule: {
      '08:00': {
        text: 'Café + Revisar correos pendientes',
        source: 'personal',
        completed: true,
      },
      '10:00': {
        text: 'Reunión de seguimiento mensual (Google Meet)',
        source: 'gmail',
        completed: false,
      },
      '13:00': {
        text: 'Almuerzo libre & descanso',
        source: 'personal',
        completed: false,
      },
      '16:00': {
        text: 'Presentación de avances en equipo',
        source: 'outlook',
        completed: false,
      },
      '19:00': {
        text: 'Clase de Pilates / Ejercicio',
        source: 'personal',
        completed: false,
      },
    },
    priorities: [
      { id: 1, text: 'Confirmar citas de la próxima semana', done: true },
      { id: 2, text: 'Enviar reporte desde Outlook', done: false },
      { id: 3, text: 'Separar espacio para lectura 30 min', done: false },
    ],
    stickyNotes: [
      {
        id: 'st-1',
        title: 'Recordatorio ✨',
        content: '¡Puedes tocar cualquier hora para escribir o activar el Lápiz arriba para rayar la hoja!',
        color: '#FFF3B0',
        rotate: -2,
        x: 12,
        y: 8,
      },
      {
        id: 'st-2',
        title: 'Ideas & Compras',
        content: '• Comprar separadores\n• Llamar a mamá el viernes',
        color: '#FFD6E0',
        rotate: 2.2,
        x: 215,
        y: 24,
      },
    ],
    freeNote:
      'Apuntes libres del día:\n- Conectar cuenta Gmail personal para cumpleaños y recordatorios.\n- Conectar cuenta Outlook para reuniones del trabajo.',
  },
  1: {
    dayName: 'Viernes',
    dayNumber: '23',
    monthIndex: 9,
    year: '2026',
    quote: '“Pequeños hábitos diarios crean grandes resultados.”',
    schedule: {
      '09:00': {
        text: 'Sincronización semanal (Outlook Calendar)',
        source: 'outlook',
        completed: false,
      },
      '11:00': {
        text: 'Cita médica control general',
        source: 'gmail',
        completed: false,
      },
      '17:00': {
        text: 'Cena con amigos 🎉',
        source: 'personal',
        completed: false,
      },
    },
    priorities: [
      { id: 1, text: 'Cerrar pendientes de la semana', done: false },
      { id: 2, text: 'Planificar fin de semana', done: false },
    ],
    stickyNotes: [
      {
        id: 'st-3',
        title: 'Fin de semana 🌿',
        content: 'Llevar el iPad cargado y desconectar notificaciones a las 6pm.',
        color: '#D8F3DC',
        rotate: -1.5,
        x: 28,
        y: 16,
      },
    ],
    freeNote: 'Notas del viernes:\nEspacio en blanco listo para tus ideas...',
  },
}

const SOURCE_BADGES = {
  personal: {
    label: 'Papel',
    bg: 'bg-[#EDE3D2]',
    text: 'text-[#5C4B3B]',
    border: 'border-[#C8B8A2]',
    dot: 'bg-[#8A7256]',
    inkText: 'text-[#2B2D42]',
  },
  gmail: {
    label: 'Gmail',
    bg: 'bg-[#FCE8E6]',
    text: 'text-[#B3261E]',
    border: 'border-[#F2B8B5]',
    dot: 'bg-[#EA4335]',
    inkText: 'text-[#8C1D18]',
  },
  outlook: {
    label: 'Outlook',
    bg: 'bg-[#E3F2FD]',
    text: 'text-[#0B57D0]',
    border: 'border-[#A8C7FA]',
    dot: 'bg-[#0078D4]',
    inkText: 'text-[#1D3557]',
  },
}

export default function App() {
  // EMPIEZA EN LA PORTADA CERRADA ('closed' | 'opening' | 'open')
  const [bookState, setBookState] = useState('closed')

  // Personalización de la portada cerrada
  const [coverTheme, setCoverTheme] = useState('espresso')
  const [ownerName, setOwnerName] = useState('Agenda de Yerald')
  const [coverSubtitle, setCoverSubtitle] = useState('Organización diaria, notas & sueños')
  const [placedStickers, setPlacedStickers] = useState([
    { id: 'star', emoji: '✨', label: 'Brilla Hoy', x: 26, y: 365, rotate: -6 },
  ])

  const [dayCursor, setDayCursor] = useState(0)
  const [daysData, setDaysData] = useState(INITIAL_DAYS)

  // Estado del giro físico 3D de una hoja real sobre la espiral central
  // null | { dir: 1 | -1, fromDay: object, toDay: object }
  const [turningLeaf, setTurningLeaf] = useState(null)

  // En móvil/vertical permite alternar entre Página Izquierda (Horarios) y Derecha (Notas)
  const [mobileTab, setMobileTab] = useState('schedule')

  // Estado de edición de un bloque horario
  const [editingHour, setEditingHour] = useState(null)
  const [draftText, setDraftText] = useState('')
  const [draftSource, setDraftSource] = useState('personal')

  // Estado de conexiones simuladas (Gmail / Outlook)
  const [gmailConnected, setGmailConnected] = useState(true)
  const [outlookConnected, setOutlookConnected] = useState(true)
  const [syncingProvider, setSyncingProvider] = useState(null)

  // Estado de dibujo libre con Apple Pencil / Dedo / Mouse
  const [penMode, setPenMode] = useState(false)
  const [isHighlighter, setIsHighlighter] = useState(false)
  const [penColor, setPenColor] = useState('#1D3557')
  const [strokesByDay, setStrokesByDay] = useState({ 0: [], 1: [] })

  // Nueva prioridad
  const [newPriorityText, setNewPriorityText] = useState('')

  const ensureDayExists = (cursor, fallbackMonthIndex = 9) => {
    if (daysData[cursor]) return daysData[cursor]
    const baseDate = 22 + cursor
    const dayNames = ['Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles']
    const dayName = dayNames[((cursor % 7) + 7) % 7]
    const generated = {
      dayName,
      dayNumber: String(
        baseDate > 31 ? baseDate - 31 : baseDate < 1 ? 30 + baseDate : baseDate
      ).padStart(2, '0'),
      monthIndex: fallbackMonthIndex,
      year: '2026',
      quote: '“Hoja nueva en blanco: diseña tu día a tu propio ritmo.”',
      schedule: {},
      priorities: [{ id: Date.now(), text: 'Objetivo principal del día', done: false }],
      stickyNotes: [
        {
          id: `st-${Date.now()}`,
          title: 'Nota rápida 📌',
          content: 'Arrástrame a cualquier lugar de la hoja...',
          color: '#FFF3B0',
          rotate: -1.8,
          x: 24,
          y: 18,
        },
      ],
      freeNote: '',
    }
    setDaysData((prev) => ({ ...prev, [cursor]: generated }))
    return generated
  }

  const currentDay = daysData[dayCursor] || daysData[0]
  const currentMonth = MONTHS[currentDay.monthIndex]
  const currentStrokes = strokesByDay[dayCursor] || []
  const activeCoverTheme =
    COVER_THEMES.find((t) => t.id === coverTheme) || COVER_THEMES[0]

  const updateCurrentStrokes = (updater) => {
    setStrokesByDay((prev) => {
      const current = prev[dayCursor] || []
      const next = typeof updater === 'function' ? updater(current) : updater
      return { ...prev, [dayCursor]: next }
    })
  }

  // SECUENCIA CINEMATOGRÁFICA: Abrir la portada 180° y hojear hasta la página elegida
  const handleOpenBookFromCover = (targetCursor = 0, targetMonthIdx = null) => {
    if (targetMonthIdx !== null) {
      setDaysData((prev) => ({
        ...prev,
        [targetCursor]: {
          ...(prev[targetCursor] || prev[0]),
          monthIndex: targetMonthIdx,
        },
      }))
    }
    setDayCursor(targetCursor)
    setBookState('opening')
    setTimeout(() => {
      setBookState('open')
    }, 1050)
  }

  // Agendar rápido desde el escritorio cuando la agenda está cerrada
  const handleQuickAddFromDesk = (hour, text) => {
    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        schedule: {
          ...prev[dayCursor].schedule,
          [hour]: {
            text,
            source: 'personal',
            completed: false,
          },
        },
      },
    }))
  }

  // GIRO FÍSICO 3D DE HOJA DE PAPEL SOBRE LA ESPIRAL CENTRAL
  const handleTurnPage = (dir) => {
    if (turningLeaf) return // evitar doble giro simultáneo
    const nextCursor = dayCursor + dir
    const fromDayObj = currentDay
    const toDayObj = ensureDayExists(nextCursor, currentDay.monthIndex)

    setEditingHour(null)
    setTurningLeaf({
      dir,
      fromDay: fromDayObj,
      toDay: toDayObj,
      nextCursor,
    })

    // A mitad del giro actualizamos los datos base y al terminar desmontamos la hoja volante
    setTimeout(() => {
      setDayCursor(nextCursor)
    }, 340)

    setTimeout(() => {
      setTurningLeaf(null)
    }, 680)
  }

  // Cambiar de mes en las pestañas laterales con efecto de giro de página
  const handleSelectMonth = (monthIdx) => {
    if (monthIdx === currentDay.monthIndex) return
    const dir = monthIdx > currentDay.monthIndex ? 1 : -1
    const fromDayObj = currentDay
    const updatedDay = {
      ...currentDay,
      monthIndex: monthIdx,
    }
    setTurningLeaf({
      dir,
      fromDay: fromDayObj,
      toDay: updatedDay,
      nextCursor: dayCursor,
    })
    setTimeout(() => {
      setDaysData((prev) => ({
        ...prev,
        [dayCursor]: updatedDay,
      }))
    }, 320)
    setTimeout(() => {
      setTurningLeaf(null)
    }, 660)
  }

  // Abrir editor de una hora en la agenda
  const handleOpenHour = (hour) => {
    if (penMode || turningLeaf) return
    const existing = currentDay.schedule[hour]
    setEditingHour(hour)
    setDraftText(existing ? existing.text : '')
    setDraftSource(existing ? existing.source : 'personal')
  }

  // Guardar cita en el renglón de esa hora
  const handleSaveHour = (hour) => {
    setDaysData((prev) => {
      const updatedSchedule = { ...prev[dayCursor].schedule }
      if (!draftText.trim()) {
        delete updatedSchedule[hour]
      } else {
        updatedSchedule[hour] = {
          text: draftText.trim(),
          source: draftSource,
          completed: updatedSchedule[hour]?.completed || false,
        }
      }
      return {
        ...prev,
        [dayCursor]: {
          ...prev[dayCursor],
          schedule: updatedSchedule,
        },
      }
    })
    setEditingHour(null)
  }

  // Tachar/destachar una hora con animación de tinta
  const handleToggleCompleteHour = (e, hour) => {
    e.stopPropagation()
    if (penMode) return
    const item = currentDay.schedule[hour]
    if (!item) return

    const willComplete = !item.completed
    if (willComplete) {
      confetti({
        particleCount: 22,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#D4A373', '#E5989B', '#A3B18A'],
      })
    }

    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        schedule: {
          ...prev[dayCursor].schedule,
          [hour]: {
            ...item,
            completed: willComplete,
          },
        },
      },
    }))
  }

  // Simular sincronización en vivo con Google Calendar o Outlook
  const handleSimulateSync = (provider) => {
    setSyncingProvider(provider)
    setTimeout(() => {
      setDaysData((prev) => {
        const day = prev[dayCursor]
        const nextSchedule = { ...day.schedule }
        if (provider === 'gmail') {
          setGmailConnected(true)
          nextSchedule['11:00'] = {
            text: 'Recordatorio Gmail: Revisión de pendientes & pagos',
            source: 'gmail',
            completed: false,
          }
          nextSchedule['18:00'] = {
            text: 'Evento Google Calendar: Café con amigas ☕',
            source: 'gmail',
            completed: false,
          }
        } else if (provider === 'outlook') {
          setOutlookConnected(true)
          nextSchedule['09:00'] = {
            text: 'Outlook: Daily Check-in de equipo (Teams)',
            source: 'outlook',
            completed: false,
          }
          nextSchedule['15:00'] = {
            text: 'Outlook: Entrega de propuesta mensual',
            source: 'outlook',
            completed: false,
          }
        }
        return {
          ...prev,
          [dayCursor]: {
            ...day,
            schedule: nextSchedule,
          },
        }
      })
      setSyncingProvider(null)
    }, 650)
  }

  // Prioridades (Checklist con trazo a mano)
  const togglePriority = (id) => {
    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        priorities: prev[dayCursor].priorities.map((p) =>
          p.id === id ? { ...p, done: !p.done } : p
        ),
      },
    }))
  }

  const addPriority = (e) => {
    e.preventDefault()
    if (!newPriorityText.trim()) return
    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        priorities: [
          ...prev[dayCursor].priorities,
          { id: Date.now(), text: newPriorityText.trim(), done: false },
        ],
      },
    }))
    setNewPriorityText('')
  }

  // Agregar nuevo Post-it arrastrable
  const addStickyNote = () => {
    const palette = ['#FFF3B0', '#FFD6E0', '#D8F3DC', '#E0FBFC', '#F3D5B5']
    const randomColor = palette[Math.floor(Math.random() * palette.length)]
    const randomRotate = (Math.random() * 5 - 2.5).toFixed(1)

    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        stickyNotes: [
          ...prev[dayCursor].stickyNotes,
          {
            id: `st-${Date.now()}`,
            title: 'Post-it nuevo ✨',
            content: 'Escribe aquí tu nota adhesiva...',
            color: randomColor,
            rotate: Number(randomRotate),
            x: 30 + ((prev[dayCursor].stickyNotes.length * 25) % 160),
            y: 15 + ((prev[dayCursor].stickyNotes.length * 20) % 70),
          },
        ],
      },
    }))
  }

  const updateStickyText = (id, content) => {
    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        stickyNotes: prev[dayCursor].stickyNotes.map((s) =>
          s.id === id ? { ...s, content } : s
        ),
      },
    }))
  }

  const removeStickyNote = (id) => {
    setDaysData((prev) => ({
      ...prev,
      [dayCursor]: {
        ...prev[dayCursor],
        stickyNotes: prev[dayCursor].stickyNotes.filter((s) => s.id !== id),
      },
    }))
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between py-3 px-2 sm:px-5 lg:px-8 select-none overflow-x-hidden">
      {/* Filtro SVG global invisible para darle grano de papel real */}
      <svg className="hidden">
        <filter id="paper-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.045 0"
          />
        </filter>
      </svg>

      {/* BARRA SUPERIOR TIPO ESTUCHE DE ESCRITORIO */}
      <header className="w-full max-w-[1320px] mb-2 z-50">
        <div className="bg-[#382d27]/95 backdrop-blur-md border border-[#5c493f] rounded-2xl px-3.5 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2 text-[#F5EBE0]">
          {/* Marca & Estado de la Agenda */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5989B] to-[#B5838D] flex items-center justify-center shadow-inner text-[#261e1b] font-serif font-bold text-xl">
              Y
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FAF6EE]">
                  {ownerName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-[#524139] text-[#E6CCB2] px-2 py-0.5 rounded-full border border-[#6f594e]">
                  <Sparkles className="w-3 h-3 text-[#FCE1A8]" />{' '}
                  {bookState === 'closed' ? 'Modo Escritorio (Cerrada)' : 'Agenda Abierta'}
                </span>
              </div>
              <p className="text-[11px] text-[#C8BCAE] hidden sm:block">
                {bookState === 'closed'
                  ? 'Personaliza tu portada, anota algo rápido o abre la agenda para ir a tu hoja'
                  : 'Pasa las páginas desde las esquinas • Toca una hora para escribir o usa la Pluma'}
              </p>
            </div>
          </div>

          {/* Controles derechos */}
          <div className="flex items-center gap-2 flex-wrap">
            {bookState === 'open' ? (
              <>
                <button
                  onClick={() => setBookState('closed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#524139] hover:bg-[#665147] text-[#FAF6EE] border border-[#786055] transition shadow-sm"
                >
                  <BookMarked className="w-3.5 h-3.5 text-[#FCE1A8]" />
                  <span>Cerrar Portada</span>
                </button>

                <button
                  onClick={() => handleSimulateSync('gmail')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FCE8E6]/95 text-[#8C1D18] border border-[#F2B8B5] shadow-sm hover:scale-[1.02] transition"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#EA4335] ${
                      syncingProvider === 'gmail' ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="hidden md:inline">Gmail Calendar</span>
                </button>

                <button
                  onClick={() => handleSimulateSync('outlook')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#E3F2FD]/95 text-[#0B57D0] border border-[#A8C7FA] shadow-sm hover:scale-[1.02] transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0078D4]" />
                  <span className="hidden md:inline">Outlook</span>
                </button>

                {/* Estuche de Bolígrafo / Resaltador */}
                <div className="flex items-center gap-1 bg-[#28201c] p-1 rounded-xl border border-[#524139]">
                  <button
                    onClick={() => {
                      setPenMode(!penMode)
                      setIsHighlighter(false)
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      penMode && !isHighlighter
                        ? 'bg-[#FAF6EE] text-[#1D3557] shadow'
                        : 'text-[#D8CFC2] hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pluma</span>
                  </button>

                  <button
                    onClick={() => {
                      setPenMode(true)
                      setIsHighlighter(true)
                      setPenColor('#F4D35E')
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      penMode && isHighlighter
                        ? 'bg-[#FCE1A8] text-[#5C4B3B] shadow'
                        : 'text-[#D8CFC2] hover:text-white'
                    }`}
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Resaltador</span>
                  </button>

                  {penMode && (
                    <div className="flex items-center gap-1 px-1.5">
                      {['#1D3557', '#BC4749', '#2B2D42', '#386641'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setIsHighlighter(false)
                            setPenColor(c)
                          }}
                          className={`w-4 h-4 rounded-full border ${
                            penColor === c && !isHighlighter
                              ? 'scale-125 border-white'
                              : 'border-transparent opacity-80'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <button
                        onClick={() => updateCurrentStrokes([])}
                        className="p-1 text-[#E5989B] hover:text-red-400"
                        title="Borrar trazos de tinta"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => handleOpenBookFromCover(dayCursor)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5989B] to-[#B5838D] text-[#261e1b] font-bold text-xs shadow-lg hover:scale-[1.02] transition"
              >
                <BookOpen className="w-4 h-4" />
                Abrir Agenda en Día {currentDay.dayNumber} →
              </button>
            )}
          </div>
        </div>

        {/* Selector de hoja Izquierda / Derecha cuando está abierta en celular o tablet vertical */}
        {bookState === 'open' && (
          <div className="flex lg:hidden items-center justify-center gap-2 mt-2.5">
            <button
              onClick={() => setMobileTab('schedule')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                mobileTab === 'schedule'
                  ? 'bg-[#FAF6EE] text-[#2B2D42] border-[#D8CFC2] shadow-md'
                  : 'bg-[#382d27]/80 text-[#C8BCAE] border-[#5c493f]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Hoja 1: Horarios
            </button>
            <button
              onClick={() => setMobileTab('notes')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                mobileTab === 'notes'
                  ? 'bg-[#FAF6EE] text-[#2B2D42] border-[#D8CFC2] shadow-md'
                  : 'bg-[#382d27]/80 text-[#C8BCAE] border-[#5c493f]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Hoja 2: Notas & Post-its
            </button>
          </div>
        )}
      </header>

      {/* ========================================================================
          ESCENA 1: LA AGENDA CERRADA CON EL CENTRO DE ESCRITORIO AL LADO
         ======================================================================== */}
      {bookState === 'closed' && (
        <ClosedCoverDesk
          coverTheme={coverTheme}
          setCoverTheme={setCoverTheme}
          ownerName={ownerName}
          setOwnerName={setOwnerName}
          coverSubtitle={coverSubtitle}
          setCoverSubtitle={setCoverSubtitle}
          placedStickers={placedStickers}
          setPlacedStickers={setPlacedStickers}
          currentDay={currentDay}
          months={MONTHS}
          onOpenBook={handleOpenBookFromCover}
          onQuickAddNote={handleQuickAddFromDesk}
          gmailConnected={gmailConnected}
          outlookConnected={outlookConnected}
          onSimulateSync={handleSimulateSync}
          syncingProvider={syncingProvider}
        />
      )}

      {/* ========================================================================
          ESCENA 2 & 3: APERTURA CINEMATOGRÁFICA DE PORTADA + LIBRO ABIERTO CON HOJAS 3D
         ======================================================================== */}
      {bookState !== 'closed' && (
        <motion.main
          initial={{ scale: 0.9, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="book-perspective relative w-full max-w-[1320px] flex-1 flex items-stretch justify-center my-1"
        >
          {/* CUBIERTA EXTERIOR DE CUERO PERSONALIZADA */}
          <div
            className={`relative w-full bg-gradient-to-br ${activeCoverTheme.bg} rounded-[26px] p-2 sm:p-3.5 lg:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.2)] border-2 flex items-stretch`}
            style={{ borderColor: activeCoverTheme.border }}
          >
            {/* Costura pespunteada decorativa alrededor del cuero */}
            <div
              className="absolute inset-1.5 rounded-[20px] border border-dashed opacity-45 pointer-events-none"
              style={{ borderColor: activeCoverTheme.stitch }}
            />

            {/* Efecto de hojas apiladas debajo (grosor del libro a izquierda y derecha) */}
            <div className="hidden sm:block w-1.5 bg-[#E6DEC8] rounded-l-lg border-r border-[#C8BCAE] my-2 shadow-inner" />
            <div className="hidden sm:block w-1 bg-[#EFE9DA] rounded-l-md border-r border-[#D5CBB8] my-1.5" />

            {/* CINTA SEPARADORA DE TELA ROJA EN EL LOMO */}
            <div
              className="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-[#9E2A2B] to-[#781D1E] rounded-t-sm shadow-md z-30"
              title="Cinta separadora de página"
            />

            {/* CONTENEDOR DE LAS DOS PÁGINAS ABIERTAS */}
            <div className="preserve-3d relative flex-1 flex flex-col lg:flex-row items-stretch min-h-[730px] rounded-xl overflow-hidden shadow-2xl">
              {/* ANIMACIÓN DE LA TAPA DURA ABRIÉNDOSE 180° + HOJEO RÁPIDO AL ENTRAR */}
              <AnimatePresence>
                {bookState === 'opening' && (
                  <>
                    {/* Sombra que se desplaza mientras se abre la tapa */}
                    <motion.div
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9 }}
                      className="absolute inset-0 bg-black/50 z-40 pointer-events-none"
                    />

                    {/* Tapa frontal de cuero que gira sobre el lomo central hacia la izquierda */}
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: -175 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.78, ease: [0.32, 0.08, 0.24, 1] }}
                      style={{ transformOrigin: 'left center' }}
                      className={`hidden lg:flex absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br ${activeCoverTheme.bg} rounded-r-xl z-50 shadow-2xl border-l border-white/20 items-center justify-center p-8 pointer-events-none`}
                    >
                      <div className="p-6 rounded-2xl border border-[#D4AF37]/60 bg-black/20 text-center">
                        <span className="font-serif text-3xl font-bold gold-foil-text">
                          {ownerName}
                        </span>
                      </div>
                    </motion.div>

                    {/* Primera hoja de guarda que pasa rápido ("riffle") tras abrir la tapa */}
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: -175 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        delay: 0.22,
                        duration: 0.72,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      style={{ transformOrigin: 'left center' }}
                      className="hidden lg:flex absolute inset-y-0 right-0 w-1/2 paper-sheet-right rounded-r-xl z-40 shadow-2xl border-l border-[#D8CFC2] flex-col justify-between p-10 pointer-events-none"
                    >
                      <div className="border-b border-[#D8CFC2] pb-4">
                        <span className="font-serif italic text-sm text-[#8A7968]">
                          Ex Libris • Propiedad de {ownerName}
                        </span>
                        <h4 className="font-serif text-2xl font-bold text-[#2B2D42] mt-1">
                          Índice General 2026
                        </h4>
                      </div>
                      <div className="space-y-3 opacity-45">
                        <div className="h-3 bg-[#D8CFC2] rounded w-3/4" />
                        <div className="h-3 bg-[#D8CFC2] rounded w-1/2" />
                        <div className="h-3 bg-[#D8CFC2] rounded w-5/6" />
                      </div>
                      <span className="font-serif italic text-xs text-[#8A7968]">
                        Desplazando hasta tu hoja del día...
                      </span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* =====================================================================
                  HOJA FÍSICA 3D QUE GIRA DE UN LADO A OTRO AL PASAR DE PÁGINA
                 ===================================================================== */}
              <AnimatePresence>
                {turningLeaf && (
                  <>
                    {/* Sombra dinámica proyectada sobre el libro debajo de la hoja que se levanta */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.35, 0] }}
                      transition={{ duration: 0.66 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-black/45 to-transparent z-40 pointer-events-none"
                    />

                    {/* Hoja física en 3D con anverso y reverso que pivota sobre la espiral central */}
                    <motion.div
                      key={`leaf-${turningLeaf.nextCursor}`}
                      initial={{
                        rotateY: 0,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      }}
                      animate={{
                        rotateY: turningLeaf.dir > 0 ? -180 : 180,
                        boxShadow: [
                          '0 8px 20px rgba(0,0,0,0.18)',
                          '-25px 25px 55px rgba(0,0,0,0.48)',
                          '0 8px 20px rgba(0,0,0,0.18)',
                        ],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.66,
                        ease: [0.45, 0.05, 0.25, 1],
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin:
                          turningLeaf.dir > 0 ? 'left center' : 'right center',
                      }}
                      className={`hidden lg:block absolute top-0 bottom-0 w-1/2 z-50 pointer-events-none ${
                        turningLeaf.dir > 0 ? 'right-0' : 'left-0'
                      }`}
                    >
                      {/* Cara frontal de la hoja mientras empieza a levantarse */}
                      <div
                        className={`absolute inset-0 backface-hidden ${
                          turningLeaf.dir > 0
                            ? 'paper-sheet-right rounded-r-xl'
                            : 'paper-sheet-left rounded-l-xl'
                        } p-7 flex flex-col justify-between border border-[#D8CFC2]`}
                      >
                        <div className="border-b-2 border-double border-[#C8BCAE] pb-3 flex justify-between items-end">
                          <div>
                            <span className="text-[11px] uppercase tracking-widest text-[#8A7968] block">
                              {MONTHS[turningLeaf.fromDay.monthIndex]?.name} • 2026
                            </span>
                            <h3 className="font-serif text-3xl font-bold text-[#2B2D42]">
                              {turningLeaf.fromDay.dayName} {turningLeaf.fromDay.dayNumber}
                            </h3>
                          </div>
                        </div>
                        <div className="my-auto space-y-5 opacity-45">
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                        </div>
                        <div className="text-xs font-serif italic text-[#8A7968]">
                          Pasando hoja...
                        </div>
                      </div>

                      {/* Cara trasera (reverso de la hoja de papel cuando ya cruzó la mitad del giro) */}
                      <div
                        style={{ transform: 'rotateY(180deg)' }}
                        className={`absolute inset-0 backface-hidden ${
                          turningLeaf.dir > 0
                            ? 'paper-sheet-left rounded-l-xl'
                            : 'paper-sheet-right rounded-r-xl'
                        } p-7 flex flex-col justify-between border border-[#D8CFC2]`}
                      >
                        <div className="border-b-2 border-double border-[#C8BCAE] pb-3 flex justify-between items-end">
                          <div>
                            <span className="text-[11px] uppercase tracking-widest text-[#8A7968] block">
                              {MONTHS[turningLeaf.toDay.monthIndex]?.name} • 2026
                            </span>
                            <h3 className="font-serif text-3xl font-bold text-[#2B2D42]">
                              {turningLeaf.toDay.dayName} {turningLeaf.toDay.dayNumber}
                            </h3>
                          </div>
                        </div>
                        <div className="my-auto space-y-5 opacity-55">
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                          <div className="h-[1px] bg-[#C8BCAE] w-full" />
                        </div>
                        <div className="text-xs font-serif italic text-[#8A7968]">
                          {turningLeaf.toDay.quote}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Overlay del grano SVG de papel sobre toda la agenda */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-45"
                style={{ filter: 'url(#paper-grain-filter)' }}
              />

              {/* Lienzo de dibujo libre (Apple Pencil / Pluma / Resaltador) encima de las dos hojas */}
              <FreehandCanvas
                active={penMode}
                penColor={penColor}
                penSize={3.5}
                isHighlighter={isHighlighter}
                strokes={currentStrokes}
                setStrokes={updateCurrentStrokes}
              />

              {/* =====================================================================
                  HOJA IZQUIERDA: AGENDA HORARIA CON RENGLONES DE PAPEL Y MARGEN ROJO
                 ===================================================================== */}
              <section
                className={`flex-1 paper-sheet-left relative flex flex-col justify-between p-4 sm:p-6 lg:p-7 ${
                  mobileTab === 'notes' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {/* Esquina superior izquierda para doblar la hoja hacia atrás */}
                <button
                  onClick={() => handleTurnPage(-1)}
                  className="group absolute top-3 left-3 flex items-center gap-1 text-xs font-serif italic text-[#7F6E5D] hover:text-[#2B2D42] z-30 bg-[#EFE9DC]/80 px-2.5 py-1 rounded-full border border-[#D8CFC2] transition hover:shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Pasar hoja atrás
                </button>

                {/* CABECERA IMPRESA DE LA HOJA IZQUIERDA (FECHA DE LA AGENDA) */}
                <div className="mt-6 pb-3 border-b-2 border-double border-[#C8BCAE] flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#8A7968] font-semibold block">
                      {currentMonth.name} • {currentDay.year}
                    </span>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2D42] tracking-tight">
                        {currentDay.dayName}
                      </h2>
                      <span className="font-serif italic text-base text-[#8A7968]">
                        Planificación Horaria
                      </span>
                    </div>
                  </div>

                  {/* Número grande del día enmarcado con trazo a mano (Rough.js) */}
                  <RoughBox
                    stroke="#B5838D"
                    fill="#F4C2C2"
                    fillStyle="solid"
                    roughness={1.5}
                    className="px-4 py-1.5"
                  >
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2D42] leading-none">
                      {currentDay.dayNumber}
                    </span>
                  </RoughBox>
                </div>

                {/* Leyenda rápida de colores de tinta */}
                <div className="flex items-center justify-between py-2 text-[11px] text-[#7D6F60] border-b border-[#E5DEC9]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#2B2D42]" /> Escrito a mano
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#EA4335]" /> Gmail Calendar
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#0078D4]" /> Outlook
                    </span>
                  </div>
                  <span className="italic font-serif text-xs">
                    Toca un renglón para agendar
                  </span>
                </div>

                {/* LISTA DE HORARIOS CON RENGLONES Y LÍNEA VERTICAL DE MARGEN ROJO */}
                <div className="relative flex-1 my-1 overflow-y-auto pr-1 divide-y divide-[#DFD6C7]">
                  {/* Línea vertical doble de margen clásico en tono rosado/rojo tenue */}
                  <div className="absolute top-0 bottom-0 left-[68px] sm:left-[76px] w-[1.5px] bg-[#E5989B]/65 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 left-[72px] sm:left-[80px] w-[1px] bg-[#E5989B]/35 pointer-events-none" />

                  {HOURS.map((hour) => {
                    const entry = currentDay.schedule[hour]
                    const isEditing = editingHour === hour
                    const badge = entry
                      ? SOURCE_BADGES[entry.source] || SOURCE_BADGES.personal
                      : null

                    return (
                      <div
                        key={hour}
                        onClick={() => !isEditing && handleOpenHour(hour)}
                        className={`group relative min-h-[44px] flex items-center transition-colors cursor-pointer ${
                          isEditing
                            ? 'bg-[#F3ECE0]/90'
                            : 'hover:bg-[#F3ECE0]/55'
                        }`}
                      >
                        {/* Columna de la hora a la izquierda del margen rojo */}
                        <div className="w-[68px] sm:w-[76px] pr-3 text-right select-none shrink-0">
                          <span className="font-serif text-sm sm:text-[15px] font-semibold text-[#7A6A58] group-hover:text-[#2B2D42]">
                            {hour}
                          </span>
                        </div>

                        {/* Contenido del renglón a la derecha del margen */}
                        <div className="flex-1 pl-4 pr-2 py-1 flex items-center justify-between gap-2 min-h-[42px]">
                          {isEditing ? (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 py-1 z-30"
                            >
                              <input
                                autoFocus
                                type="text"
                                value={draftText}
                                onChange={(e) => setDraftText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveHour(hour)
                                  if (e.key === 'Escape') setEditingHour(null)
                                }}
                                placeholder="Escribe tu cita o actividad con letra manuscrita..."
                                className="flex-1 bg-transparent border-b-2 border-[#B5838D] focus:outline-none font-hand text-2xl text-[#1D3557] placeholder:text-[#B0A292]"
                              />
                              <div className="flex items-center gap-1 shrink-0">
                                {['personal', 'gmail', 'outlook'].map((src) => (
                                  <button
                                    key={src}
                                    type="button"
                                    onClick={() => setDraftSource(src)}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition ${
                                      draftSource === src
                                        ? `${SOURCE_BADGES[src].bg} ${SOURCE_BADGES[src].text} ${SOURCE_BADGES[src].border} scale-105`
                                        : 'bg-white/50 text-[#7A6A58] border-[#D8CFC2]'
                                    }`}
                                  >
                                    {SOURCE_BADGES[src].label}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => handleSaveHour(hour)}
                                  className="ml-1 px-2.5 py-1 rounded-lg bg-[#2B2D42] text-[#FAF6EE] text-xs font-medium hover:bg-[#1D3557]"
                                >
                                  Listo
                                </button>
                              </div>
                            </div>
                          ) : entry ? (
                            <>
                              <div className="relative flex items-center gap-2.5 flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleCompleteHour(e, hour)}
                                  className="w-5 h-5 rounded border border-[#9A8B7A] bg-[#FAF6EE] flex items-center justify-center shrink-0 hover:border-[#2B2D42] transition"
                                  title="Tachar con bolígrafo"
                                >
                                  {entry.completed && (
                                    <Check className="w-3.5 h-3.5 text-[#BC4749] stroke-[3]" />
                                  )}
                                </button>

                                <div className="relative inline-block max-w-full truncate">
                                  <span
                                    className={`font-hand text-[22px] sm:text-[24px] leading-tight tracking-wide ${
                                      badge.inkText
                                    } ${entry.completed ? 'opacity-60' : ''}`}
                                  >
                                    {entry.text}
                                  </span>

                                  {entry.completed && (
                                    <svg
                                      viewBox="0 0 300 16"
                                      preserveAspectRatio="none"
                                      className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-3.5 pointer-events-none overflow-visible"
                                    >
                                      <path
                                        d="M 2 9 Q 85 4, 160 10 T 298 7"
                                        fill="none"
                                        stroke="#BC4749"
                                        strokeWidth="2.6"
                                        strokeLinecap="round"
                                        className="animate-ink-strike"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {badge.label}
                              </span>
                            </>
                          ) : (
                            <span className="font-hand text-xl text-[#BFB2A2] opacity-0 group-hover:opacity-100 transition-opacity">
                              + Toca para escribir a las {hour}...
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pie de página izquierdo */}
                <div className="pt-2 border-t border-[#DFD6C7] flex items-center justify-between text-[11px] font-serif italic text-[#8A7968]">
                  <span>{currentDay.quote}</span>
                  <span>Pág. {dayCursor * 2 + 1}</span>
                </div>
              </section>

              {/* =====================================================================
                  ESPIRAL METÁLICA CENTRAL DE ENCUADERNACIÓN
                 ===================================================================== */}
              <SpiralBinding />

              {/* =====================================================================
                  HOJA DERECHA: HOJA DE PAPEL LIMPIA + PRIORIDADES + POST-ITS MÓVILES
                 ===================================================================== */}
              <section
                className={`flex-1 paper-sheet-right relative flex flex-col justify-between p-4 sm:p-6 lg:p-7 ${
                  mobileTab === 'schedule' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {/* Cinta adhesiva decorativa (Washi Tape) en la parte superior */}
                <div className="washi-tape absolute top-2.5 left-1/2 -translate-x-1/2 w-36 h-5 -rotate-1 pointer-events-none z-20" />

                {/* Botón esquina superior derecha para pasar a la página siguiente */}
                <button
                  onClick={() => handleTurnPage(1)}
                  className="group absolute top-3 right-3 flex items-center gap-1 text-xs font-serif italic text-[#7F6E5D] hover:text-[#2B2D42] z-30 bg-[#EFE9DC]/80 px-2.5 py-1 rounded-full border border-[#D8CFC2] transition hover:shadow-sm"
                >
                  Pasar hoja siguiente
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* CABECERA DE LA HOJA DERECHA */}
                <div className="mt-6 pb-3 border-b-2 border-double border-[#C8BCAE] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[#8A7968] font-semibold block">
                      Objetivos & Notas del Día
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2D42]">
                      Prioridades & Post-its
                    </h3>
                  </div>

                  <button
                    onClick={addStickyNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF3B0] hover:bg-[#FCE1A8] text-[#5C4B3B] border border-[#E0C97A] shadow-sm text-xs font-semibold transition active:scale-95 z-30"
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    + Pegar Post-it
                  </button>
                </div>

                {/* SECCIÓN 1: TOP PRIORIDADES DEL DÍA ENMARCADAS CON TRAZO A MANO (ROUGH.JS) */}
                <div className="my-3">
                  <RoughBox
                    stroke="#8A7968"
                    fill="rgba(243, 236, 224, 0.55)"
                    fillStyle="solid"
                    roughness={1.4}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif font-bold text-base text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                        <span>★</span> Top 3 Prioridades del Día
                      </h4>
                      <span className="text-[11px] font-serif italic text-[#7F6E5D]">
                        Toca para tachar con tinta
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentDay.priorities.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => !penMode && togglePriority(item.id)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="w-5 h-5 rounded-sm border-2 border-[#7A6A58] flex items-center justify-center bg-[#FAF6EE] group-hover:border-[#2B2D42]">
                            {item.done && (
                              <Check className="w-4 h-4 text-[#BC4749] stroke-[3]" />
                            )}
                          </div>
                          <div className="relative inline-block">
                            <span
                              className={`font-hand text-2xl text-[#2B2D42] ${
                                item.done ? 'opacity-60' : ''
                              }`}
                            >
                              {item.text}
                            </span>
                            {item.done && (
                              <svg
                                viewBox="0 0 260 14"
                                preserveAspectRatio="none"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-3 pointer-events-none"
                              >
                                <path
                                  d="M 2 8 Q 90 3, 258 8"
                                  fill="none"
                                  stroke="#BC4749"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  className="animate-ink-strike"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addPriority} className="mt-2.5 flex items-center gap-2">
                      <input
                        type="text"
                        value={newPriorityText}
                        onChange={(e) => setNewPriorityText(e.target.value)}
                        placeholder="+ Escribir nueva prioridad..."
                        className="flex-1 bg-transparent border-b border-dashed border-[#B0A292] focus:border-[#2B2D42] focus:outline-none font-hand text-xl text-[#1D3557] placeholder:text-[#9E9080] py-0.5"
                      />
                      {newPriorityText.trim() && (
                        <button
                          type="submit"
                          className="text-xs px-2.5 py-1 rounded bg-[#2B2D42] text-white"
                        >
                          Añadir
                        </button>
                      )}
                    </form>
                  </RoughBox>
                </div>

                {/* SECCIÓN 2: ZONA INTERACTIVA DE POST-ITS ARRASTRABLES */}
                <div className="relative h-[225px] sm:h-[245px] my-1 rounded-xl border border-dashed border-[#C8BCAE]/80 bg-[#F5EFE4]/40 overflow-hidden">
                  <span className="absolute bottom-2 right-3 text-[11px] font-serif italic text-[#9C8D7C] pointer-events-none">
                    Tablero de notas adhesivas (arrástralas con el dedo)
                  </span>

                  {currentDay.stickyNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      drag={!penMode}
                      dragMomentum={false}
                      initial={{
                        x: note.x,
                        y: note.y,
                        rotate: note.rotate,
                      }}
                      whileDrag={{
                        scale: 1.06,
                        rotate: 0,
                        zIndex: 40,
                      }}
                      style={{ backgroundColor: note.color }}
                      className="post-it-shadow absolute w-48 sm:w-52 p-3 rounded-sm cursor-grab active:cursor-grabbing z-20"
                    >
                      <div className="w-14 h-3.5 bg-white/45 mx-auto -mt-4 mb-1.5 rounded-xs shadow-2xs pointer-events-none" />

                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-xs text-[#4A3B2C]">
                          {note.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStickyNote(note.id)}
                          className="text-[#7A6A58] hover:text-[#BC4749] p-0.5"
                          title="Quitar Post-it"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={note.content}
                        onChange={(e) => updateStickyText(note.id, e.target.value)}
                        className="w-full bg-transparent resize-none border-none focus:outline-none font-notes text-base leading-snug text-[#2B2D42]"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* SECCIÓN 3: NOTAS LIBRES MANUSCRITAS AL FINAL DE LA HOJA DERECHA */}
                <div className="mt-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-xs uppercase tracking-widest text-[#7A6A58] font-semibold">
                      Apuntes & Reflexiones del Día
                    </span>
                    <span className="text-[11px] text-[#9A8B7A] font-serif italic">
                      Renglones de escritura libre
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={currentDay.freeNote}
                    onChange={(e) =>
                      setDaysData((prev) => ({
                        ...prev,
                        [dayCursor]: {
                          ...prev[dayCursor],
                          freeNote: e.target.value,
                        },
                      }))
                    }
                    placeholder="Escribe aquí notas libres, ideas o pendientes como en tu cuaderno..."
                    className="w-full flex-1 bg-transparent paper-ruled-lines focus:outline-none font-hand text-2xl leading-[48px] text-[#1D3557] resize-none px-2"
                  />
                </div>

                {/* Pie de página derecho + Esquina doblada interactiva para pasar página */}
                <div className="pt-2 border-t border-[#DFD6C7] flex items-center justify-between text-[11px] font-serif italic text-[#8A7968] relative">
                  <span>Sincronizado con Google Calendar & Outlook</span>
                  <span className="pr-10">Pág. {dayCursor * 2 + 2}</span>

                  {/* Esquina inferior derecha doblada (Page Curl) */}
                  <button
                    onClick={() => handleTurnPage(1)}
                    title="Toca la esquina para doblar la hoja y pasar al día siguiente"
                    className="page-corner-curl absolute -bottom-6 -right-6 w-14 h-14 rounded-tl-xl transition-transform hover:scale-125 z-30"
                  />
                </div>
              </section>
            </div>

            {/* PESTAÑAS LATERALES TROQUELADAS DE LOS 12 MESES */}
            <aside className="hidden md:flex flex-col justify-between py-5 -mr-1.5 z-30 select-none">
              {MONTHS.map((m, idx) => {
                const isCurrent = currentDay.monthIndex === idx
                return (
                  <button
                    key={m.short}
                    onClick={() => handleSelectMonth(idx)}
                    style={{ backgroundColor: m.color }}
                    className={`group relative flex items-center justify-center w-8 py-1.5 rounded-r-lg border border-l-0 border-[#BDAE9E] shadow-md transition-all font-serif font-bold text-[10px] tracking-wider text-[#3A2E25] ${
                      isCurrent
                        ? 'w-10 translate-x-1 ring-1 ring-[#2B2D42]/30 font-extrabold shadow-lg'
                        : 'opacity-85 hover:opacity-100 hover:w-9'
                    }`}
                    title={`Ir a ${m.name}`}
                  >
                    {m.short}
                  </button>
                )
              })}
            </aside>
          </div>
        </motion.main>
      )}
    </div>
  )
}
