"use client"

import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, BookOpen, Users, Settings } from "lucide-react"
import Image from "next/image"
import { SettingsModal } from "@/components/settings-modal"

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("top-readers")
  const [userBalance, setUserBalance] = useState("R$ 0.00")
  const [userName, setUserName] = useState("wasdasd")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [booksEvaluated, setBooksEvaluated] = useState(0)
  const [userAchievements, setUserAchievements] = useState<any>({})
  const [averageRating, setAverageRating] = useState(0)
  const [fastestReadingTime, setFastestReadingTime] = useState(Number.POSITIVE_INFINITY)

  // Adicionar useEffect para scroll no topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Adicionar scroll no topo quando mudar de aba
  const setActiveTabWithScroll = (tab: string) => {
    setActiveTab(tab)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      setUserBalance(userData.balance || "R$ 0.00")
      setUserName(userData.name || "wasdasd")

      // Calcular dados para conquistas
      const completedBooks = userData.completedBooks || []
      setBooksEvaluated(completedBooks.length)
      setUserAchievements(userData.achievements || {})

      // Calcular média de avaliações
      if (completedBooks.length > 0) {
        const totalRatings = completedBooks.reduce((sum: number, book: any) => sum + (book.rating || 0), 0)
        setAverageRating(totalRatings / completedBooks.length)

        // Encontrar o tempo de leitura mais rápido
        const fastestTime = Math.min(...completedBooks.map((book: any) => book.readingTime || Number.POSITIVE_INFINITY))
        setFastestReadingTime(fastestTime)
      }
    }
  }, [])

  const topReaders = [
    {
      name: "Ana Silva",
      avatar: "/images/avatars/ana-silva.jpeg",
      reviews: 125,
      rating: 4.9,
      earned: 1500,
    },
    {
      name: "Carlos Mendes",
      avatar: "/images/avatars/carlos-mendes.png",
      reviews: 110,
      rating: 4.8,
      earned: 1300,
    },
    {
      name: "Marina Costa",
      avatar: "/images/avatars/marina-costa.jpeg",
      reviews: 98,
      rating: 4.9,
      earned: 1150,
    },
    {
      name: "Pedro Santos",
      avatar: "/images/avatars/pedro-santos.jpeg",
      reviews: 85,
      rating: 4.7,
      earned: 1000,
    },
    {
      name: "Julia Oliveira",
      avatar: "/images/avatars/julia-oliveira.jpeg",
      reviews: 72,
      rating: 4.8,
      earned: 900,
    },
    {
      name: userName,
      avatar: null, // No specific avatar for the current user
      reviews: booksEvaluated,
      rating: averageRating,
      earned: Number.parseFloat(userBalance.replace("R$ ", "").replace(",", ".")) || 0,
    },
  ]

  const recentReviews = [
    {
      bookTitle: "O Segredo da Floresta",
      reviewer: "Fernanda Lima",
      rating: 5,
      excerpt: "Uma história envolvente e cheia de mistério. Não consegui parar de ler!",
      date: "2 dias atrás",
    },
    {
      bookTitle: "A Cidade Invisível",
      reviewer: "Ricardo Alves",
      rating: 4,
      excerpt: "Ficção científica de alta qualidade, com personagens cativantes e um enredo original.",
      date: "3 dias atrás",
    },
    {
      bookTitle: "Receitas da Vovó",
      reviewer: "Beatriz Souza",
      rating: 5,
      excerpt: "Livro de receitas maravilhoso! As instruções são claras e os pratos deliciosos.",
      date: "4 dias atrás",
    },
    {
      bookTitle: "Guia de Viagem para a Patagônia",
      reviewer: "Gustavo Pereira",
      rating: 4,
      excerpt: "Informações muito úteis para planejar uma viagem. Recomendo para aventureiros.",
      date: "5 dias atrás",
    },
  ]

  const achievements = [
    {
      title: "Primeira Avaliação",
      description: "Complete sua primeira avaliação de livro",
      icon: "📚",
      unlocked: userAchievements.firstEvaluation?.unlocked || false,
      progress: Math.min(booksEvaluated, 1),
      total: 1,
    },
    {
      title: "Leitor Dedicado",
      description: "Avalie 10 livros",
      icon: "📖",
      unlocked: userAchievements.dedicatedReader?.unlocked || false,
      progress: Math.min(booksEvaluated, 10),
      total: 10,
    },
    {
      title: "Crítico Experiente",
      description: "Receba 100 curtidas em suas avaliações",
      icon: "👍",
      unlocked: userAchievements.expertCritic?.unlocked || false,
      progress: 0, // Por enquanto sempre 0 até implementarmos sistema de curtidas
      total: 100,
    },
    {
      title: "Velocidade da Luz",
      description: "Complete uma avaliação em menos de 5 minutos",
      icon: "⚡",
      unlocked: userAchievements.speedOfLight?.unlocked || false,
      progress: fastestReadingTime < 300 ? 1 : 0,
      total: 1,
    },
    {
      title: "Perfeccionista",
      description: "Mantenha uma média de 4.5 estrelas (mín. 3 avaliações)",
      icon: "⭐",
      unlocked: userAchievements.perfectionist?.unlocked || false,
      progress: booksEvaluated >= 3 && averageRating >= 4.5 ? 1 : 0,
      total: 1,
    },
  ]

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 bg-yellow-900 border-yellow-700"
      case 2:
        return "text-gray-400 bg-gray-900 border-gray-700"
      case 3:
        return "text-orange-400 bg-orange-900 border-orange-700"
      default:
        return "text-blue-400 bg-blue-900 border-blue-700"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Diamante":
        return "text-purple-400 bg-purple-900 border-purple-700"
      case "Platina":
        return "text-gray-400 bg-gray-900 border-gray-700"
      case "Ouro":
        return "text-yellow-400 bg-yellow-900 border-yellow-700"
      case "Prata":
        return "text-gray-400 bg-gray-900 border-gray-700"
      case "Bronze":
        return "text-orange-400 bg-orange-900 border-orange-700"
      default:
        return "text-primary bg-primary/10 border-primary/50"
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Comunidade Beta Reader</h1>
          <p className="text-muted-foreground">
            Conecte-se com outros leitores, veja rankings e conquiste achievements
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="top-readers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="top-readers">Top Leitores</TabsTrigger>
            <TabsTrigger value="recent-reviews">Avaliações Recentes</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="top-readers">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Ranking dos Top Leitores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topReaders.map((reader, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-primary">{index + 1}.</span>
                        <Avatar className="w-10 h-10 border-2 border-primary">
                          <AvatarImage src={reader.avatar || "/placeholder.svg"} alt={reader.name} />
                          <AvatarFallback>{reader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{reader.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {reader.reviews} avaliações • {reader.rating}{" "}
                            <Star className="w-3 h-3 inline-block fill-yellow-400 text-yellow-400" />
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">R$ {reader.earned.toLocaleString("pt-BR")}</p>
                        <p className="text-sm text-muted-foreground">ganhos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent-reviews">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Últimas Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review, index) => (
                    <div key={index} className="p-3 rounded-lg bg-background/50">
                      <p className="font-semibold text-lg mb-1">{review.bookTitle}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <span className="mr-2">Por {review.reviewer}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}/5</span>
                      </div>
                      <p className="text-sm mb-2">{review.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Suas Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className={`backdrop-blur-sm border-border shadow-lg ${
                        achievement.unlocked ? "bg-primary/10 border-primary" : "bg-card/80"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`text-3xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-semibold mb-2 ${achievement.unlocked ? "text-primary" : "text-foreground"}`}
                            >
                              {achievement.title}
                              {achievement.unlocked && (
                                <Badge className="ml-2 bg-primary text-white text-xs">Desbloqueado!</Badge>
                              )}
                            </h3>
                            <p
                              className={`text-sm mb-3 ${achievement.unlocked ? "text-primary-foreground" : "text-muted-foreground"}`}
                            >
                              {achievement.description}
                            </p>

                            {!achievement.unlocked && (
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progresso</span>
                                  <span>
                                    {achievement.progress}/{achievement.total}
                                  </span>
                                </div>
                                <div className="w-full bg-border rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
              <BookOpen className="w-5 h-5 mb-1" />
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
            <Button variant="ghost" className="flex flex-col items-center py-2 text-primary">
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Comunidade</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center py-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/wallet")}
            >
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Saque</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
