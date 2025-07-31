"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"

interface EarningsModalProps {
  isOpen: boolean
  onClose: () => void
  bookTitle: string
  readingTimeSeconds: number
  baseValue: number
}

export function EarningsModal({ isOpen, onClose, bookTitle, readingTimeSeconds, baseValue }: EarningsModalProps) {
  const [isFraud, setIsFraud] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsFraud(readingTimeSeconds < 30)
    }
  }, [isOpen, readingTimeSeconds])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modalElement = document.querySelector('[data-modal="earnings"]')
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

  if (!isOpen) return null

  // Se for fraude, mostrar tela especial
  if (isFraud) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" data-modal="earnings">
          <div className="bg-card border-b border-border p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <h2 className="text-lg font-semibold text-destructive-foreground">Possível Fraude</h2>
              <div></div>
            </div>
          </div>

          <div className="p-6">
            {/* Fraud Warning */}
            <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white mb-6 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">🚨 Possível Tentativa de Fraude</h3>
                <p className="text-lg opacity-90 mb-4">
                  Tempo de leitura: <strong>{formatTime(readingTimeSeconds)}</strong>
                </p>
                <div className="bg-foreground/10 rounded-lg p-3">
                  <p className="text-sm text-foreground/80">
                    Não é possível ler este livro em menos de 30 segundos. Por favor, leia o conteúdo com atenção.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Explanation */}
            <Card className="bg-yellow-50 border-yellow-200 mb-6">
              <CardContent className="p-4">
                <h4 className="font-semibold text-destructive-foreground mb-2">⚠️ Por que isso aconteceu?</h4>
                <ul className="text-destructive-foreground/90 text-sm space-y-1">
                  <li>• O tempo mínimo para ler este livro é de 30 segundos</li>
                  <li>• Nosso sistema detecta tentativas de burlar o sistema</li>
                  <li>• Para receber o pagamento, você deve ler o conteúdo</li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white py-4 text-lg font-medium"
              >
                Voltar ao Livro
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
