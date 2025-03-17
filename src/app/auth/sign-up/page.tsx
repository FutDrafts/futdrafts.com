'use client'

import Link from 'next/link'
import { SignUpForm } from './_form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { redirect } from 'next/navigation'
import { use } from 'react'

export default function SignUpPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { ref } = use(searchParams)
    const flagEnabled = useFeatureFlagEnabled('user-registration')

    if (flagEnabled) {
        redirect('/auth/sign-in')
    }

    return (
        <Card className="z-50 mx-auto w-full max-w-md rounded-md rounded-t-none p-4 sm:p-6">
            <CardHeader>
                <div className="flex flex-col gap-0.5">
                    <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
                        ← Back to Home
                    </Link>
                    <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4 text-xs">
                    Already have an account? <Link href="/auth/sign-in">Sign in</Link>
                </p>
                <SignUpForm referrer={ref ?? '/dashboard'} />
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-muted-foreground text-xs">
                    By signing up, you agree to the <Link href="/policies/terms">Terms of Service</Link> and{' '}
                    <Link href="/policies/privacy">Privacy Policy</Link>
                </p>
            </CardFooter>
        </Card>
    )
}
