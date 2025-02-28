import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { permanentRedirect, redirect } from 'next/navigation'

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user) {
        redirect('/auth/sign-in')
    }

    // Get the username from the session
    const username = session.user.username || session.user.id

    // Redirect to the user's profile page
    permanentRedirect(`/dashboard/profile/${username}`)
}
