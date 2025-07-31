"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle, Clock, Zap, Shield, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function WithdrawPage() {
  const router = useRouter()
  const [userBalance, setUserBalance] = useState("R$ 0,00")
  const [userName, setUserName] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showActivationScreen, setShowActivationScreen] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutos
  const [remainingSlots, setRemainingSlots] = useState(7)

  useEffect(() => {
    // Scroll para o topo da página
    window.scrollTo(0, 0)

    // Carregar dados do usuário
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      setUserBalance(userData.balance || "R$ 0,00")
      setUserName(userData.name || "Usuário")
    }
  }, [])

  const handleConfirmWithdraw = async () => {
    setIsLoading(true)

    // Simular loading por 5 segundos
    await new Promise((resolve) => setTimeout(resolve, 5000))

    setIsLoading(false)
    setShowActivationScreen(true)

    // Iniciar countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleActivateAccount = () => {
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
        console.log("🚀 Redirecionando para ativação com UTMs:", utmParams)
      } catch (error) {
        console.error("❌ Erro ao processar UTMs para ativação:", error)
      }
    }

    // Redirecionar para a página de checkout LiraPay com UTMs
    const activationUrl = utmParams
      ? `https://pay.lirapaybr.com/kXDMYrBG?${utmParams}`
      : "https://pay.lirapaybr.com/kXDMYrBG"

    window.location.href = activationUrl
  }

  const canWithdraw = () => {
    const balanceNumber = Number.parseFloat(userBalance.replace("R$ ", "").replace(",", "."))
    const withdrawNumber = Number.parseFloat(withdrawAmount.replace(",", "."))
    return balanceNumber >= 10 && withdrawNumber >= 10 && withdrawNumber <= balanceNumber && pixKey.trim() !== ""
  }

  const getBalanceNumber = () => {
    return Number.parseFloat(userBalance.replace("R$ ", "").replace(",", "."))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleGoBack = () => {
    setShowActivationScreen(false)
    // Restaurar o saldo original quando voltar
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      setUserBalance(userData.balance || "R$ 0,00")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => (showActivationScreen ? handleGoBack() : router.back())}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 sm:p-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Voltar</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={120} height={24} priority />
            <div className="text-right">
              <h1 className="font-bold text-foreground text-xs sm:text-base leading-tight">Beta Reader</h1>
              <p className="text-xs text-muted-foreground leading-tight">Olá, {userName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-6 pb-16 sm:pb-20">
        {!showActivationScreen ? (
          <>
            {/* Page Header */}
            <div className="mb-4 sm:mb-8">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Carteira</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Gerencie seus ganhos e realize saques via PIX
              </p>
            </div>

            {/* Balance Card */}
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2 text-sm sm:text-base">Saldo Disponível</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">{userBalance}</p>
                {getBalanceNumber() < 10 && (
                  <div className="flex items-center justify-center space-x-2 text-destructive-foreground bg-destructive/10 rounded-lg p-2 sm:p-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-center">Valor mínimo para saque: R$ 10,00</span>
                  </div>
                )}
              </div>
            </div>

            {/* Withdraw Form */}
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="amount" className="text-foreground font-medium text-sm sm:text-base">
                  Valor do Saque <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-11 sm:h-12 text-base bg-background text-foreground"
                  placeholder="Ex: 25,50"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Valor mínimo: R$ 10,00</p>
              </div>

              <div>
                <Label htmlFor="pix" className="text-foreground font-medium text-sm sm:text-base">
                  Chave PIX <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pix"
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="mt-1 sm:mt-2 border-border focus:border-primary focus:ring-primary h-11 sm:h-12 text-base bg-background text-foreground"
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">Insira sua chave PIX para receber o pagamento</p>
              </div>

              {/* Info Box */}
              <div className="bg-accent/10 border border-accent rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-accent-foreground mb-2 text-sm sm:text-base">
                      Informações do Saque
                    </h4>
                    <ul className="text-accent-foreground/90 text-xs sm:text-sm space-y-1">
                      <li>• Processamento em até 24 horas úteis</li>
                      <li>• Sem taxas para saques via PIX</li>
                      <li>• Valor mínimo: R$ 10,00</li>
                      <li>• Máximo por dia: R$ 1.000,00</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmWithdraw}
                disabled={!canWithdraw() || isLoading}
                className="w-full bg-primary hover:bg-primary/80 text-white py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base h-12 sm:h-14 font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm sm:text-base">Processando...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Confirmar Saque via PIX
                  </>
                )}
              </Button>

              {!canWithdraw() && !isLoading && (
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  {getBalanceNumber() < 10
                    ? "Saldo insuficiente para saque"
                    : pixKey.trim() === ""
                      ? "Preencha todos os campos obrigatórios"
                      : "Verifique os dados informados"}
                </p>
              )}
            </div>
          </>
        ) : (
          /* Activation Screen */
          <div className="space-y-4 sm:space-y-6">
            {/* Status Card */}
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center">
              <p className="text-muted-foreground mb-2 sm:text-base text-base">Saldo Disponível</p>

              {/* Grid com saldo atual e valor do saque */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-accent/10 rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Saldo Atual</div>
                  <div className="text-lg sm:text-xl font-bold text-accent">{userBalance}</div>
                </div>
                <div className="bg-primary/10 rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Valor do Saque</div>
                  <div className="text-lg sm:text-xl font-bold text-primary">
                    R$ {withdrawAmount ? withdrawAmount.replace(".", ",") : "0,00"}
                  </div>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2 text-destructive-foreground">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span className="font-semibold text-xs sm:text-sm">
                    AGUARDANDO ATIVAÇÃO • {formatTime(countdown)}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-destructive via-destructive/80 to-destructive/70 text-white rounded-xl sm:rounded-2xl shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              </div>

              <div className="relative p-4 sm:p-6">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-3 animate-pulse">
                    🔥 ÚLTIMAS VAGAS HOJE
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight">OFERTA ESPECIAL</h2>
                  <p className="text-sm sm:text-lg opacity-90 leading-tight">
                    Ative sua conta com <span className="font-bold text-yellow-300">75% de desconto</span>
                  </p>
                </div>

                {/* Urgency Timer */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                    <span className="font-bold text-sm sm:text-base">Oferta expira em:</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-1">{formatTime(countdown)}</div>
                    <div className="text-xs sm:text-sm opacity-75">Não perca esta oportunidade!</div>
                  </div>
                </div>

                {/* Why Fee Explanation */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2 sm:text-base text-base">Por que existe uma taxa?</h3>
                      <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                        Para liberar seu saldo e ativar sua carteira, exigimos uma taxa única para garantir que só
                        pessoas reais recebam os saques via PIX, protegendo o sistema contra robôs e golpes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slots Remaining */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="font-semibold text-sm sm:text-base">Vagas restantes hoje:</span>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span className="text-lg sm:text-xl font-bold">{remainingSlots}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(remainingSlots / 10) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs opacity-75 text-center">⚠️ Após esgotar, a taxa volta para R$ 79,90</p>
                </div>

                {/* Price Comparison */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                    <span className="text-lg sm:text-2xl line-through opacity-60">R$ 79,90</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">R$ 19,99</span>
                      <div className="bg-yellow-400 text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full font-bold text-xs sm:text-sm">
                        75% OFF
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/20 rounded-lg p-2 sm:p-3 mb-4">
                    <p className="text-sm sm:text-lg font-semibold text-primary/80">💰 Você economiza R$ 59,91</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleActivateAccount}
                  className="w-full bg-white text-destructive hover:bg-gray-100 py-3 sm:py-4 text-base sm:text-xl font-bold mb-3 sm:mb-4 h-12 sm:h-16 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  ATIVAR CONTA - R$ 19,99
                </Button>

                {/* Final Urgency */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                    ⏰ Esta oferta é válida apenas hoje e expira em{" "}
                    <span className="font-bold text-yellow-300">{formatTime(countdown)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Card */}
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">💎 Retorno do Investimento</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Veja como seu investimento se multiplica</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="bg-destructive/10 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold text-destructive">R$ 19,99</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Investimento único</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-2 sm:p-3">
                  <div className="text-lg sm:text-2xl font-bold text-accent">
                    R$ {withdrawAmount ? withdrawAmount.replace(".", ",") : "0,00"}+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Primeiro saque</div>
                </div>
                <div className="bg-primary/10 rounded-lg p-2 sm:p-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
                  <div className="text-sm sm:text-lg font-bold text-primary">650%</div>
                  <div className="text-xs text-primary-foreground">de retorno</div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="font-semibold text-primary-foreground text-xs sm:text-sm">100% Seguro</div>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="font-semibold text-accent-foreground text-xs sm:text-sm">Protegido</div>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-border rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400 font-bold text-sm sm:text-base">7</span>
                </div>
                <div className="font-semibold text-purple-400/80 text-xs sm:text-sm">Garantia</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
