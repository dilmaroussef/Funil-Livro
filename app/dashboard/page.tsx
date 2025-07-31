"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, BookOpen, Users, Wallet, Clock, TrendingUp, Settings, LogOut, CheckCircle } from "lucide-react"
import { WelcomeModal } from "@/components/welcome-modal"
import { SettingsModal } from "@/components/settings-modal"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Dashboard() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [userName, setUserName] = useState("wasdasd")
  const [userBalance, setUserBalance] = useState("R$ 0.00")
  const [completedBooks, setCompletedBooks] = useState<string[]>([])
  const router = useRouter()
  const [booksReadToday, setBooksReadToday] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    // Carregar dados do usuário
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)

      setUserName(userData.name || "wasdasd")
      setUserBalance(userData.balance || "R$ 0.00")

      // Debug: Mostrar UTMs originais no console com mais detalhes
      console.log("📊 Dashboard - Dados do usuário:", {
        name: userData.name,
        email: userData.email,
        registrationSource: userData.registrationSource,
        loginSource: userData.loginSource,
        originalUtms: userData.originalUtms,
      })

      // Verificar se temos UTMs válidos
      const hasValidUtms = localStorage.getItem("betareader_has_valid_utms")
      const originalUtms = localStorage.getItem("betareader_original_utms")

      if (hasValidUtms === "true" && originalUtms) {
        try {
          const utmData = JSON.parse(originalUtms)
          console.log("✅ UTMs protegidos disponíveis no dashboard:", utmData)
        } catch (error) {
          console.error("❌ Erro ao parsear UTMs no dashboard:", error)
        }
      }

      // Carregar livros concluídos
      if (userData.completedBooks) {
        const completedBookIds = userData.completedBooks.map((book: any) => book.id)
        setCompletedBooks(completedBookIds)

        // Calcular livros lidos hoje
        const today = new Date().toDateString()
        const booksToday = userData.completedBooks.filter((book: any) => {
          const bookDate = new Date(book.completedAt).toDateString()
          return bookDate === today
        }).length

        setBooksReadToday(booksToday)
      }

      // Se não completou o onboarding, mostrar o modal
      if (!userData.onboardingCompleted) {
        setShowWelcomeModal(true)
      }
    } else {
      // Se não tem dados salvos, mostrar o modal
      setShowWelcomeModal(true)
    }
  }, [])

  const handleLogout = () => {
    // Salvar dados do usuário no localStorage antes de sair
    const userData = {
      name: userName,
      email: "user@email.com", // Em uma aplicação real, isso viria do estado/contexto
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      balance: userBalance,
      booksRead: 0,
      points: 0,
    }

    localStorage.setItem("betareader_user_data", JSON.stringify(userData))

    // Redirecionar para página inicial
    router.push("/")
  }

  const handleReadBook = (bookId: string) => {
    // Verificar se o livro já foi concluído
    if (completedBooks.includes(bookId)) {
      return // Não fazer nada se já foi concluído
    }
    window.scrollTo(0, 0)
    router.push(`/book/${bookId}`)
  }

  const isBookCompleted = (bookId: string) => {
    return completedBooks.includes(bookId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={160} height={32} priority />
            </div>

            {/* Header direito - apenas configurações e sair */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-12 sm:w-12 p-0 hover:bg-accent transition-colors rounded-xl"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-12 sm:w-12 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 pb-16 sm:pb-20">
        {/* Stats Cards - Saldo e Hoje */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-2 sm:p-3">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Saldo</div>
                <div className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2">{userBalance}</div>
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/80 text-white text-xs py-1 h-7 sm:h-8"
                  onClick={() => router.push("/wallet")}
                >
                  Toque para sacar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Hoje</div>
              <div className="text-lg sm:text-xl font-bold text-accent">{booksReadToday} livros</div>
            </CardContent>
          </Card>
        </div>

        {/* Layout em duas colunas */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Coluna principal - Livros disponíveis */}
          <div className="lg:col-span-2">
            {/* Na seção principal, simplificar para: */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Olá, {userName}!</h1>
              <p className="text-sm text-muted-foreground">
                Você avaliou {booksReadToday} {booksReadToday === 1 ? "livro" : "livros"} hoje
              </p>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">
              Encontramos títulos para você avaliar
            </h2>

            <div className="space-y-2 sm:space-y-3">
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 truncate">
                        As Sombras de Eldoria
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1 sm:mb-2">por Marina Silvestre</p>
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Fantasia Épica
                        </Badge>
                        <div className="text-sm sm:text-lg font-bold text-primary">R$ 30.00</div>
                      </div>
                      {isBookCompleted("eldoria") && (
                        <div className="flex items-center text-xs text-primary mb-1 sm:mb-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Avaliação concluída
                        </div>
                      )}
                    </div>
                    <Button
                      className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ml-2 flex-shrink-0 ${
                        isBookCompleted("eldoria")
                          ? "bg-primary hover:bg-primary/80 text-white cursor-default"
                          : "bg-primary hover:bg-primary/80 text-white"
                      }`}
                      onClick={() => handleReadBook("eldoria")}
                      disabled={isBookCompleted("eldoria")}
                    >
                      {isBookCompleted("eldoria") ? "Concluído" : "Ler e Avaliar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg opacity-75">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-muted-foreground mb-1 truncate">
                        Código Vermelho
                      </h3>
                      <p className="text-xs text-muted-foreground/80 mb-1 sm:mb-2">por Alexandre Ferreira</p>
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-muted-foreground/50 text-muted-foreground">
                          Thriller Tecnológico
                        </Badge>
                        <Badge className="text-xs bg-muted-foreground text-white">🔒 Cadeado</Badge>
                        <div className="text-sm sm:text-lg font-bold text-muted-foreground">R$ 75.00</div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Aguarde ser liberado para sua conta
                      </div>
                    </div>
                    <Button
                      disabled
                      className="bg-muted text-muted-foreground cursor-not-allowed text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ml-2 flex-shrink-0"
                    >
                      🔒 Bloqueado
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg opacity-75">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-muted-foreground mb-1 truncate">
                        O Jardim das Memórias Perdidas
                      </h3>
                      <p className="text-xs text-muted-foreground/80 mb-1 sm:mb-2">por Clara Monteiro</p>
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-muted-foreground/50 text-muted-foreground">
                          Romance Contemporâneo
                        </Badge>
                        <Badge className="text-xs bg-muted-foreground text-white">🔒 Cadeado</Badge>
                        <div className="text-sm sm:text-lg font-bold text-muted-foreground">R$ 125.00</div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Aguarde ser liberado para sua conta
                      </div>
                    </div>
                    <Button
                      disabled
                      className="bg-muted text-muted-foreground cursor-not-allowed text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ml-2 flex-shrink-0"
                    >
                      🔒 Bloqueado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar direita - Comunidade e ações rápidas */}
          <div className="space-y-3 sm:space-y-4">
            {/* Cards lado a lado - sempre em 2 colunas */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="p-2 sm:p-3 text-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1">Comunidade</h3>
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-2">Rankings e reviews</p>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent text-xs py-1 h-6 sm:h-7"
                    onClick={() => router.push("/community")}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Ver Rankings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="p-2 sm:p-3 text-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1">Biblioteca</h3>
                  <p className="text-xs text-muted-foreground mb-1 sm:mb-2">Ver biblioteca completa</p>
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent/10 bg-transparent text-xs py-1 h-6 sm:h-7"
                    onClick={() => router.push("/library")}
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Todos os Livros
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Card de estatísticas rápidas */}
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg"></Card>
          </div>
        </div>

        {/* Espaço para o rodapé fixo */}
        <div className="h-1.5"></div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-around py-1 sm:py-2">
            <Button variant="ghost" className="flex flex-col items-center py-1 sm:py-2 text-primary min-w-0 flex-1">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-1 sm:py-2 text-muted-foreground min-w-0 flex-1 hover:text-foreground"
              onClick={() => router.push("/library")}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
              <span className="text-xs">Livros</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-1 sm:py-2 text-muted-foreground min-w-0 flex-1 hover:text-foreground"
              onClick={() => router.push("/community")}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
              <span className="text-xs">Comunidade</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-1 sm:py-2 text-muted-foreground min-w-0 flex-1 hover:text-foreground"
              onClick={() => router.push("/wallet")}
            >
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
              <span className="text-xs">Saque</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} userName={userName} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  )
}
