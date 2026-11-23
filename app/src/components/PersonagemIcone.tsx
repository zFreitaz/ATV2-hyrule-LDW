import type { IconePersonagem, Papel, Raca } from "@/types/personagem"

export const LABELS_ICONE: Record<IconePersonagem, string> = {
  espada: "Master Sword",
  triforce: "Triforce",
  ocarina: "Ocarina",
  fada: "Fada Navi",
  coroa: "Coroa Real",
  esmeralda: "Esmeralda Kokiri",
  rubi: "Rubi Goron",
  safira: "Safira Zora",
  gerudo: "Crescente Gerudo",
  sheikah: "Olho Sheikah",
}

export function resolverIcone(
  icone: IconePersonagem | null | undefined,
  raca: Raca,
  papel: Papel
): IconePersonagem {
  if (icone) return icone
  if (papel === "Herói") return "espada"
  if (raca === "Kokiri") return "esmeralda"
  if (raca === "Goron") return "rubi"
  if (raca === "Zora") return "safira"
  if (raca === "Gerudo") return "gerudo"
  if (raca === "Sheikah") return "sheikah"
  if (papel === "Sábio") return "triforce"
  return "ocarina"
}

export default function PersonagemIcone({
  icone,
  className = "size-5",
}: {
  icone: IconePersonagem
  className?: string
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {icone === "espada" && (
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3 L19 7 L18 20 L14 20 L13 7 Z" />
          <path d="M8 18 L14 20 L18 20 L24 18 L21 22 L11 22 Z" />
          <path d="M16 22 V29" />
          <circle cx="16" cy="29" r="1.2" fill="currentColor" />
        </g>
      )}
      {icone === "triforce" && (
        <g stroke="currentColor" strokeWidth="1.4">
          <polygon points="16,4 21,14 11,14" />
          <polygon points="10.5,15 15.5,25 5.5,25" />
          <polygon points="21.5,15 26.5,25 16.5,25" />
        </g>
      )}
      {icone === "ocarina" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M6 19 C6 12, 13 9, 21 10 C25 10.5, 27 13, 26 16 C25 20, 19 23, 12 23 C8 23, 6 21.5, 6 19 Z" />
          <circle cx="13" cy="16" r="1.2" fill="currentColor" />
          <circle cx="17" cy="15" r="1.2" fill="currentColor" />
          <circle cx="21" cy="15.5" r="1.2" fill="currentColor" />
        </g>
      )}
      {icone === "fada" && (
        <g stroke="currentColor" strokeWidth="1.4">
          <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 14 C7 9, 4 12, 7 16 C5 19, 8 22, 12 18" />
          <path d="M20 14 C25 9, 28 12, 25 16 C27 19, 24 22, 20 18" />
        </g>
      )}
      {icone === "coroa" && (
        <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M5 23 L7 11 L12 16 L16 8 L20 16 L25 11 L27 23 Z" />
          <line x1="6" y1="26" x2="26" y2="26" />
        </g>
      )}
      {icone === "esmeralda" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M16 4 C22 9, 25 16, 22 24 C19 28, 13 28, 10 24 C7 16, 10 9, 16 4 Z" />
          <path d="M16 10 L20 17 L16 23 L12 17 Z" />
        </g>
      )}
      {icone === "rubi" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <polygon points="16,4 26,10 26,22 16,28 6,22 6,10" />
          <polygon points="16,9 21,12 21,20 16,23 11,20 11,12" />
        </g>
      )}
      {icone === "safira" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="10" r="4.5" />
          <circle cx="11" cy="20" r="4.5" />
          <circle cx="21" cy="20" r="4.5" />
        </g>
      )}
      {icone === "gerudo" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M20 6 A11 11 0 1 0 20 26 A8 8 0 1 1 20 6 Z" />
          <polygon points="22,13 24,16 22,19 20,16" fill="currentColor" />
        </g>
      )}
      {icone === "sheikah" && (
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M4 15 Q16 6 28 15 Q16 24 4 15 Z" />
          <circle cx="16" cy="15" r="3.5" />
          <path d="M16 20 L17.5 26 A1.5 1.5 0 0 1 14.5 26 Z" />
        </g>
      )}
    </svg>
  )
}