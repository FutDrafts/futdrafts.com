import Link from 'next/link'
import { SignUpForm } from './_form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
    return (
        <Card className="z-50 mx-auto w-full max-w-md rounded-md rounded-t-none p-4 sm:p-6">
            <CardHeader>
                <div className="flex flex-col gap-0.5">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        ← Back to Home
                    </Link>
                    <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-xs text-muted-foreground">
                    Already have an account? <Link href="/auth/sign-in">Sign in</Link>
                </p>
                <SignUpForm />
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-xs text-muted-foreground">
                    By signing up, you agree to the <Link href="/policies/terms">Terms of Service</Link> and{' '}
                    <Link href="/policies/privacy">Privacy Policy</Link>
                </p>
            </CardFooter>
        </Card>
    )
}
