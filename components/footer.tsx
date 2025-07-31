import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="container flex flex-col items-center justify-center px-4 md:px-6 text-center">
        <Link href="/" className="mb-4">
          <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={120} height={24} />
        </Link>
        <p className="text-sm text-muted-foreground mb-2">
          &copy; {"new Date().getFullYear()"} ReadCash. Todos os direitos reservados.
        </p>
        <nav className="flex space-x-4 text-sm">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Política de Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  )
}
