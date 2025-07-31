"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modalElement = document.querySelector('[data-modal="register"]')
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

    // Simular processo de cadastro
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
        console.log("✅ Usando UTMs originais protegidos:", utmData)
      } catch (error) {
        console.error("❌ Erro ao parsear UTMs originais:", error)
      }
    } else if (sessionUtms) {
      try {
        utmData = JSON.parse(sessionUtms)
        console.log("⚠️ Usando UTMs da sessão:", utmData)
      } catch (error) {
        console.error("❌ Erro ao parsear UTMs da sessão:", error)
      }
    }

    // Se não temos UTMs salvos, tentar capturar da URL atual
    if (!utmData) {
      const urlParams = new URLSearchParams(window.location.search)
      const currentUtms = {
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        utm_content: urlParams.get("utm_content"),
        utm_term: urlParams.get("utm_term"),
        xcod: urlParams.get("xcod"),
        timestamp: new Date().toISOString(),
        original_url: window.location.href,
      }

      // Só usar se não for do preview
      if (currentUtms.utm_source && !currentUtms.utm_source.includes("vusercontent.net")) {
        utmData = currentUtms
        console.log("📍 Usando UTMs da URL atual:", utmData)
      }
    }

    // Salvar dados do usuário no localStorage
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      balance: "R$ 0.00",
      booksRead: 0,
      points: 0,
      isLoggedIn: true,
      // Preservar UTMs originais
      originalUtms: utmData,
      registrationSource: utmData
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
    console.log("👤 Usuário cadastrado:", {
      name: userData.name,
      email: userData.email,
      utms: userData.registrationSource,
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
        data-modal="register"
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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Criar Conta</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Junte-se à comunidade de beta readers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">
              Nome:
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-12 sm:h-11 text-base sm:text-base"
              placeholder="Seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="phone" className="text-foreground font-medium text-sm sm:text-base">
              Telefone:
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-12 sm:h-11 text-base sm:text-base"
              placeholder="(11) 99999-9999"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">
              Senha:
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-12 sm:h-11 text-base sm:text-base"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/80 text-white py-2 sm:py-3 text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed h-10 sm:h-12"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm sm:text-base">Criando conta...</span>
              </div>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Já tem uma conta?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isLoading}
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
