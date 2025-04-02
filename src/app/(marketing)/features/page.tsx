import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Users, Calendar, BarChart, Bell, Shield, Globe } from 'lucide-react'
import Link from 'next/link'

const features = [
    {
        title: 'International Drafts',
        description: 'Connect with players worldwide and participate in global fantasy football drafts.',
        icon: Globe,
        badge: 'Global',
    },
    {
        title: 'Real-time Updates',
        description: 'Get instant notifications about draft events, player movements, and important updates.',
        icon: Bell,
        badge: 'Live',
    },
    {
        title: 'Advanced Analytics',
        description: 'Access detailed statistics and insights to make informed draft decisions.',
        icon: BarChart,
        badge: 'Pro',
    },
    {
        title: 'Competitive Leagues',
        description: 'Join competitive leagues and compete for prizes in various tournament formats.',
        icon: Trophy,
        badge: 'Premium',
    },
    {
        title: 'Community Features',
        description: 'Connect with other players, share strategies, and build your fantasy network.',
        icon: Users,
        badge: 'Social',
    },
    {
        title: 'Scheduled Events',
        description: 'Plan and schedule your drafts with our easy-to-use calendar system.',
        icon: Calendar,
        badge: 'Organized',
    },
    {
        title: 'Secure Platform',
        description: 'Your data is protected with enterprise-grade security and privacy features.',
        icon: Shield,
        badge: 'Secure',
    },
]

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4">
                    Platform Features
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Everything you need for fantasy football
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Discover the tools and features that make FutDrafts the ultimate platform for fantasy football enthusiasts.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/signup">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <feature.icon className="h-6 w-6 text-primary" />
                                <Badge variant="outline">{feature.badge}</Badge>
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold mb-4">Ready to start your fantasy journey?</h2>
                <p className="text-muted-foreground mb-6">
                    Join thousands of players who are already enjoying the FutDrafts experience.
                </p>
                <Button asChild size="lg" variant="outline">
                    <Link href="/pricing">
                        View Pricing Plans
                    </Link>
                </Button>
            </div>
        </div>
    )
}
