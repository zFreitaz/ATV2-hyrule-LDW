import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

const virtudes = [
  {
    numero: "I",
    titulo: "Poder",
    deusa: "Din · A Força",
    descricao:
      "Representa a ambição, o vigor e as grandes ameaças que testam o equilíbrio do reino.",
  },
  {
    numero: "II",
    titulo: "Sabedoria",
    deusa: "Nayru · A Ordem",
    descricao:
      "Simboliza os Sábios dos Templos, a Família Real e o conhecimento preservado através das eras.",
  },
  {
    numero: "III",
    titulo: "Coragem",
    deusa: "Farore · A Vida",
    descricao:
      "Guiada pelo Herói do Tempo e pelos povos livres que resistem mesmo diante da escuridão.",
  },
]

const arquitetura = [
  {
    camada: "Interface SPA",
    itens: "React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · React Router",
  },
  {
    camada: "Servidor & API",
    itens: "Node.js · Express 5 · Rotas REST CRUD · Validação de Payload",
  },
  {
    camada: "Persistência",
    itens: "PostgreSQL · Queries Parametrizadas · Integridade Relacional",
  },
]

export default function Sobre() {
  return (
    <div className="w-full space-y-16 px-6 py-12 sm:px-10 lg:px-16">
      {/* Cabeçalho Editorial */}
      <header className="grid gap-8 border-b border-[#c9a96e]/15 pb-12 lg:grid-cols-12 lg:items-end">
        <div className="space-y-4 lg:col-span-7">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c9a96e]/85">
            Sobre o Arquivo · MCMXCVIII
          </p>
          <h1 className="font-display text-3xl font-normal tracking-[0.22em] text-[#ebe6da] sm:text-5xl">
            CRÔNICAS DE HYRULE
          </h1>
        </div>

        <p className="font-editorial text-xl leading-relaxed italic text-[#c9a96e]/90 sm:text-2xl lg:col-span-5 lg:text-right">
          “Um compêndio vivo dedicado aos personagens que atravessam as duas eras de Ocarina of
          Time.”
        </p>
      </header>

      {/* Corpo em Duas Colunas: Propósito + As Três Virtudes */}
      <section className="grid gap-14 lg:grid-cols-12">
        {/* Esquerda: Narrativa do projeto */}
        <div className="space-y-6 lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/80">
            O Propósito do Volume
          </p>
          <p className="font-editorial text-xl leading-relaxed text-[#ebe6da]/90">
            Dos bosques silenciosos da Floresta Kokiri às ruínas do Castelo de Ganon, cada figura de
            Hyrule carrega um papel decisivo na linha do tempo.
          </p>
          <p className="text-sm leading-relaxed text-[#8fa198]">
            Este projeto nasceu como uma aplicação web completa para catalogar, consultar e
            gerenciar esses personagens em tempo real — unindo uma estética de grimório clássico a
            uma arquitetura moderna de SPA conectada a banco de dados relacional.
          </p>

          <div className="pt-4">
            <Link
              to="/explorar"
              className="group inline-flex items-center gap-3 border-b border-[#c9a96e] pb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#ebe6da] transition-colors hover:text-[#c9a96e]"
            >
              <span>Explorar o Compêndio</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Direita: Os 3 pilares da Triforce */}
        <div className="space-y-2 lg:col-span-7">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/80">
            Os Três Pilares da Triforce
          </p>
          <div className="divide-y divide-[#c9a96e]/15 border-y border-[#c9a96e]/15">
            {virtudes.map((v) => (
              <div key={v.numero} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline">
                <span className="font-display text-xs tracking-[0.25em] text-[#c9a96e] sm:col-span-1">
                  {v.numero}
                </span>
                <div className="sm:col-span-4">
                  <h2 className="font-display text-base uppercase tracking-[0.18em] text-[#ebe6da]">
                    {v.titulo}
                  </h2>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#7f8f87]">
                    {v.deusa}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[#9fb0a8] sm:col-span-7">
                  {v.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé Técnico: Arquitetura limpa sem badges poluídas */}
      <section className="space-y-6 border-t border-[#c9a96e]/15 pt-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/80">
          Arquitetura & Tecnologias
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {arquitetura.map((bloco) => (
            <div key={bloco.camada} className="space-y-2 border-l border-[#c9a96e]/25 pl-5">
              <h3 className="font-display text-sm uppercase tracking-[0.18em] text-[#ebe6da]">
                {bloco.camada}
              </h3>
              <p className="text-xs leading-relaxed tracking-wide text-[#8fa198]">{bloco.itens}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}