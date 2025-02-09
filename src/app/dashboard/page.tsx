import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <nav className="flex flex-wrap justify-center gap-4">
                <Link
                    href="/"
                    className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                >
                    Home
                </Link>
                <Link
                    href="/news"
                    className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                >
                    News
                </Link>
            </nav>
        </div>
    )
}
