import { MarketingHero } from './_hero'
import { BetaSignupForm } from './_waitlist'

export default function MarketingHomePage() {
    return (
        <div className="animate-fade-in from-background to-secondary/10 dark:from-background dark:to-secondary/5 relative min-h-screen bg-linear-to-b">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero content from MarketingHero component */}
                <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <MarketingHero />
                </div>
                <BetaSignupForm />
            </div>
        </div>
    )
}
