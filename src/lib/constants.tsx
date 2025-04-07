import { Globe2Icon, HomeIcon, SparklesIcon, TrophyIcon, UserIcon } from 'lucide-react'

export const MARKETING_FOOTER_LINKS = {
    Product: [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/blog', label: 'Blog' },
        { href: '/pwa', label: 'Download App' },
    ],
    Account: [
        { href: '/auth/sign-up', label: 'Sign Up' },
        { href: '/auth/sign-in', label: 'Sign In' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' },
    ],
    Resources: [
        { href: '/changelog', label: 'Changelog' },
        { href: '/help', label: 'Help Center' },
        { href: '/api-docs', label: 'API Documentation' },
        { href: 'https://futdrafts.openstatus.dev', label: 'System Status' },
    ],
    Legal: [
        { href: '/policies/privacy', label: 'Privacy Policy' },
        { href: '/policies/terms', label: 'Terms of Service' },
        { href: '/policies/cookies', label: 'Cookie Policy' },
    ],
}
export const MARKETING_FEATURES = [
    {
        icon: <Globe2Icon className="text-primary mb-4 h-8 w-8" />,
        title: '1000+ Leagues',
        description: 'Access fantasy drafts from leagues worldwide, from Premier League to Liga MX',
        isImplemented: true,
    },
    {
        icon: <TrophyIcon className="text-primary mb-4 h-8 w-8" />,
        title: 'Compete & Win',
        description: 'Create private leagues, compete with friends, and climb global leaderboards',
        isImplemented: true,
    },
    {
        icon: <SparklesIcon className="text-primary mb-4 h-8 w-8" />,
        title: 'Smart Draft AI',
        description: 'Get AI-powered insights and recommendations for your draft picks',
        isImplemented: false,
    },
]

export const DASHBOARD_NAVIGATION_ITEMS = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: HomeIcon,
        description: 'Overview and quick access',
    },
    {
        title: 'Leagues',
        href: '/dashboard/leagues',
        icon: TrophyIcon,
        description: 'Browse and join leagues',
    },
    // {
    //     title: 'Search',
    //     href: '/dashboard/search',
    //     icon: Search,
    //     description: 'Find leagues and players',
    // },
    // {
    //     title: 'Stats',
    //     href: '/dashboard/stats',
    //     icon: BarChart3Icon,
    //     description: 'Player and team statistics',
    // },
    {
        title: 'Profile',
        href: '/dashboard/profile',
        icon: UserIcon,
        description: 'Your profile and settings',
    },
]
