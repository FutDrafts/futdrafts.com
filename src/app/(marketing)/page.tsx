import { MarketingHero } from './_hero'
import { BetaSignupForm } from './_waitlist'

export default function MarketingPage() {
    return (
        <main>
            <h1 className="sr-only">FUT Drafts - Ultimate Team Draft Simulator</h1>
            <MarketingHero />
            <div className="animate-fade-in from-background to-secondary/10 dark:from-background dark:to-secondary/5 relative min-h-screen bg-linear-to-b">
                <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center space-y-8 text-center">
                        <BetaSignupForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
