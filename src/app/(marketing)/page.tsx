import ThemeSwitcher from '@/components/theme-switcher'
import { MarketingHero } from './_hero'
import { MarketingFooter } from './_footer'

export default async function MarketingHomePage() {
    return (
        <main className="animate-fade-in from-background to-secondary/10 dark:from-background dark:to-secondary/5 relative min-h-screen bg-linear-to-b">
            <ThemeSwitcher className="animate-fade-in absolute top-4 right-4 sm:top-8 sm:right-8" />

            <MarketingHero />
            <MarketingFooter />
        </main>
    )
}
