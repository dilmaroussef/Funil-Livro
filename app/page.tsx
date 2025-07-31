"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Shield, Clock } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Verificar se usuário está logado
    const savedUserData = localStorage.getItem("betareader_user_data")
    if (savedUserData) {
      const userData = JSON.parse(savedUserData)
      if (userData.isLoggedIn) {
        // Se estiver logado, redirecionar para dashboard
        window.location.href = "/dashboard"
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/50 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-primary/80 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    )
  }

  const switchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const switchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const closeAllModals = () => {
    setShowLoginModal(false)
    setShowRegisterModal(false)
  }

  const faqItems = [
    {
      question: "Como o ReadCash funciona?",
      answer:
        "Você se cadastra gratuitamente, escolhe um livro da nossa biblioteca e escreve uma avaliação honesta. Após a análise da equipe, você recebe o pagamento via PIX.",
    },
    {
      question: "Eu realmente recebo dinheiro?",
      answer:
        "Sim! Assim que sua avaliação é aprovada, o valor é liberado para saque. Já pagamos mais de R$900.000 aos nossos leitores ativos.",
    },
    {
      question: "Quais livros eu posso escolher?",
      answer:
        "Temos uma biblioteca com centenas de títulos, de ficção a não-ficção. Os livros disponíveis são atualizados frequentemente.",
    },
    {
      question: "Preciso pagar alguma taxa para participar?",
      answer: "Não. O cadastro é 100% gratuito e não cobramos nenhuma taxa para você começar a ler e ganhar.",
    },
    {
      question: "Em quanto tempo recebo o pagamento?",
      answer:
        "Se sua conta já estiver ativada, o prazo médio é de até 48h após sua avaliação ser aprovada. Os pagamentos são feitos via PIX, direto para sua conta bancária. Caso ainda não tenha ativado sua conta, será necessário realizar esse processo antes do primeiro saque.",
    },
    {
      question: "Posso fazer várias avaliações?",
      answer:
        "Sim! Quanto mais livros você avalia com qualidade, mais pode ganhar. Leitores experientes fazem dezenas de avaliações por mês.",
    },
    {
      question: "É seguro? Meus dados estão protegidos?",
      answer:
        "Totalmente. Usamos criptografia e tecnologia segura para proteger suas informações. Nenhum dado é compartilhado.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={160} height={32} priority />
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:text-primary hover:bg-primary/10 transition-all duration-200 text-sm px-2 py-1 sm:text-base sm:px-4 sm:py-2 h-8 sm:h-auto"
                onClick={() => setShowLoginModal(true)}
              >
                Entrar
              </Button>
              <Button
                className="bg-[#10B981] hover:bg-[#34D399] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm px-3 py-1 sm:text-base sm:px-4 sm:py-2 h-8 sm:h-auto rounded-md"
                onClick={() => setShowRegisterModal(true)}
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main
        className="relative pt-14 sm:pt-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/hero-background.jpg")' }}
      >
        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Security Badge */}
          <div className="flex justify-center pt-6 sm:pt-8 lg:pt-12">
            <div className="flex items-center bg-primary/10 border border-primary/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-1.5 sm:mr-2" />
              <span className="text-primary-foreground text-xs sm:text-sm font-medium">100% Segura</span>
            </div>
          </div>

          {/* Main Hero */}
          <div className="text-center py-8 sm:py-12 lg:py-16 xl:py-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-extrabold text-foreground mb-4 sm:mb-6 leading-tight px-2">
              Transforme sua
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                paixão por livros
              </span>
              <br />
              em renda extra
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-3 sm:px-4">
              Seja pago para ler e avaliar livros incríveis. Mais de R$ 900.000 já foram pagos aos nossos leitores.
              Junte-se à maior comunidade de beta readers do Brasil.
            </p>

            <Button
              className="bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#34D399] hover:to-[#10B981] text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full mb-6 sm:mb-8 shadow-[0_0_15px_rgba(15,118,110,0.6)] hover:shadow-[0_0_20px_rgba(15,118,110,0.8)] transition-all duration-200 transform hover:scale-105 w-full max-w-xs sm:w-auto"
              onClick={() => setShowRegisterModal(true)}
            >
              Começar Agora - É Grátis
            </Button>

            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm text-muted-foreground px-3 sm:px-4">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1.5 sm:mr-2"></div>
                <span>Sem taxas de inscrição</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1.5 sm:mr-2"></div>
                <span>3.500+ leitores ativos</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1.5 sm:mr-2"></div>
                <span>4.9/5 avaliação</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mr-1.5 sm:mr-2"></div>
                <span>100% seguro</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 py-8 sm:py-12 lg:py-16 border-t border-border">
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 sm:mb-2">
                R$ 900.000+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">Pagos aos leitores</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 sm:mb-2">
                3.500+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">Leitores ativos</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 sm:mb-2">
                15.000+
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">Avaliações publicadas</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all duration-200">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 sm:mb-2">
                R$ 50-900
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm lg:text-base">Por avaliação</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="py-8 sm:py-12 lg:py-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center mb-3 sm:mb-4 px-3">
              O que nossos leitores dizem
            </h2>
            <p className="text-muted-foreground text-center mb-6 sm:mb-8 lg:mb-12 px-3 sm:px-4 text-sm sm:text-base">
              Histórias reais de pessoas que transformaram sua paixão por livros em renda extra
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Image
                      src="/images/avatars/alana-assis.png"
                      alt="Alana Assis"
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 shadow-md border border-white"
                    />
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">Alana Assis</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Beta Reader</div>
                    </div>
                  </div>
                  <p className="text-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    "Já ganhei mais de R$ 800 lendo livros que eu realmente amo. A plataforma é confiável e os
                    pagamentos são pontuais. Recomendo!"
                  </p>
                  <div className="text-primary font-semibold bg-primary/10 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm inline-block">
                    Total ganho: R$ 847
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Image
                      src="/images/avatars/leonardo-sucegan.jpeg"
                      alt="Leonardo Sucegan"
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 shadow-md border border-white"
                    />
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">Leonardo Sucegan</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Leitor Experiente</div>
                    </div>
                  </div>
                  <p className="text-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    "Como estudante, essa renda extra faz toda diferença. Consigo pagar meus livros universitários lendo
                    outros livros. Genial!"
                  </p>
                  <div className="text-primary font-semibold bg-primary/10 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm inline-block">
                    Total ganho: R$ 623
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Image
                      src="/images/avatars/michele-senhoreli.jpeg"
                      alt="Michele Senhoreli"
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 shadow-md border border-white"
                    />
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">Michele Senhoreli</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Avaliadora Expert</div>
                    </div>
                  </div>
                  <p className="text-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                    "Descobri uma nova paixão e ainda ganho dinheiro com isso. Os livros são de qualidade e o processo é
                    muito simples."
                  </p>
                  <div className="text-primary font-semibold bg-primary/10 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm inline-block">
                    Total ganho: R$ 1.234
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it Works */}
          <div className="py-8 sm:py-12 lg:py-16 bg-card/60 backdrop-blur-sm rounded-3xl px-4 sm:px-6 lg:px-8 my-8 sm:my-12 lg:my-16 border border-border shadow-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center mb-3 sm:mb-4 px-2">
              Como funciona? É simples!
            </h2>
            <p className="text-muted-foreground text-center mb-6 sm:mb-8 lg:mb-12 px-3 sm:px-4 text-sm sm:text-base">
              Processo transparente e direto para você começar a ganhar dinheiro hoje mesmo
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-110">
                  01
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Cadastre-se Grátis
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Crie sua conta em menos de 2 minutos. Sem taxas, sem pegadinhas.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-110">
                  02
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Escolha um Livro
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Navegue por nossa biblioteca com mais de 500 títulos de qualidade.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-110">
                  03
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Leia e Avalie
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Escreva uma resenha honesta e detalhada. Mínimo de 300 caracteres.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-200 transform group-hover:scale-110">
                  04
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Receba o Pagamento
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Ganhe R$ X por avaliação. Saque via PIX instantâneo.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-8 sm:py-12 lg:py-16 bg-card/60 backdrop-blur-sm rounded-3xl px-4 sm:px-6 lg:px-8 my-8 sm:my-12 lg:my-16 border border-border shadow-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-6 sm:mb-8 px-2">
              📖 Dúvidas Frequentes
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
                  <AccordionTrigger className="text-white text-left text-base sm:text-lg hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#E4E4E7] text-sm sm:text-base pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background text-white px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="md:col-span-2">
              <Image
                src="/images/readcash-logo.png"
                alt="ReadCash Logo"
                width={160}
                height={32}
                priority
                className="mb-3 sm:mb-4"
              />
              <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                A maior plataforma de beta reading do Brasil. Transforme sua paixão por livros em renda extra de forma
                segura e confiável.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-primary" />
                <span className="text-sm sm:text-base text-muted-foreground">Pagamentos Seguros</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-accent" />
                <span className="text-sm sm:text-base text-muted-foreground">Suporte 24/7</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-yellow-400" />
                <span className="text-sm sm:text-base text-muted-foreground">Certificado de Qualidade</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              © 2024 Beta Reader Go. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={showLoginModal} onClose={closeAllModals} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={showRegisterModal} onClose={closeAllModals} onSwitchToLogin={switchToLogin} />
    </div>
  )
}
