"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Rocket, Globe, CreditCard, UserX } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [evaluatorMode, setEvaluatorMode] = useState("nacional") // nacional ou internacional
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Adicionar scroll no topo quando mudar de aba
  const setActiveTabWithScroll = (tab: string) => {
    setActiveTab(tab)
    // Scroll para o topo do modal
    setTimeout(() => {
      const modalElement = document.querySelector('[data-modal="settings"]')
      if (modalElement) {
        modalElement.scrollTop = 0
      }
    }, 50)
  }

  // Carregar dados reais do usuário quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      const savedUserData = localStorage.getItem("betareader_user_data")
      if (savedUserData) {
        const userData = JSON.parse(savedUserData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        })
        setEvaluatorMode(userData.evaluatorMode || "nacional")
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    // Validações básicas
    if (!formData.name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      alert("Email é obrigatório")
      return
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, insira um email válido")
      return
    }

    setIsLoading(true)

    // Simular salvamento (delay para mostrar loading)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Salvar alterações no localStorage
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      userData.name = formData.name.trim()
      userData.email = formData.email.trim()
      userData.phone = formData.phone.trim()
      userData.evaluatorMode = evaluatorMode
      userData.lastUpdated = new Date().toISOString()
      localStorage.setItem("betareader_user_data", JSON.stringify(userData))
    }

    setIsLoading(false)

    // Mostrar feedback de sucesso
    alert("Dados salvos com sucesso!")

    // Fechar modal
    onClose()

    // Recarregar a página para refletir as mudanças
    window.location.reload()
  }

  const handleUpgradePayment = () => {
    // Capturar UTMs antes de redirecionar
    const hasValidUtms = localStorage.getItem("betareader_has_valid_utms")
    const originalUtms = localStorage.getItem("betareader_original_utms")

    let utmParams = ""
    if (hasValidUtms === "true" && originalUtms) {
      try {
        const utmData = JSON.parse(originalUtms)
        const params = new URLSearchParams()

        if (utmData.utm_source) params.append("utm_source", utmData.utm_source)
        if (utmData.utm_medium) params.append("utm_medium", utmData.utm_medium)
        if (utmData.utm_campaign) params.append("utm_campaign", utmData.utm_campaign)
        if (utmData.utm_content) params.append("utm_content", utmData.utm_content)
        if (utmData.utm_term) params.append("utm_term", utmData.utm_term)
        if (utmData.xcod) params.append("xcod", utmData.xcod)

        utmParams = params.toString()
        console.log("🚀 Redirecionando para upgrade com UTMs:", utmParams)
      } catch (error) {
        console.error("❌ Erro ao processar UTMs para upgrade:", error)
      }
    }

    // Redirecionar para a página de checkout MundPay do upgrade com UTMs
    const upgradeUrl = utmParams
      ? `https://pay.mundpay.com/01986143-07f9-70d1-8893-0602b193f50e?ref=${utmParams}`
      : "https://pay.mundpay.com/01986143-07f9-70d1-8893-0602b193f50e?ref="

    window.location.href = upgradeUrl
  }

  const handleModeChange = (mode: string) => {
    setEvaluatorMode(mode)
  }

  const handleDeleteAccount = () => {
    // Limpar todos os dados do localStorage
    localStorage.removeItem("betareader_user_data")

    // Fechar modal
    onClose()

    alert("Conta excluída com sucesso. Você será redirecionado para a página inicial.")

    // Redirecionar para página inicial
    window.location.href = "/"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-background rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        data-modal="settings"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Configurações</h2>
          <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-card rounded-lg p-1">
          <button
            onClick={() => setActiveTabWithScroll("profile")}
            disabled={isLoading}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              activeTab === "profile"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTabWithScroll("preferences")}
            disabled={isLoading}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
              activeTab === "preferences"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preferências
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "profile" && (
            <>
              {/* Profile Tab */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Editar Perfil Beta Reader</h3>
                    <p className="text-sm text-muted-foreground">Atualize suas informações pessoais</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nome Completo: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-2 border-border focus:border-primary focus:ring-primary text-base"
                    placeholder="Seu nome completo"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-2 border-border focus:border-primary focus:ring-primary text-base"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Telefone:
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-2 border-border focus:border-primary focus:ring-primary text-base"
                    placeholder="(11) 99999-9999"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Opcional - usado para contato em caso de problemas</p>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive">
                    <div className="flex items-center space-x-2">
                      <UserX className="w-4 h-4 text-red-600" />
                      <div>
                        <h3 className="font-medium text-red-800 text-sm">Excluir Conta</h3>
                        <p className="text-xs text-red-700">Ação irreversível</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDeleteAccount}
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive-foreground hover:bg-destructive/10 bg-transparent text-xs px-3 py-1"
                      disabled={isLoading}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "preferences" && (
            <>
              {/* Preferences Tab */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Modo de Avaliador</h4>

                  {/* Avaliador Nacional */}
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      evaluatorMode === "nacional"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-green-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isLoading && handleModeChange("nacional")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h5 className="font-semibold text-foreground">Avaliador Nacional</h5>
                      </div>
                      {evaluatorMode === "nacional" && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary-foreground">
                          Ativo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Livros em português • Pagamento em R$</p>
                  </div>

                  {/* Avaliador Internacional */}
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      evaluatorMode === "internacional"
                        ? "border-accent bg-accent/10"
                        : "border-gray-200 hover:border-blue-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (isLoading) return

                      if (evaluatorMode === "internacional") {
                        // Se já é internacional, pode voltar para nacional
                        handleModeChange("nacional")
                      } else {
                        // Se não é internacional, mostrar modal de upgrade
                        setShowUpgradeModal(true)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <h5 className="font-semibold text-foreground">Avaliador Internacional</h5>
                      </div>
                      {evaluatorMode === "internacional" ? (
                        <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-primary text-primary">
                          Upgrade
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Livros em inglês • Pagamento em USD</p>
                    {evaluatorMode === "internacional" && (
                      <p className="text-xs text-blue-600 mt-2">Clique para voltar ao modo Nacional</p>
                    )}
                  </div>

                  {/* Upgrade Modal */}
                  {showUpgradeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-black">Upgrade para Internacional</h3>
                          <p className="text-sm text-green-700">
                            Libere sua conta para avaliar livros em inglês e receber pagamentos em dólares. Acesse uma
                            nova biblioteca de livros internacionais!
                          </p>
                        </div>

                        <div className="bg-accent/10 rounded-lg p-4 mb-6">
                          <div className="text-center">
                            <div className="text-sm mb-1 text-teal-800">Taxa de upgrade:</div>
                            <div className="text-2xl font-bold text-accent mb-2">R$ 39,99</div>
                            <div className="text-xs text-gray-500">Pagamento único via PIX</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={handleUpgradePayment}
                            className="w-full bg-accent hover:bg-accent/80 text-white py-3"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pagar com PIX
                          </Button>

                          <Button
                            onClick={() => setShowUpgradeModal(false)}
                            variant="outline"
                            className="w-full border-border text-foreground"
                          >
                            Cancelar
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-4">
                          * Após o pagamento via PIX, sua conta será automaticamente atualizada.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-accent">
                  <div className="flex items-center mb-3">
                    <Rocket className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-semibold text-blue-800">Novidades em Breve</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Muitas funções e áreas ainda serão desbloqueadas conforme você sobe de pontuação!
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Notificações</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-border" defaultChecked disabled={isLoading} />
                      <span className="text-sm text-foreground">Novos livros disponíveis</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-border" defaultChecked disabled={isLoading} />
                      <span className="text-sm text-foreground">Pagamentos processados</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-border" disabled={isLoading} />
                      <span className="text-sm text-foreground">Newsletter semanal</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-card bg-transparent"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/80 text-white disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Salvando...
              </div>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          <span className="text-red-500">*</span> Campos obrigatórios
        </p>
      </div>
    </div>
  )
}
