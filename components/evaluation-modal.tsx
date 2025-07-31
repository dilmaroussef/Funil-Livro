"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, Clock, AlertTriangle, BookOpen, TrendingUp, TrendingDown } from "lucide-react"

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  bookTitle: string
  readingTimeSeconds: number
  baseValue: number
}

export function EvaluationModal({ isOpen, onClose, bookTitle, readingTimeSeconds, baseValue }: EvaluationModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState(0)
  const [bonusInfo, setBonusInfo] = useState({ type: "", percentage: 0, message: "" })

  useEffect(() => {
    if (isOpen) {
      calculateEarnings()
    }
  }, [isOpen, readingTimeSeconds, rating, review.length])

  // Adicionar scroll no topo quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modalElement = document.querySelector('[data-modal="evaluation"]')
        if (modalElement) {
          modalElement.scrollTop = 0
        }
      }, 50)
    }
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateEarnings = () => {
    const readingMinutes = readingTimeSeconds / 60
    let multiplier = 1
    let bonusType = ""
    let bonusPercentage = 0
    let bonusMessage = ""

    // Lógica de bonificação baseada no tempo de leitura
    if (readingMinutes <= 2) {
      // Muito rápido - penalidade
      multiplier = 0.3
      bonusType = "penalty"
      bonusPercentage = -70
      bonusMessage = "Leitura muito rápida - Penalidade aplicada"
    } else if (readingMinutes <= 5) {
      // Rápido - bônus alto
      multiplier = 1.5
      bonusType = "high_bonus"
      bonusPercentage = 50
      bonusMessage = "Leitura eficiente - Bônus de velocidade!"
    } else if (readingMinutes <= 10) {
      // Tempo ideal - bônus médio
      multiplier = 1.2
      bonusType = "medium_bonus"
      bonusPercentage = 20
      bonusMessage = "Tempo de leitura ideal - Bônus aplicado"
    } else if (readingMinutes <= 20) {
      // Tempo normal - valor base
      multiplier = 1
      bonusType = "normal"
      bonusPercentage = 0
      bonusMessage = "Tempo de leitura padrão"
    } else {
      // Muito lento - penalidade
      multiplier = 0.6
      bonusType = "penalty"
      bonusPercentage = -40
      bonusMessage = "Leitura muito lenta - Penalidade aplicada"
    }

    // Bônus adicional por qualidade da avaliação
    if (rating >= 4 && review.length >= 500) {
      multiplier += 0.3
      bonusPercentage += 30
      bonusMessage += " + Bônus de qualidade!"
    } else if (rating >= 3 && review.length >= 400) {
      multiplier += 0.1
      bonusPercentage += 10
      bonusMessage += " + Pequeno bônus de qualidade"
    }

    const finalValue = baseValue * multiplier
    setCalculatedValue(finalValue)
    setBonusInfo({
      type: bonusType,
      percentage: bonusPercentage,
      message: bonusMessage,
    })
  }

  if (!isOpen) return null

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber)
  }

  const handleStarHover = (starNumber: number) => {
    setHoveredRating(starNumber)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, dê uma nota de 1 a 5 estrelas")
      return
    }

    if (review.length < 300) {
      alert("Sua avaliação deve ter pelo menos 300 caracteres")
      return
    }

    setIsSubmitting(true)

    // Simular envio da avaliação
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Salvar dados da avaliação
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      const currentBalance = Number.parseFloat(userData.balance.replace("R$ ", "").replace(",", ".")) || 0
      const newBalance = currentBalance + calculatedValue

      userData.balance = `R$ ${newBalance.toFixed(2).replace(".", ",")}`
      userData.booksRead = (userData.booksRead || 0) + 1
      userData.totalEarnings = (userData.totalEarnings || 0) + calculatedValue

      localStorage.setItem("betareader_user_data", JSON.stringify(userData))
    }

    alert(`Avaliação enviada com sucesso! Você ganhou R$ ${calculatedValue.toFixed(2).replace(".", ",")}`)

    setIsSubmitting(false)
    onClose()
  }

  const getStarColor = (starNumber: number) => {
    const currentRating = hoveredRating || rating
    return starNumber <= currentRating ? "text-primary fill-current" : "text-muted-foreground/50"
  }

  const getRatingText = () => {
    const currentRating = hoveredRating || rating
    switch (currentRating) {
      case 1:
        return "Ruim!"
      case 2:
        return "Fraco!"
      case 3:
        return "Médio!"
      case 4:
        return "Bom!"
      case 5:
        return "Excelente!"
      default:
        return ""
    }
  }

  const getBonusColor = () => {
    switch (bonusInfo.type) {
      case "high_bonus":
        return "bg-primary/10 border-primary text-primary-foreground"
      case "medium_bonus":
        return "bg-accent/10 border-accent text-accent-foreground"
      case "penalty":
        return "bg-destructive/10 border-destructive text-destructive-foreground"
      default:
        return "bg-card border-border text-foreground"
    }
  }

  const getBonusIcon = () => {
    if (bonusInfo.percentage > 0) {
      return <TrendingUp className="w-5 h-5 text-primary" />
    } else if (bonusInfo.percentage < 0) {
      return <TrendingDown className="w-5 h-5 text-destructive" />
    }
    return <Clock className="w-5 h-5 text-muted-foreground" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-modal="evaluation">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Avalie sua Experiência</h2>
            <p className="text-muted-foreground">Compartilhe sua opinião sobre "{bookTitle}"</p>
          </div>

          {/* Reading Time & Performance */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-accent/10 border-accent">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <div className="text-center">
                    <div className="text-blue-800 font-semibold">Tempo de leitura</div>
                    <div className="text-2xl font-bold text-blue-600">{formatTime(readingTimeSeconds)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${getBonusColor()} border-2`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  {getBonusIcon()}
                  <div className="text-center ml-2">
                    <div className="font-semibold">Performance</div>
                    <div className="text-sm">
                      {bonusInfo.percentage > 0
                        ? `+${bonusInfo.percentage}%`
                        : bonusInfo.percentage < 0
                          ? `${bonusInfo.percentage}%`
                          : "Padrão"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Message */}
          <Card className={`${getBonusColor()} mb-6`}>
            <CardContent className="p-4">
              <div className="flex items-center">
                {getBonusIcon()}
                <div className="ml-3">
                  <h4 className="font-semibold mb-1">Análise de Performance</h4>
                  <p className="text-sm">{bonusInfo.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Dê uma nota de 1 a 5 estrelas</h3>
            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="transition-all duration-200 transform hover:scale-110"
                >
                  <Star className={`w-10 h-10 ${getStarColor(star)} transition-colors duration-200`} />
                </button>
              ))}
            </div>
            {getRatingText() && (
              <div className="text-center">
                <span className="text-lg font-semibold text-primary">{getRatingText()}</span>
              </div>
            )}
          </div>

          {/* Review Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Escreva sua crítica</h3>

            {/* Warning */}
            <Card className="bg-destructive/10 border-destructive mb-4">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-destructive-foreground mb-2">⚠️ Aviso Importante</h4>
                    <p className="text-destructive-foreground/90 text-sm">
                      Faça uma avaliação real do livro! Nosso sistema irá analisar sua avaliação e se não fizer sentido
                      ou for digitado qualquer coisa, você não receberá o valor!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Size Info */}
            <div className="flex items-center mb-4 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>📚 Livro de tamanho padrão</span>
              <span className="ml-4">Mínimo de 300 caracteres para este livro</span>
            </div>

            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Escreva sua avaliação detalhada sobre o livro. Comente sobre a história, personagens, escrita, o que mais gostou ou não gostou... Avaliações mais completas recebem bônus!"
              className="min-h-[150px] border-border focus:border-primary focus:ring-primary resize-none"
              maxLength={1000}
            />

            <div className="flex justify-between items-center mt-2 text-sm">
              <span className={`${review.length >= 300 ? "text-primary" : "text-destructive"} font-medium`}>
                {review.length}/1000 caracteres (mínimo 300)
              </span>
              {review.length >= 500 && rating >= 4 && (
                <span className="text-primary font-medium">🎉 Bônus de qualidade ativo!</span>
              )}
            </div>
          </div>

          {/* Earnings Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary mb-6">
            <CardContent className="p-6">
              <h4 className="font-semibold text-primary-foreground mb-4 text-center text-lg">💰 Seus Ganhos</h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Valor base do livro:</span>
                  <span className="font-medium">R$ {baseValue.toFixed(2).replace(".", ",")}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Multiplicador de performance:</span>
                  <span className={`font-medium ${bonusInfo.percentage >= 0 ? "text-primary" : "text-destructive"}`}>
                    {bonusInfo.percentage > 0
                      ? `+${bonusInfo.percentage}%`
                      : bonusInfo.percentage < 0
                        ? `${bonusInfo.percentage}%`
                        : "0%"}
                  </span>
                </div>

                <hr className="border-primary/50" />

                <div className="flex justify-between items-center">
                  <span className="text-primary-foreground font-semibold">Valor final:</span>
                  <span className="text-3xl font-bold text-green-600">
                    R$ {calculatedValue.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-card/50 rounded-lg">
                <p className="text-xs text-green-700 text-center">
                  💡 <strong>Dica:</strong> Leituras entre 3-10 minutos com avaliações detalhadas rendem mais!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.length < 300 || isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando Avaliação...
              </div>
            ) : (
              `Enviar Avaliação - Ganhar R$ ${calculatedValue.toFixed(2).replace(".", ",")}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
