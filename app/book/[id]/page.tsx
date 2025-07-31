"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { EarningsModal } from "@/components/earnings-modal"
import { QuestionsModal } from "@/components/questions-modal"

export default function BookReading({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [readingTime, setReadingTime] = useState(0)
  const [finalReadingTime, setFinalReadingTime] = useState(0)
  const [showEarningsModal, setShowEarningsModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [calculatedValue, setCalculatedValue] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Adicionar useEffect para scroll no topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setReadingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFinishReading = () => {
    // Verificar fraude (menos de 30 segundos)
    if (readingTime < 30) {
      setIsTimerActive(false)
      setFinalReadingTime(readingTime)
      setCalculatedValue(-1) // Valor especial para fraude
      setShowEarningsModal(true)
      return
    }

    // Parar o timer e ir direto para as perguntas
    setIsTimerActive(false)
    setFinalReadingTime(readingTime)
    setShowQuestionsModal(true)
  }

  // Melhorar o handleCloseModals para garantir scroll no topo
  const handleCloseModals = () => {
    setShowEarningsModal(false)
    setShowQuestionsModal(false)

    // Reiniciar tudo quando voltar para o livro
    setReadingTime(0)
    setFinalReadingTime(0)
    setIsTimerActive(true)

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-10">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Voltar</span>
            </Button>

            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono text-sm">
                {formatTime(finalReadingTime > 0 ? finalReadingTime : readingTime)}
              </span>
              {!isTimerActive && finalReadingTime > 0 && (
                <span className="ml-2 text-primary font-medium hidden sm:inline">Finalizado</span>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Scrollable Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Book Info */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">As Sombras de Eldoria</h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">por Marina Silvestre</p>
            <Badge variant="outline" className="mb-4 sm:mb-6 text-xs sm:text-sm border-primary text-primary">
              Fantasia Épica
            </Badge>

            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3">Sinopse</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Em um reino onde a magia está desaparecendo, uma jovem escriba descobre um antigo segredo que pode
                salvar ou destruir tudo o que conhece. Entre dragões adormecidos e profecias esquecidas, Lyra deve
                escolher entre o poder e a sabedoria.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Book Content */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Conteúdo do Livro</h2>

            <div className="prose prose-sm sm:prose prose-invert max-w-none text-foreground leading-relaxed space-y-3 sm:space-y-4">
              <p>
                O vento sussurrava segredos antigos através das torres de cristal de Eldoria, carregando consigo o aroma
                de pergaminhos envelhecidos e a promessa de tempestades distantes. Lyra ajustou seus óculos de leitura e
                mergulhou mais fundo na penumbra da Grande Biblioteca, onde as sombras dançavam entre estantes que se
                perdiam nas alturas nebulosas do teto abobadado.
              </p>

              <p>
                Havia três dias que ela não dormia adequadamente, consumida pela descoberta que fizera nos arquivos
                proibidos. O manuscrito que agora repousava diante dela, escrito em runas que pulsavam com uma luz fraca
                e dourada, continha revelações que poderiam abalar os próprios alicerces do reino. As palavras pareciam
                se mover na página, reorganizando-se conforme ela lia, como se a própria magia estivesse viva dentro do
                pergaminho.
              </p>

              <p>
                'Os Últimos Dias da Era Dourada', lia o título em caracteres que mudavam de cor conforme a luz
                incidente. O texto falava de um tempo em que dragões e humanos viviam em harmonia, quando a magia fluía
                livremente pelas veias da terra como rios de luz líquida. Mas algo havia acontecido, algo terrível que
                forçara os dragões a um sono profundo e fizera a magia definhar como flores no inverno.
              </p>

              <p>
                Lyra virou a página com dedos trêmulos. Ali estava o que ela mais temia encontrar: a Profecia da Escolha
                Final. Segundo o texto, quando a magia estivesse quase extinta, um Escriba Escolhido emergiria para
                despertar os dragões adormecidos. Mas o despertar viria com um preço - o Escolhido deveria sacrificar
                sua própria essência mágica para restaurar o equilíbrio, ou assistir ao mundo mergulhar em uma era de
                trevas eternas.
              </p>

              <p>
                O som de passos ecoando pelos corredores de mármore fez Lyra erguer a cabeça bruscamente. Ela reconheceu
                imediatamente o caminhar pesado e determinado do Grão-Mestre Aldric, o guardião dos segredos mais
                profundos da biblioteca. Rapidamente, ela fechou o manuscrito e o escondeu entre outros tomos menos
                controversos, fingindo estudar um tratado sobre herbologia élfica.
              </p>

              <p>
                'Trabalhando até tarde novamente, jovem Lyra?' A voz grave de Aldric ecoou entre as estantes, carregando
                uma nota de preocupação paternal. Ele emergiu das sombras como um fantasma benevolente, sua barba
                prateada brilhando sob a luz mágica das velas flutuantes.
              </p>

              <p>
                'Os estudos sobre as antigas línguas requerem dedicação, Mestre', respondeu ela, tentando manter a voz
                firme. 'Há tanto conhecimento perdido esperando para ser redescoberto.'
              </p>

              <p>
                Aldric aproximou-se, seus olhos azuis penetrantes parecendo ver através da fachada que ela tentava
                manter. 'Conhecimento perdido pode ser perigoso, criança. Alguns segredos foram enterrados por boas
                razões.' Ele fez uma pausa, observando-a com atenção. 'Você tem sentido... mudanças ultimamente? Sonhos
                estranhos? Visões?'
              </p>

              <p>
                O coração de Lyra acelerou. Como ele poderia saber sobre os sonhos? Sobre as imagens de dragões dourados
                que visitavam seu sono, sussurrando palavras em línguas que ela não deveria compreender, mas
                compreendia? Sobre a sensação crescente de que algo antigo e poderoso estava despertando dentro dela?
              </p>

              <p>'Eu... não sei do que está falando, Mestre', mentiu ela, mas sua voz traiu sua incerteza.</p>

              <p>
                Aldric suspirou profundamente, como se carregasse o peso de séculos em seus ombros. 'A magia está
                morrendo, Lyra. Você deve ter notado - os cristais de luz estão perdendo seu brilho, as poções dos
                curandeiros estão falhando, até mesmo os pergaminhos auto-escreventes estão ficando mudos.' Ele se
                aproximou mais, baixando a voz para um sussurro conspiratório. 'Mas há sinais de que algo está mudando.
                Energias antigas estão se movendo nas profundezas da terra.'
              </p>

              <p>Lyra sentiu um arrepio percorrer sua espinha. 'O que isso significa?'</p>

              <p>
                'Significa que o tempo das escolhas difíceis está chegando', respondeu Aldric, seus olhos fixos nos
                dela. 'E que alguns de nós podem ser chamados a fazer sacrifícios que nunca imaginamos.'
              </p>

              <p>
                Naquela noite, sozinha em seus aposentos na torre dos escribas, Lyra não conseguiu afastar os
                pensamentos sobre a conversa com Aldric. Ela sabia que ele suspeitava de algo, talvez até soubesse sobre
                sua descoberta do manuscrito proibido. Mas havia algo mais em seus olhos, uma mistura de medo e
                esperança que a deixava inquieta.
              </p>

              <p>
                Quando finalmente conseguiu adormecer, os sonhos vieram com mais intensidade do que nunca. Ela se viu
                voando sobre paisagens que não existiam mais, montada nas costas de um dragão dourado cujas escamas
                brilhavam como sol líquido. Abaixo deles, florestas de árvores cristalinas se estendiam até o horizonte,
                e rios de luz pura serpenteavam pela terra como veias de prata.
              </p>

              <p>
                'O tempo está chegando, Escriba', disse o dragão, sua voz ressoando diretamente em sua mente. 'A escolha
                que definirá o destino de todos nós está próxima. Você está preparada para pagar o preço da salvação?'
              </p>

              <p>
                Lyra acordou com lágrimas nos olhos e uma certeza terrível no coração. Ela era a Escriba Escolhida da
                profecia, e em breve teria que decidir entre salvar o mundo que amava ou preservar sua própria vida. A
                magia de Eldoria dependia de sua escolha, e o tempo estava se esgotando.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Finish Reading Button */}
        <div className="text-center pb-6 sm:pb-8">
          <Button
            onClick={handleFinishReading}
            disabled={!isTimerActive}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {!isTimerActive ? "Leitura Finalizada" : "Finalizar Leitura e Avaliar"}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EarningsModal
        isOpen={showEarningsModal}
        onClose={handleCloseModals}
        bookTitle="As Sombras de Eldoria"
        readingTimeSeconds={finalReadingTime}
        baseValue={30.0}
      />

      <QuestionsModal
        isOpen={showQuestionsModal}
        onClose={handleCloseModals}
        bookTitle="As Sombras de Eldoria"
        readingTimeSeconds={finalReadingTime}
        baseValue={30.0}
      />
    </div>
  )
}
