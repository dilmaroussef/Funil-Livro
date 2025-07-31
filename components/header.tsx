import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background py-4">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/readcash-logo.png" alt="ReadCash Logo" width={160} height={32} priority />
        </Link>
        {/* You can add navigation links or other elements here if needed */}
        <nav className="flex items-center space-x-4">
          {/* Example: <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary">Dashboard</Link> */}
        </nav>
      </div>
    </header>
  )
}
