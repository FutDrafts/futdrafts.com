import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileEditForm } from './_edit-form'

export default async function EditProfilePage() {
    const session = await auth.api
        .getSession({
            headers: await headers(),
        })
        .catch(() => null)

    if (!session || !session.user) {
        redirect('/auth/sign-in')
    }

    // Get the current user's data
    const userData = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
    })

    if (!userData) {
        redirect('/dashboard')
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileEditForm userData={userData} />
                </CardContent>
            </Card>
        </div>
    )
}
