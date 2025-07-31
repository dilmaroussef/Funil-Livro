"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, BookOpen, Users, Wallet, Settings, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { SettingsModal } from "@/components/settings-modal"
import Image from "next/image"

export default function WalletPage() {
  const router = useRouter()
  const [userBalance, setUserBalance] = useState("R$ 0.00")
  const [userName, setUserName] = useState("wasdasd")
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [booksEvaluated, setBooksEvaluated] = useState(0)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      setUserBalance(userData.balance || "R$ 0.00")
      setUserName(userData.name || "Usuário")

      // Calcular dados reais
      const totalEarnings = userData.totalEarnings || 0
      const completedBooks = userData.completedBooks || []
      const booksEvaluated = completedBooks.length // Contar livros realmente concluídos

      setTotalEarnings(totalEarnings)
      setBooksEvaluated(booksEvaluated)
    }
  }, [])

  // Adicionar useEffect para scroll no topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentBalance = Number.parseFloat(userBalance.replace("R$ ", "").replace(",", ".")) || 0
  const minWithdraw = 10.0
  const canWithdraw = currentBalance >= minWithdraw

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={160} height={32} priority />
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Olá, <span className="font-semibold">{userName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-12 w-12 p-0 hover:bg-accent transition-colors rounded-xl"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Carteira</h1>
          <p className="text-muted-foreground">Gerencie seus ganhos e realize saques via PIX</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white mb-8 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Saldo Disponível</div>
              <div className="text-4xl font-bold mb-4">{userBalance}</div>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => router.push("/withdraw")}
                  disabled={!canWithdraw}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Sacar via PIX
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => router.push("/library")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ler Mais Livros
                </Button>
              </div>
              {!canWithdraw && (
                <p className="text-sm opacity-75 mt-3">
                  Valor mínimo para saque: R$ {minWithdraw.toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">
                R$ {totalEarnings.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-muted-foreground">Total de Ganhos</div>
              <p className="text-sm text-muted-foreground/80 mt-2">Valor total ganho avaliando livros</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-3xl font-bold text-accent mb-2">{booksEvaluated}</div>
              <div className="text-muted-foreground">Livros Avaliados</div>
              <p className="text-sm text-muted-foreground/80 mt-2">Número total de livros que você avaliou</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {booksEvaluated === 0 && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">Comece a Ganhar Dinheiro!</h3>
              <p className="text-lg opacity-90 mb-6">
                Avalie seu primeiro livro e comece a construir sua renda como beta reader
              </p>
              <Button
                onClick={() => router.push("/library")}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Ver Livros Disponíveis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/library")}
            >
              <BookOpen className="w-5 h-5 mb-1" />
              <span className="text-xs">Livros</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/community")}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Comunidade</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center py-2 text-primary">
              <Wallet className="w-5 h-5 mb-1" />
              <span className="text-xs">Saque</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
