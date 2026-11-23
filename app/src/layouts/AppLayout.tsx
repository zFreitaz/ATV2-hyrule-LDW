import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Clock, CloudRain, Music } from "lucide-react"
import OcarinaBar from "@/components/OcarinaBar"

const gotas = Array.from({ length: 38 }, (_, i) => ({
  left: `${(i * 2.7) % 100}%`,
  dur: `${0.75 + (i % 5) * 0.14}s`,
  delay: `${(i % 9) * 0.18}s`,
}))

export default function AppLayout() {
  const [ocarinaOpen, setOcarinaOpen] = useState(false)
  const [eraAdulta, setEraAdulta] = useState(false)
  const [tempestade, setTempestade] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("era-adulta", eraAdulta)
  }, [eraAdulta])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative py-1 text-[10px] font-medium uppercase tracking-[0.28em] transition-colors",
      isActive
        ? "text-[#ebe6da] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-[#c9a96e]"
        : "text-muted-foreground hover:text-[#ebe6da]",
    ].join(" ")

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-700">
      {/* Chuva da Song of Storms */}
      {tempestade && (
        <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
          {gotas.map((g, i) => (
            <span
              key={i}
              className="animate-rain absolute top-0 h-14 w-px bg-gradient-to-b from-transparent via-sky-200/45 to-transparent"
              style={
                {
                  left: g.left,
                  "--rdur": g.dur,
                  "--rdelay": g.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[#c9a96e]/15 bg-background/90 backdrop-blur-md transition-colors duration-700">
        <div className="grid w-full grid-cols-2 items-center px-6 py-4 sm:px-10 lg:px-16 md:grid-cols-3">
          {/* Esquerda: Marca */}
          <NavLink to="/" className="group inline-flex items-center gap-3">
            <svg viewBox="0 0 36 32" fill="none" className="size-4 shrink-0" aria-hidden="true">
              <polygon points="18,1 26,15 10,15" stroke="#c9a96e" strokeWidth="1.2" />
              <polygon points="9,17 17,31 1,31" stroke="#c9a96e" strokeWidth="1.2" />
              <polygon points="27,17 35,31 19,31" stroke="#c9a96e" strokeWidth="1.2" />
            </svg>
            <span className="font-display text-sm tracking-[0.3em] text-[#ebe6da] transition-colors group-hover:text-[#c9a96e]">
              HYRULE
            </span>
          </NavLink>

          {/* Centro: Alternador de Era (Criança / Adulta) */}
          <div className="hidden justify-center md:flex">
            <button
              type="button"
              onClick={() => setEraAdulta((v) => !v)}
              title="Alternar entre Era da Criança e Era Adulta (7 anos depois)"
              className="inline-flex cursor-pointer items-center gap-2 border border-[#c9a96e]/20 px-3.5 py-1 text-[9px] uppercase tracking-[0.28em] text-muted-foreground transition-all hover:border-[#c9a96e]/55 hover:text-[#ebe6da]"
            >
              <Clock className="size-3 text-[#c9a96e]" />
              <span>{eraAdulta ? "Era Adulta · +7 Anos" : "Era da Criança · MCMXCVIII"}</span>
            </button>
          </div>

          {/* Direita: Navegação + Botão da Ocarina */}
          <nav className="flex items-center justify-end gap-5 sm:gap-7">
            <NavLink to="/" end className={linkClass}>
              Início
            </NavLink>
            <NavLink to="/explorar" className={linkClass}>
              Compêndio
            </NavLink>
            <NavLink to="/melodias" className={linkClass}>
              Melodias
            </NavLink>
            <NavLink to="/sobre" className={linkClass}>
              Sobre
            </NavLink>

            <span className="hidden h-3.5 w-px bg-[#c9a96e]/20 sm:inline-block" />

            {tempestade && (
              <button
                type="button"
                onClick={() => setTempestade(false)}
                title="Parar tempestade"
                className="cursor-pointer text-sky-300/80 transition-colors hover:text-sky-200"
              >
                <CloudRain className="size-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setOcarinaOpen((v) => !v)}
              className={[
                "inline-flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.24em] transition-all",
                ocarinaOpen
                  ? "border-[#c9a96e] bg-[#c9a96e] text-[#08100d]"
                  : "border-[#c9a96e]/35 text-[#c9a96e] hover:border-[#c9a96e] hover:bg-[#c9a96e]/10",
              ].join(" ")}
            >
              <Music className="size-3" />
              <span className="hidden sm:inline">Ocarina</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <OcarinaBar
        open={ocarinaOpen}
        onClose={() => setOcarinaOpen(false)}
        onToggleEra={() => setEraAdulta((v) => !v)}
        onToggleTempestade={() => setTempestade((v) => !v)}
      />
    </div>
  )
}