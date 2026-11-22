import { Link, Outlet } from "react-router-dom"

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-xl font-bold">🔺 Hyrule Characters</h1>
          <div className="flex gap-4">
            <Link to="/" className="hover:underline">Personagens</Link>
            <Link to="/sobre" className="hover:underline">Sobre</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-4"><Outlet /></main>
    </div>
  )
}