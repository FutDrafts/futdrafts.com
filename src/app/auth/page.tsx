import { redirect } from 'next/navigation'

export default function AuthPage() {
    // Permanent redirect to /auth/sign-in
    redirect('/auth/sign-in')
    // This code will never be reached due to the redirect
    return null
}
