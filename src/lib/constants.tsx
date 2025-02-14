import { Globe2Icon, SparklesIcon, TrophyIcon } from "lucide-react"

export const MARKETING_FOOTER_LINKS = {
    Product: [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/news', label: 'News' },
        { href: '/pwa', label: 'Download App' },
    ],
    Account: [
        { href: '/auth/sign-up', label: 'Sign Up' },
        { href: '/auth/sign-in', label: 'Sign In' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/settings', label: 'Settings' },
    ],
    Resources: [
        { href: '/help', label: 'Help Center' },
        { href: '/api-docs', label: 'API Documentation' },
        { href: '/blog', label: 'Blog' },
        { href: '/status', label: 'System Status' },
    ],
    Legal: [
        { href: '/policies/privacy', label: 'Privacy Policy' },
        { href: '/policies/terms', label: 'Terms of Service' },
        { href: '/policies/cookies', label: 'Cookie Policy' },
        { href: '/contact', label: 'Contact Us' },
    ],
}
export const MARKETING_FEATURES = [
    {
        icon: <Globe2Icon className="mb-4 h-8 w-8 text-primary" />,
        title: '1000+ Leagues',
        description: 'Access fantasy drafts from leagues worldwide, from Premier League to Liga MX',
        isImplemented: true,
    },
    {
        icon: <TrophyIcon className="mb-4 h-8 w-8 text-primary" />,
        title: 'Compete & Win',
        description: 'Create private leagues, compete with friends, and climb global leaderboards',
        isImplemented: true,
    },
    {
        icon: <SparklesIcon className="mb-4 h-8 w-8 text-primary" />,
        title: 'Smart Draft AI',
        description: 'Get AI-powered insights and recommendations for your draft picks',
        isImplemented: false,
    },
]