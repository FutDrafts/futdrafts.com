import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SignInForm } from './_form'

export default function SignInPage() {
    return (
        <Card className="z-50 max-w-md rounded-md rounded-t-none">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm />
            </CardContent>
        </Card>
    )
}
