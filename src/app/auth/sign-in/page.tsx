import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SignInForm } from './_form'
import Link from 'next/link'

export default function SignInPage() {
    return (
        <Card className="z-50 mx-auto w-full max-w-md rounded-md rounded-t-none p-4 sm:p-6">
            <CardHeader>
                <div className="flex flex-col gap-0.5">
                    <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
                        ← Back to Home
                    </Link>
                    <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4 text-xs">
                    Don&apos;t have an account? <Link href="/auth/sign-up">Sign up</Link>
                </p>
                <SignInForm />
            </CardContent>
        </Card>
    )
}
