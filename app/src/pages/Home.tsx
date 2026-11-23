import type { CSSProperties } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

const fireflies = [
  { left: "14%", top: "72%", size: 2.5, dur: "11s", delay: "0s" },
  { left: "24%", top: "58%", size: 2, dur: "14s", delay: "2.5s" },
  { left: "34%", top: "78%", size: 3, dur: "12s", delay: "1s" },
  { left: "46%", top: "68%", size: 2, dur: "15s", delay: "4s" },
  { left: "58%", top: "74%", size: 2.5, dur: "10s", delay: "1.8s" },
  { left: "68%", top: "60%", size: 2, dur: "13s", delay: "3.2s" },
  { left: "78%", top: "76%", size: 3, dur: "11.5s", delay: "0.6s" },
  { left: "86%", top: "64%", size: 2, dur: "14.5s", delay: "2.1s" },
  { left: "20%", top: "36%", size: 2, dur: "16s", delay: "5s" },
  { left: "80%", top: "38%", size: 2.5, dur: "13.5s", delay: "3.8s" },
]

function TriforceRoyalCrest() {
  return (
    <div className="group relative mb-8 flex items-center justify-center">
      {/* Brilho dourado suave respirando */}
      <div className="animate-aura-breath pointer-events-none absolute size-40 rounded-full bg-[#c9a96e]/18 blur-2xl" />

      <svg
        viewBox="0 0 260 150"
        fill="none"
        className="relative z-10 h-28 w-auto drop-shadow-[0_0_24px_rgba(201,169,110,0.35)] transition-transform duration-700 group-hover:scale-[1.03] sm:h-36"
        aria-label="Brasão Real de Hyrule e Triforce"
      >
        <defs>
          <linearGradient id="triforceGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5e3b3" />
            <stop offset="50%" stopColor="#c9a96e" />
            <stop offset="100%" stopColor="#856532" />
          </linearGradient>
          <linearGradient id="wingGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d09a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7a5d2c" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Asas do Brasão Real (Hylian Crest) */}
        <path
          d="M96 96 C66 86, 38 66, 12 38 C24 66, 44 88, 72 102 C48 98, 28 86, 14 70 C28 94, 52 110, 82 116 C64 120, 48 116, 34 108 C52 126, 78 134, 108 124 L130 142 L152 124 C182 134, 208 126, 226 108 C212 116, 196 120, 178 116 C208 110, 232 94, 246 70 C232 86, 212 98, 188 102 C216 88, 236 66, 248 38 C222 66, 194 86, 164 96 L130 116 Z"
          fill="url(#wingGold)"
          fillOpacity="0.22"
          stroke="url(#triforceGold)"
          strokeWidth="1.2"
        />

        {/* Corpo central sob a Triforce */}
        <polygon
          points="130,104 144,120 130,136 116,120"
          fill="url(#triforceGold)"
          fillOpacity="0.35"
          stroke="url(#triforceGold)"
          strokeWidth="1.1"
        />

        {/* Triforce */}
        <g stroke="#f5e3b3" strokeOpacity="0.75" strokeWidth="1.2">
          <polygon points="130,10 153,50 107,50" fill="url(#triforceGold)" />
          <polygon points="105,54 128,94 82,94" fill="url(#triforceGold)" />
          <polygon points="155,54 178,94 132,94" fill="url(#triforceGold)" />
        </g>

        <circle cx="130" cy="120" r="2.2" fill="#f5e3b3" />
      </svg>
    </div>
  )
}

export default function Home() {
  return (
    <section className="relative flex w-full flex-1 flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
      {/* Vagalumes sutis da Floresta Kokiri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {fireflies.map((f, i) => (
          <span
            key={i}
            className="animate-firefly absolute rounded-full bg-[#e8d09a] shadow-[0_0_8px_rgba(232,208,154,0.85)]"
            style={
              {
                left: f.left,
                top: f.top,
                width: `${f.size}px`,
                height: `${f.size}px`,
                "--dur": f.dur,
                "--delay": f.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Faixa superior de metadados editoriais */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#c9a96e]/15 pb-4 text-[10px] uppercase tracking-[0.28em] text-[#7f8f87]">
        <span>Vol. I — Era do Herói</span>
        <span className="hidden sm:inline">Reino Sagrado · Templo do Tempo</span>
        <span>Hyrule</span>
      </div>

      {/* Palco central com a Triforce em destaque */}
      <div className="relative isolate flex flex-1 flex-col items-center justify-center py-14 text-center sm:py-16">
        {/* Geometria fina do Templo do Tempo com anel externo girando bem devagar */}
        <svg
          viewBox="0 0 600 460"
          fill="none"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 w-[580px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <polygon
            points="300,24 506,230 300,436 94,230"
            stroke="#c9a96e"
            strokeOpacity="0.13"
            strokeWidth="0.8"
          />
          <g className="animate-spin-ultraslow origin-center" style={{ transformOrigin: "300px 230px" }}>
            <circle
              cx="300"
              cy="230"
              r="188"
              stroke="#c9a96e"
              strokeOpacity="0.11"
              strokeWidth="0.8"
              strokeDasharray="3 8"
            />
            <circle cx="300" cy="42" r="2" fill="#c9a96e" fillOpacity="0.45" />
            <circle cx="488" cy="230" r="2" fill="#c9a96e" fillOpacity="0.45" />
            <circle cx="300" cy="418" r="2" fill="#c9a96e" fillOpacity="0.45" />
            <circle cx="112" cy="230" r="2" fill="#c9a96e" fillOpacity="0.45" />
          </g>
          <line x1="300" y1="0" x2="300" y2="460" stroke="#c9a96e" strokeOpacity="0.06" strokeWidth="0.8" />
        </svg>

        <div className="relative z-10 flex flex-col items-center">
          <TriforceRoyalCrest />

          <p className="text-[10px] uppercase tracking-[0.38em] text-[#c9a96e]/90">
            The Legend of Zelda · Ocarina of Time
          </p>

          <h1 className="font-display mt-4 text-4xl font-normal tracking-[0.24em] text-[#ebe6da] sm:text-6xl lg:text-7xl">
            CRÔNICAS DE HYRULE
          </h1>

          {/* Divisória fina com losango */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-12 bg-[#c9a96e]/40" />
            <span className="size-1.5 rotate-45 border border-[#c9a96e]/70" />
            <span className="h-px w-12 bg-[#c9a96e]/40" />
          </div>

          <p className="font-editorial mt-5 max-w-xl text-xl italic text-[#d8d1c2]/90 sm:text-2xl">
            “O fluxo do tempo é sempre cruel; sua velocidade parece diferente para cada pessoa, mas
            ninguém pode mudá-lo.”
          </p>
        </div>
      </div>

      {/* Rodapé editorial dividido */}
      <div className="relative z-10 grid items-end gap-8 border-t border-[#c9a96e]/15 pt-7 md:grid-cols-12">
        <div className="space-y-1.5 md:col-span-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]/80">
            Arquivo de Personagens
          </p>
          <p className="max-w-md text-sm leading-relaxed text-[#7f8f87]">
            Registro catalogado dos heróis, sábios, povos e forças das trevas que definiram o
            destino de Hyrule através das duas eras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 md:col-span-6 md:justify-end">
          <Link
            to="/sobre"
            className="text-[10px] uppercase tracking-[0.28em] text-[#7f8f87] transition-colors hover:text-[#ebe6da]"
          >
            Sobre o Arquivo
          </Link>

          <Link
            to="/explorar"
            className="group inline-flex items-center gap-3 border border-[#c9a96e]/55 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#ebe6da] transition-all hover:border-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#08100d]"
          >
            <span>Adentrar o Compêndio</span>
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}