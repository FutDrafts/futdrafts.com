'use client'

import Link from 'next/link'
import { Globe2, Trophy, Sparkles, ArrowRight, Star } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ThemeSwitcher from '@/components/theme-switcher'

export default function MarketingHomePage() {
    const currentYear = new Date().getFullYear() || '2025'
    const footerLinks = {
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
    const features = [
        {
            icon: <Globe2 className="mb-4 h-8 w-8 text-primary" />,
            title: '1000+ Leagues',
            description: 'Access fantasy drafts from leagues worldwide, from Premier League to Liga MX',
            isImplemented: true,
        },
        {
            icon: <Trophy className="mb-4 h-8 w-8 text-primary" />,
            title: 'Compete & Win',
            description: 'Create private leagues, compete with friends, and climb global leaderboards',
            isImplemented: true,
        },
        {
            icon: <Sparkles className="mb-4 h-8 w-8 text-primary" />,
            title: 'Smart Draft AI',
            description: 'Get AI-powered insights and recommendations for your draft picks',
            isImplemented: false,
        },
    ]

    return (
        <main className="animate-fade-in relative min-h-screen bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-secondary/5">
            <ThemeSwitcher className="animate-fade-in absolute right-4 top-4 sm:right-8 sm:top-8" />

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="mb-4 animate-bounce">
                            <Star className="mx-auto h-16 w-16 text-primary" />
                        </div>
                        <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight [animation-delay:200ms] sm:text-5xl md:text-6xl">
                            <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent dark:from-primary dark:via-purple-400 dark:to-primary">
                                FutDrafts
                            </span>
                        </h1>
                        <p className="animate-fade-up mx-auto max-w-2xl text-xl text-muted-foreground [animation-delay:400ms] sm:text-2xl">
                            Your Ultimate Global Fantasy Soccer Experience
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="animate-fade-up [animation-delay:600ms]">
                            <Link
                                href="/auth/sign-up"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="animate-fade-up [animation-delay:600ms]">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-background/50 px-8 py-3 font-medium backdrop-blur-sm transition hover:bg-primary/10 dark:border-primary/10 dark:hover:bg-primary/20"
                            >
                                View Demo
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`animate-fade-up rounded-xl border border-primary/10 bg-background/50 p-6 backdrop-blur-sm transition hover:border-primary/30 hover:shadow-lg dark:bg-background/30 dark:hover:border-primary/20 dark:hover:bg-background/40 [animation-delay:${800 + index * 200}ms]`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="transition-transform hover:scale-105">{feature.icon}</div>
                                    {!feature.isImplemented && (
                                        <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-1 text-xs font-medium text-primary dark:bg-primary/25">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 rounded-2xl bg-secondary/10 p-8 dark:bg-secondary/5">
                        {[
                            { value: '1000+', label: 'Global Leagues' },
                            { value: '100K+', label: 'Active Users' },
                            { value: '24/7', label: 'Live Updates' },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`animate-fade-up text-center [animation-delay:${1400 + index * 200}ms]`}
                            >
                                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer className="mt-24 border-t border-primary/10 bg-secondary/5 py-16 dark:border-primary/5 dark:bg-secondary/[0.02]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Footer with Accordion */}
                    <div className="sm:hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {Object.entries(footerLinks).map(([category, links]) => (
                                <AccordionItem value={category} key={category}>
                                    <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {links.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className="block py-2 transition hover:text-primary"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Desktop Footer with Grid */}
                    <div className="hidden gap-8 sm:grid sm:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(footerLinks).map(([category, links], index) => (
                            <div
                                key={category}
                                className="animate-fade-up space-y-4"
                                style={{ animationDelay: `${1800 + index * 200}ms` }}
                            >
                                <h4 className="text-lg font-semibold">{category}</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="transition hover:text-primary">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="animate-fade-up mt-16 border-t border-primary/10 pt-8 text-center text-sm text-muted-foreground [animation-delay:2600ms]">
                        <p>© {currentYear} FutDrafts. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
