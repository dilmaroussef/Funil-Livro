"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modalElement = document.querySelector('[data-modal="login"]')
        if (modalElement) {
          modalElement.scrollTop = 0
        }
      }, 50)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular processo de login
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Capturar UTMs originais salvos com prioridade
    let utmData = null

    // Primeiro, tentar pegar os UTMs originais protegidos
    const originalUtms = localStorage.getItem("betareader_original_utms")
    const sessionUtms = sessionStorage.getItem("betareader_session_utms")
    const hasValidUtms = localStorage.getItem("betareader_has_valid_utms")

    if (hasValidUtms === "true" && originalUtms) {
      try {
        utmData = JSON.parse(originalUtms)
        console.log("✅ Login - Usando UTMs originais protegidos:", utmData)
      } catch (error) {
        console.error("❌ Erro ao parsear UTMs originais no login:", error)
      }
    } else if (sessionUtms) {
      try {
        utmData = JSON.parse(sessionUtms)
        console.log("⚠️ Login - Usando UTMs da sessão:", utmData)
      } catch (error) {
        console.error("❌ Erro ao parsear UTMs da sessão no login:", error)
      }
    }

    // Simular dados do usuário existente
    const userData = {
      name: "João Silva",
      email: formData.email,
      phone: "(11) 99999-9999",
      registrationDate: "2024-01-15T10:30:00.000Z",
      lastLogin: new Date().toISOString(),
      balance: "R$ 247,50",
      booksRead: 12,
      points: 850,
      isLoggedIn: true,
      // Preservar UTMs se disponíveis
      originalUtms: utmData,
      loginSource: utmData
        ? {
            source: utmData.utm_source,
            medium: utmData.utm_medium,
            campaign: utmData.utm_campaign,
            content: utmData.utm_content,
            term: utmData.utm_term,
            xcod: utmData.xcod,
            timestamp: utmData.timestamp,
            original_url: utmData.original_url,
          }
        : null,
    }

    localStorage.setItem("betareader_user_data", JSON.stringify(userData))

    // Log detalhado para debug
    console.log("🔐 Usuário logado:", {
      name: userData.name,
      email: userData.email,
      utms: userData.loginSource,
    })

    // Fechar modal
    onClose()

    // Redirecionar para dashboard
    router.push("/dashboard")

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div
        className="bg-background rounded-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
        data-modal="login"
      >
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={onClose}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Voltar</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Entrar na sua conta</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Bem-vindo de volta!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
              Email:
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-12 sm:h-11 text-base sm:text-base"
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">
              Senha:
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-12 sm:h-11 text-base sm:text-base pr-10"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button type="button" className="text-primary hover:text-primary/80 transition-colors" disabled={isLoading}>
              Esqueceu a senha?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/80 text-white py-2 sm:py-3 text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed h-10 sm:h-12"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm sm:text-base">Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Não tem uma conta?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isLoading}
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
