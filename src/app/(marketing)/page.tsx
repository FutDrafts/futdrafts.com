import Link from 'next/link'

export default function MarketingHomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
            <h1 className="text-4xl font-bold">Welcome to FutDraft</h1>
            <nav className="flex flex-wrap justify-center gap-4">
                <Link
                    href="/auth/sign-in"
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                    Sign In
                </Link>
                <Link
                    href="/dashboard"
                    className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                >
                    Dashboard
                </Link>
                <Link
                    href="/news"
                    className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                >
                    News
                </Link>
                <Link
                    href="/pwa"
                    className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                >
                    Install App
                </Link>
            </nav>
        </main>
    )
}
