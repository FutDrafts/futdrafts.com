import { MarketingFooter } from './_footer'
import { MarketingNavbar } from './_navbar'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <MarketingNavbar />
            <main className="flex-1">{children}</main>
            <MarketingFooter />
        </div>
    )
}
