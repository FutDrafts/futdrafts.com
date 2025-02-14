import ThemeSwitcher from '@/components/theme-switcher'
import { MarketingHero } from './_hero'
import { MarketingFooter } from './_footer'

export default async function MarketingHomePage() {
    return (
        <main className="animate-fade-in relative min-h-screen bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-secondary/5">
            <ThemeSwitcher className="animate-fade-in absolute right-4 top-4 sm:right-8 sm:top-8" />

            <MarketingHero/>
            <MarketingFooter/>
        </main>
    )
}
