import { MARKETING_FEATURES } from '@/lib/constants'
import { ArrowRightIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'

export function MarketingHero() {
    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
                <div className="space-y-4">
                    <div className="mb-4 animate-bounce">
                        <StarIcon className="text-primary mx-auto h-16 w-16" />
                    </div>
                    <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight [animation-delay:200ms] sm:text-5xl md:text-6xl">
                        <span className="from-primary to-primary dark:from-primary dark:to-primary bg-linear-to-r via-purple-600 bg-clip-text text-transparent dark:via-purple-400">
                            FutDrafts
                        </span>
                    </h1>
                    <p className="animate-fade-up text-muted-foreground mx-auto max-w-2xl text-xl [animation-delay:400ms] sm:text-2xl">
                        Your Ultimate Global Fantasy Soccer Experience
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="animate-fade-up [animation-delay:600ms]">
                        <Link
                            href="/auth/sign-up"
                            className="group bg-primary text-primary-foreground hover:bg-primary/90 relative inline-flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-medium transition"
                        >
                            Get Started
                            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="animate-fade-up [animation-delay:600ms]">
                        <Link
                            href="/dashboard"
                            className="border-primary/20 bg-background/50 hover:bg-primary/10 dark:border-primary/10 dark:hover:bg-primary/20 inline-flex items-center justify-center rounded-lg border px-8 py-3 font-medium backdrop-blur-xs transition"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {MARKETING_FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className={`animate-fade-up border-primary/10 bg-background/50 hover:border-primary/30 dark:bg-background/30 dark:hover:border-primary/20 dark:hover:bg-background/40 rounded-xl border p-6 backdrop-blur-xs transition hover:shadow-lg [animation-delay:${800 + index * 200}ms]`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="transition-transform hover:scale-105">{feature.icon}</div>
                                {!feature.isImplemented && (
                                    <span className="bg-primary/15 text-primary dark:bg-primary/25 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
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
                <div className="bg-secondary/10 dark:bg-secondary/5 mt-16 flex flex-wrap justify-center gap-8 rounded-2xl p-8">
                    {[
                        { value: '1000+', label: 'Global Leagues' },
                        { value: '100K+', label: 'Active Users' },
                        { value: '24/7', label: 'Live Updates' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`animate-fade-up text-center [animation-delay:${1400 + index * 200}ms]`}
                        >
                            <div className="text-primary text-3xl font-bold">{stat.value}</div>
                            <div className="text-muted-foreground text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
