import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Sobre() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o projeto</CardTitle>
        <CardDescription>Enciclopédia de personagens de Zelda: Ocarina of Time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Aplicação SPA feita com React, TypeScript, shadcn/ui e Tailwind CSS, consumindo uma API REST em Express com banco PostgreSQL.</p>
        <p>Permite cadastrar, listar, editar e excluir personagens de Hyrule.</p>
      </CardContent>
    </Card>
  )
}