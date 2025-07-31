"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, CheckCircle, BookOpen, Clock, X, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  bookTitle: string
  readingTimeSeconds: number
  baseValue: number
}

export function QuestionsModal({ isOpen, onClose, bookTitle, readingTimeSeconds, baseValue }: QuestionsModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [attempts, setAttempts] = useState<{ [key: string]: number }>({})
  const [showResult, setShowResult] = useState<{ [key: string]: "correct" | "incorrect" | null }>({})
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEarnings, setShowEarnings] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState(0)

  // Scroll para o topo sempre que mudar de etapa
  useEffect(() => {
    // Scroll para o topo sempre que mudar de etapa ou mostrar ganhos
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="questions"]')
      if (modalElement) {
        modalElement.scrollTop = 0
      }
    }, 50)
  }, [currentStep, showEarnings])

  if (!isOpen) return null

  const questions = [
    {
      id: "question1",
      question: "Qual é o nome da protagonista?",
      options: [
        { id: "a", text: "Lyra", correct: true },
        { id: "b", text: "Elena", correct: false },
        { id: "c", text: "Marina", correct: false },
      ],
      points: 30,
    },
    {
      id: "question2",
      question: "Qual era o título do manuscrito que ela encontrou?",
      options: [
        { id: "a", text: "As Crônicas Perdidas", correct: false },
        { id: "b", text: "Os Últimos Dias da Era Dourada", correct: true },
        { id: "c", text: "O Livro dos Segredos", correct: false },
      ],
      points: 40,
    },
    {
      id: "question3",
      question: "Quem é o Grão-Mestre da biblioteca?",
      options: [
        { id: "a", text: "Mestre Aldric", correct: true },
        { id: "b", text: "Mestre Gareth", correct: false },
        { id: "c", text: "Mestre Theron", correct: false },
      ],
      points: 30,
    },
  ]

  const ratingQuestions = [
    {
      id: "rating1",
      question: "Como você avalia a qualidade da escrita?",
      options: [
        { id: "a", text: "Excelente - Muito bem escrito", correct: true, points: 20 },
        { id: "b", text: "Bom - Escrita satisfatória", correct: true, points: 15 },
        { id: "c", text: "Regular - Precisa melhorar", correct: true, points: 5 },
      ],
    },
    {
      id: "rating2",
      question: "O que achou do desenvolvimento da história?",
      options: [
        { id: "a", text: "Muito envolvente e bem estruturada", correct: true, points: 20 },
        { id: "b", text: "Interessante, mas com alguns pontos fracos", correct: true, points: 15 },
        { id: "c", text: "Confusa e mal desenvolvida", correct: true, points: 5 },
      ],
    },
    {
      id: "rating3",
      question: "Recomendaria este livro para outros leitores?",
      options: [
        { id: "a", text: "Sim, definitivamente recomendaria", correct: true, points: 20 },
        { id: "b", text: "Talvez, para leitores específicos", correct: true, points: 15 },
        { id: "c", text: "Não recomendaria", correct: true, points: 5 },
      ],
    },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateEarnings = () => {
    let totalPoints = 0

    // Pontos das perguntas sobre o livro
    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      const correctOption = q.options.find((opt) => opt.correct)
      if (userAnswer === correctOption?.id) {
        totalPoints += q.points
      }
    })

    // Pontos das perguntas de avaliação
    ratingQuestions.forEach((q) => {
      const userAnswer = answers[q.id]
      const selectedOption = q.options.find((opt) => opt.id === userAnswer)
      if (selectedOption) {
        totalPoints += selectedOption.points
      }
    })

    // Bônus por tempo (pequeno impacto)
    let timeBonus = 0
    const readingMinutes = readingTimeSeconds / 60
    if (readingMinutes >= 3 && readingMinutes <= 8) {
      timeBonus = 10
    } else if (readingMinutes >= 1 && readingMinutes <= 15) {
      timeBonus = 5
    }

    const finalPoints = totalPoints + timeBonus
    // Ajustado para máximo de R$ 150 quando acerta tudo
    const finalValue = (finalPoints / 160) * baseValue * 5 // Reduzido de 15 para 5

    return {
      value: Math.max(0.1, finalValue), // Mínimo R$ 0,10
      totalPoints: finalPoints,
      timeBonus,
      maxPoints: 160,
    }
  }

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    const currentQuestion = [...questions, ...ratingQuestions].find((q) => q.id === questionId)
    if (!currentQuestion) return

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))

    // Para perguntas sobre o livro, verificar se está correto
    if (questions.find((q) => q.id === questionId)) {
      const correctOption = currentQuestion.options.find((opt) => opt.correct)
      const isCorrect = optionId === correctOption?.id

      setShowResult((prev) => ({ ...prev, [questionId]: isCorrect ? "correct" : "incorrect" }))

      if (!isCorrect) {
        const currentAttempts = attempts[questionId] || 0
        setAttempts((prev) => ({ ...prev, [questionId]: currentAttempts + 1 }))
      }
    } else {
      // Para perguntas de avaliação, sempre mostrar como correto
      setShowResult((prev) => ({ ...prev, [questionId]: "correct" }))
    }
  }

  const handleNextQuestion = () => {
    const currentQuestionId = currentStep <= 3 ? questions[currentStep - 1].id : ratingQuestions[currentStep - 4].id
    const hasAnswer = answers[currentQuestionId]
    const result = showResult[currentQuestionId]

    if (!hasAnswer) {
      alert("Por favor, selecione uma resposta.")
      return
    }

    // Se for pergunta sobre o livro e errou, verificar tentativas
    if (currentStep <= 3 && result === "incorrect") {
      const currentAttempts = attempts[currentQuestionId] || 0
      if (currentAttempts >= 3) {
        alert("Você esgotou suas tentativas para esta pergunta. Continuando...")
      } else {
        return // Não avança se ainda tem tentativas
      }
    }

    setCurrentStep((prev) => prev + 1)

    // Scroll para o topo após mudança de estado
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="questions"]')
      if (modalElement) {
        modalElement.scrollTop = 0
      }
    }, 50)
  }

  const handlePreviousQuestion = () => {
    setCurrentStep((prev) => prev - 1)

    // Scroll para o topo após mudança de estado
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="questions"]')
      if (modalElement) {
        modalElement.scrollTop = 0
      }
    }, 50)
  }

  const handleTryAgain = (questionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: "" }))
    setShowResult((prev) => ({ ...prev, [questionId]: null }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Calcular ganhos baseado nas respostas
    const earnings = calculateEarnings()
    setCalculatedValue(earnings.value)

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowEarnings(true)

    // Scroll para o topo quando mostrar ganhos
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="questions"]')
      if (modalElement) {
        modalElement.scrollTop = 0
      }
    }, 50)
  }

  const handleFinalSubmit = () => {
    // Salvar dados
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      const currentBalance = Number.parseFloat(userData.balance.replace("R$ ", "").replace(",", ".")) || 0
      const newBalance = currentBalance + calculatedValue

      userData.balance = `R$ ${newBalance.toFixed(2).replace(".", ",")}`
      userData.booksRead = (userData.booksRead || 0) + 1
      userData.totalEarnings = (userData.totalEarnings || 0) + calculatedValue

      // Marcar livros como concluídos
      if (!userData.completedBooks) {
        userData.completedBooks = []
      }

      // Salvar dados detalhados da avaliação para conquistas
      const bookData = {
        id: "eldoria",
        title: bookTitle,
        completedAt: new Date().toISOString(),
        earnings: calculatedValue,
        readingTime: readingTimeSeconds,
        rating: rating,
        answers: answers,
        totalPoints: calculateEarnings().totalPoints,
      }

      userData.completedBooks.push(bookData)

      // Verificar e desbloquear conquistas
      if (!userData.achievements) {
        userData.achievements = {}
      }

      // Primeira Avaliação
      if (userData.completedBooks.length >= 1 && !userData.achievements.firstEvaluation) {
        userData.achievements.firstEvaluation = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        }
      }

      // Leitor Dedicado (10 livros)
      if (userData.completedBooks.length >= 10 && !userData.achievements.dedicatedReader) {
        userData.achievements.dedicatedReader = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        }
      }

      // Velocidade da Luz (menos de 5 minutos = 300 segundos)
      if (readingTimeSeconds < 300 && !userData.achievements.speedOfLight) {
        userData.achievements.speedOfLight = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        }
      }

      // Calcular média de avaliações para Perfeccionista
      const totalRatings = userData.completedBooks.reduce((sum: number, book: any) => sum + (book.rating || 0), 0)
      const averageRating = totalRatings / userData.completedBooks.length

      if (averageRating >= 4.5 && userData.completedBooks.length >= 3 && !userData.achievements.perfectionist) {
        userData.achievements.perfectionist = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        }
      }

      localStorage.setItem("betareader_user_data", JSON.stringify(userData))
    }

    // Scroll para o topo antes de redirecionar
    window.scrollTo(0, 0)

    // Fechar modal e voltar para dashboard
    onClose()

    // Forçar recarregamento da página para atualizar o saldo
    window.location.href = "/dashboard"
  }

  const isCurrentAnswerValid = () => {
    const currentQuestionId = currentStep <= 3 ? questions[currentStep - 1].id : ratingQuestions[currentStep - 4].id
    const hasAnswer = answers[currentQuestionId]
    const result = showResult[currentQuestionId]

    if (currentStep <= 3) {
      return hasAnswer && (result === "correct" || (attempts[currentQuestionId] || 0) >= 3)
    }
    return hasAnswer
  }

  // Tela de ganhos
  if (showEarnings) {
    const earnings = calculateEarnings()

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-modal="questions">
          <div className="sticky top-0 bg-card border-b border-border p-4 rounded-t-2xl">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">🎉 Parabéns!</h2>
              <p className="text-muted-foreground">Sua avaliação foi concluída</p>
            </div>
          </div>

          <div className="p-6">
            {/* Earnings Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white mb-6 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-3xl font-bold mb-2">R$ {calculatedValue.toFixed(2).replace(".", ",")}</h3>
                <p className="text-lg opacity-90">Seus ganhos por esta avaliação</p>
              </CardContent>
            </Card>

            {/* Performance Breakdown */}
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4 text-center">📊 Como Calculamos Seus Ganhos</h4>

                <div className="space-y-4">
                  {/* Questions Performance */}
                  <div className="bg-background rounded-lg p-4">
                    <h5 className="font-semibold text-foreground mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Perguntas sobre o Livro
                    </h5>
                    <div className="space-y-2 text-sm">
                      {questions.map((q, index) => {
                        const userAnswer = answers[q.id]
                        const correctOption = q.options.find((opt) => opt.correct)
                        const isCorrect = userAnswer === correctOption?.id
                        return (
                          <div key={q.id} className="flex justify-between">
                            <span>Pergunta {index + 1}:</span>
                            <span
                              className={`font-medium ${isCorrect ? "text-primary" : "text-destructive-foreground"}`}
                            >
                              {isCorrect ? `+${q.points}` : "0"} pontos
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rating Performance */}
                  <div className="bg-background rounded-lg p-4">
                    <h5 className="font-semibold text-foreground mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Avaliação do Livro
                    </h5>
                    <div className="space-y-2 text-sm">
                      {ratingQuestions.map((q, index) => {
                        const userAnswer = answers[q.id]
                        const selectedOption = q.options.find((opt) => opt.id === userAnswer)
                        return (
                          <div key={q.id} className="flex justify-between">
                            <span>Avaliação {index + 1}:</span>
                            <span className="font-medium text-lime-400">+{selectedOption?.points || 0} pontos</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Performance */}
                  <div className="bg-background rounded-lg p-4">
                    <h5 className="font-semibold text-foreground mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Tempo de Leitura
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tempo total:</span>
                        <span className="font-medium">{formatTime(readingTimeSeconds)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bônus de tempo:</span>
                        <span className="font-medium text-teal-300">+{earnings.timeBonus} pontos</span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary-foreground">Total de pontos:</span>
                      <span className="text-2xl font-bold text-primary">
                        {earnings.totalPoints}/{earnings.maxPoints}
                      </span>
                    </div>
                    <div className="text-xs text-primary-foreground mt-1 text-center">
                      Convertido em: R$ {calculatedValue.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Button */}
            <Button
              onClick={handleFinalSubmit}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white py-4 text-lg font-medium"
            >
              Finalizar e Receber R$ {calculatedValue.toFixed(2).replace(".", ",")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalSteps = questions.length + ratingQuestions.length
  const currentQuestions = currentStep <= 3 ? questions : ratingQuestions
  const currentQuestionIndex = currentStep <= 3 ? currentStep - 1 : currentStep - 4
  const currentQuestion = currentQuestions[currentQuestionIndex]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-modal="questions">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-3 md:p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {currentStep <= 3 ? "Quiz sobre o Livro" : "Avaliação do Livro"}
              </h2>
              <div className="text-sm text-muted-foreground">
                Etapa {currentStep} de {totalSteps}
              </div>
            </div>
            <div></div>
          </div>
        </div>

        <div className="p-3 md:p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          {currentStep <= totalSteps && (
            <div>
              <Card className="bg-accent/10 border-accent mb-6">
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-start mb-4 md:mb-6">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mr-2 md:mr-4 flex-shrink-0 text-sm md:text-base">
                      {currentStep}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                        {currentQuestion.question}
                      </h3>

                      {/* Attempts counter for knowledge questions */}
                      <div className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
                        Tentativas: {attempts[currentQuestion.id] || 0}/3
                        {currentStep <= 3 && (
                          <span className="ml-2 text-primary font-medium">Vale {currentQuestion.points} pontos</span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="space-y-2 md:space-y-3">
                        {currentQuestion.options.map((option) => {
                          const isSelected = answers[currentQuestion.id] === option.id
                          const result = showResult[currentQuestion.id]
                          const isCorrect = option.correct

                          let buttonClass =
                            "w-full p-3 md:p-4 text-left border-2 rounded-lg transition-all duration-200 text-sm md:text-base "

                          if (isSelected && result === "correct") {
                            buttonClass += "border-primary bg-primary/10 text-primary-foreground"
                          } else if (isSelected && result === "incorrect") {
                            buttonClass += "border-destructive bg-destructive/10 text-destructive-foreground"
                          } else if (isSelected) {
                            buttonClass += "border-accent bg-accent/10 text-accent-foreground"
                          } else {
                            buttonClass += "border-border hover:border-accent hover:bg-accent/10"
                          }

                          return (
                            <button
                              key={option.id}
                              onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                              className={buttonClass}
                              disabled={
                                result === "correct" || (currentStep <= 3 && (attempts[currentQuestion.id] || 0) >= 3)
                              }
                            >
                              <div className="flex items-center justify-between">
                                <span>{option.text}</span>
                                {isSelected && result === "correct" && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {isSelected && result === "incorrect" && <X className="w-5 h-5 text-red-600" />}
                                {currentStep > 3 && isSelected && (
                                  <span className="text-sm text-accent font-medium">+{option.points} pts</span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Try Again Button */}
                      {currentStep <= 3 &&
                        showResult[currentQuestion.id] === "incorrect" &&
                        (attempts[currentQuestion.id] || 0) < 3 && (
                          <div className="mt-3 md:mt-4 text-center px-2">
                            <Button
                              onClick={() => handleTryAgain(currentQuestion.id)}
                              variant="outline"
                              className="border-primary text-primary-foreground hover:bg-primary/10 text-xs md:text-sm px-3 py-2 w-full md:w-auto"
                            >
                              <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              <span className="break-words">
                                Tentar Novamente ({3 - (attempts[currentQuestion.id] || 0)} restantes)
                              </span>
                            </Button>
                          </div>
                        )}

                      {/* Max attempts reached */}
                      {currentStep <= 3 &&
                        (attempts[currentQuestion.id] || 0) >= 3 &&
                        showResult[currentQuestion.id] === "incorrect" && (
                          <div className="mt-3 md:mt-4 p-2 md:p-3 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-destructive-foreground text-xs md:text-sm text-center">
                              Tentativas esgotadas. A resposta correta era:{" "}
                              <strong>{currentQuestion.options.find((opt) => opt.correct)?.text}</strong>
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-2 md:gap-4 mt-4 md:mt-6">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-border text-foreground disabled:opacity-50 bg-transparent text-sm md:text-base px-3 md:px-4 py-2"
                >
                  Anterior
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentAnswerValid()}
                    className="bg-primary hover:bg-primary/80 text-white disabled:opacity-50 text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    Próxima
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isCurrentAnswerValid() || isSubmitting}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white disabled:opacity-50 text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 md:mr-2"></div>
                        <span className="text-xs md:text-sm">Calculando...</span>
                      </div>
                    ) : (
                      "Finalizar"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
