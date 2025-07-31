import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Beta Reader - Transforme sua paixão por livros em renda extra",
  description: "Seja pago para ler e avaliar livros incríveis. Mais de R$ 900.000 já foram pagos aos nossos leitores.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Script PRIORITÁRIO para capturar UTMs ANTES de qualquer outro script */}
        <Script id="utm-capture-priority" strategy="beforeInteractive">
          {`
            (function() {
              // Função para capturar UTMs IMEDIATAMENTE
              function captureOriginalUTMs() {
                const urlParams = new URLSearchParams(window.location.search);
                const utmData = {
                  utm_source: urlParams.get('utm_source'),
                  utm_medium: urlParams.get('utm_medium'),
                  utm_campaign: urlParams.get('utm_campaign'),
                  utm_content: urlParams.get('utm_content'),
                  utm_term: urlParams.get('utm_term'),
                  xcod: urlParams.get('xcod'),
                  timestamp: new Date().toISOString(),
                  original_url: window.location.href,
                  user_agent: navigator.userAgent,
                  referrer: document.referrer
                };
                
                // Só salvar se houver UTMs reais (não do preview)
                if (utmData.utm_source && !utmData.utm_source.includes('vusercontent.net')) {
                  localStorage.setItem('betareader_original_utms', JSON.stringify(utmData));
                  sessionStorage.setItem('betareader_session_utms', JSON.stringify(utmData));
                  console.log('✅ UTMs originais capturados e salvos:', utmData);
                  
                  // Marcar que temos UTMs válidos
                  localStorage.setItem('betareader_has_valid_utms', 'true');
                } else {
                  console.log('⚠️ UTMs ignorados (preview ou inválidos):', utmData);
                }
              }
              
              // Executar imediatamente
              captureOriginalUTMs();
              
              // Proteger contra sobrescrita do Utmify
              const originalSetItem = localStorage.setItem;
              localStorage.setItem = function(key, value) {
                // Se o Utmify tentar sobrescrever nossos UTMs, ignorar
                if (key === 'betareader_original_utms' && localStorage.getItem('betareader_has_valid_utms') === 'true') {
                  console.log('🛡️ Bloqueando tentativa de sobrescrever UTMs originais');
                  return;
                }
                return originalSetItem.apply(this, arguments);
              };
              
              // Monitorar mudanças na URL
              let currentUrl = window.location.href;
              const observer = new MutationObserver(() => {
                if (window.location.href !== currentUrl) {
                  currentUrl = window.location.href;
                  // Se a URL mudou e não temos UTMs válidos, tentar capturar novamente
                  if (localStorage.getItem('betareader_has_valid_utms') !== 'true') {
                    captureOriginalUTMs();
                  }
                }
              });
              
              observer.observe(document, { subtree: true, childList: true });
            })();
          `}
        </Script>

        {/* Pixel da Utmify para melhor trackeamento */}
        <Script id="utmify-pixel" strategy="beforeInteractive">
          {`
            window.pixelId = "687a6654b68b8e19bd9f32ea";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-48DC3LZW7F" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4T85VP4LQF');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1513606396267976');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Utmify Script – carrega por último (sem manipuladores de evento) */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          async
          defer
          strategy="lazyOnload"
        />

        {/* Meta Pixel Noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1513606396267976&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`min-h-screen bg-background text-foreground ${inter.className}`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
