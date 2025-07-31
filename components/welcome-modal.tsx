"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ArrowRight, ArrowLeft, BookOpen, DollarSign } from "lucide-react"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

export function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const steps = [
    {
      title: `Bem-vindo, ${userName}!`,
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Você está prestes a descobrir uma nova forma de ganhar dinheiro lendo livros incríveis!
          </p>
        </div>
      ),
    },
    {
      title: "Como funciona?",
      content: (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-semibold">Leia livros selecionados</h4>
              <p className="text-sm text-muted-foreground">Escolha entre títulos cuidadosamente selecionados</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <h4 className="font-semibold">Avalie e comente</h4>
              <p className="text-sm text-muted-foreground">Compartilhe sua opinião honesta sobre cada livro</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <h4 className="font-semibold">Receba seu pagamento</h4>
              <p className="text-sm text-muted-foreground">Ganhe dinheiro por cada avaliação completa</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Pronto para começar?",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-muted-foreground">
            Seu primeiro livro já está disponível! Comece agora e ganhe seu primeiro pagamento.
          </p>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Marcar onboarding como completo
    const userData = JSON.parse(localStorage.getItem("betareader_user_data") || "{}")
    userData.onboardingCompleted = true
    localStorage.setItem("betareader_user_data", JSON.stringify(userData))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index <= currentStep ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-center mb-4">{steps[currentStep].title}</h2>
              {steps[currentStep].content}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>

              <Button onClick={handleNext} className="flex items-center space-x-2 bg-primary hover:bg-primary/80">
                <span>{currentStep === steps.length - 1 ? "Começar" : "Próximo"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
