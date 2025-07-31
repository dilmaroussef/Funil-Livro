"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Home, BookOpen, Users, Wallet, Settings, Search, Filter, CheckCircle, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { SettingsModal } from "@/components/settings-modal"
import Image from "next/image"

export default function Library() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [completedBooks, setCompletedBooks] = useState<string[]>([])
  const [userBalance, setUserBalance] = useState("R$ 0.00")
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    // Carregar dados do usuário
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      setUserBalance(userData.balance || "R$ 0.00")

      if (userData.completedBooks) {
        const completedBookIds = userData.completedBooks.map((book: any) => book.id)
        setCompletedBooks(completedBookIds)
      }
    }
  }, [])

  // Adicionar useEffect para scroll no topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const books = [
    {
      id: "eldoria",
      title: "As Sombras de Eldoria",
      author: "Marina Silvestre",
      genre: "Fantasia Épica",
      value: 30.0,
      available: true,
      rating: 4.8,
      reviews: 234,
      description: "Em um reino onde a magia está desaparecendo, uma jovem escriba descobre um antigo segredo...",
    },
    {
      id: "codigo-vermelho",
      title: "Código Vermelho",
      author: "Alexandre Ferreira",
      genre: "Thriller Tecnológico",
      value: 75.0,
      available: false,
      rating: 4.6,
      reviews: 189,
      description: "Um hacker descobre uma conspiração que pode derrubar o governo...",
    },
    {
      id: "jardim-memorias",
      title: "O Jardim das Memórias Perdidas",
      author: "Clara Monteiro",
      genre: "Romance Contemporâneo",
      value: 125.0,
      available: false,
      rating: 4.9,
      reviews: 312,
      description: "Uma história tocante sobre amor, perda e a força da memória...",
    },
    {
      id: "noite-eterna",
      title: "A Noite Eterna",
      author: "Roberto Silva",
      genre: "Terror Psicológico",
      value: 45.0,
      available: false,
      rating: 4.3,
      reviews: 156,
      description: "Uma cidade onde o sol nunca nasce e os pesadelos se tornam realidade...",
    },
    {
      id: "estrelas-distantes",
      title: "Estrelas Distantes",
      author: "Ana Carolina",
      genre: "Ficção Científica",
      value: 90.0,
      available: false,
      rating: 4.7,
      reviews: 278,
      description: "Uma jornada épica através das galáxias em busca de um novo lar...",
    },
    {
      id: "segredos-familia",
      title: "Os Segredos da Família Morrison",
      author: "Patricia Lima",
      genre: "Drama Familiar",
      value: 55.0,
      available: false,
      rating: 4.4,
      reviews: 203,
      description: "Três gerações de uma família e os segredos que as unem e separam...",
    },
  ]

  const genres = [
    "all",
    "Fantasia Épica",
    "Thriller Tecnológico",
    "Romance Contemporâneo",
    "Terror Psicológico",
    "Ficção Científica",
    "Drama Familiar",
  ]

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  // Também adicionar scroll no topo quando navegar para livro
  const handleReadBook = (bookId: string) => {
    if (completedBooks.includes(bookId)) {
      return
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
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={160} height={32} priority />
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Saldo: <span className="font-semibold text-primary">{userBalance}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Biblioteca de Livros</h1>
          <p className="text-muted-foreground">Explore nossa coleção completa de livros disponíveis para avaliação</p>
        </div>

        {/* Search and Filter */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border focus:border-primary focus:ring-primary bg-card text-foreground"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:border-primary focus:ring-primary bg-card text-foreground"
            >
              <option value="all">Todos os gêneros</option>
              {genres.slice(1).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{books.length}</div>
              <div className="text-sm text-muted-foreground">Total de Livros</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{books.filter((b) => b.available).length}</div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedBooks.length}</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                R$ {books.reduce((sum, book) => sum + book.value, 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className={`backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 ${
                book.available ? "bg-card/80" : "bg-card/50 opacity-75"
              }`}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3
                    className={`text-lg font-semibold mb-2 ${book.available ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {book.title}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${book.available ? "text-muted-foreground" : "text-muted-foreground/80"}`}
                  >
                    por {book.author}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${book.available ? "border-primary text-primary" : "border-muted-foreground/50 text-muted-foreground"}`}
                    >
                      {book.genre}
                    </Badge>
                    {!book.available && <Badge className="text-xs bg-muted-foreground text-white">🔒 Cadeado</Badge>}
                  </div>

                  <p
                    className={`text-sm mb-4 line-clamp-2 ${book.available ? "text-foreground" : "text-muted-foreground/80"}`}
                  >
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span
                        className={`text-sm font-medium ${book.available ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {book.rating}
                      </span>
                      <span
                        className={`text-xs ml-1 ${book.available ? "text-muted-foreground" : "text-muted-foreground/80"}`}
                      >
                        ({book.reviews})
                      </span>
                    </div>
                    <div className={`text-lg font-bold ${book.available ? "text-primary" : "text-muted-foreground"}`}>
                      R$ {book.value.toFixed(2).replace(".", ",")}
                    </div>
                  </div>

                  {isBookCompleted(book.id) && (
                    <div className="flex items-center text-xs text-primary mb-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Avaliação concluída
                    </div>
                  )}

                  {!book.available && !isBookCompleted(book.id) && (
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3 mr-1" />
                      Aguarde ser liberado
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleReadBook(book.id)}
                  disabled={!book.available || isBookCompleted(book.id)}
                  className={`w-full text-sm ${
                    isBookCompleted(book.id)
                      ? "bg-primary hover:bg-primary/80 text-white cursor-default"
                      : book.available
                        ? "bg-primary hover:bg-primary/80 text-white"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isBookCompleted(book.id) ? "Concluído" : book.available ? "Ler e Avaliar" : "🔒 Bloqueado"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground/80">Tente ajustar seus filtros de busca</p>
          </div>
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
            <Button variant="ghost" className="flex flex-col items-center py-2 text-primary">
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
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/wallet")}
            >
              <Wallet className="w-5 h-5 mb-1" />
              <span className="text-xs">Saque</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
