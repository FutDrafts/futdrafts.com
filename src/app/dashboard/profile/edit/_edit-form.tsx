'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { user } from '@/db/schema'

// Form schema
const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    username: z
        .string()
        .min(5, {
            message: 'Username must be at least 5 characters.',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: 'Username can only contain letters, numbers, and underscores.',
        }),
    image: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
type User = typeof user.$inferSelect

interface Props {
    userData: User
}

export function ProfileEditForm({ userData }: Props) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newAvatar, setNewAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(userData.image || null)

    // Initialize form with user data
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userData.name || '',
            username: userData.username || '',
            image: userData.image || '',
        },
    })

    // Clean up object URL when component unmounts or when preview changes
    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview !== userData.image) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }, [avatarPreview, userData.image])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewAvatar(file)

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file)
            setAvatarPreview(previewUrl)

            // Update the user state with the preview
            setAvatarPreview(previewUrl)

            // Clean up the object URL when component unmounts or when preview changes
            return () => URL.revokeObjectURL(previewUrl)
        }
    }

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)

        try {
            // Only include fields that have changed
            const updateData: Record<string, unknown> = {}

            // Check if name has changed
            if (values.name !== userData.name) {
                updateData.name = values.name
            }

            // Check if username has changed
            if (values.username !== userData.username) {
                updateData.username = values.username
            }

            // Check if image has changed
            if (newAvatar) {
                // Convert the file to base64
                updateData.image = await convertFileToBase64(newAvatar)
            }

            // Only proceed with update if there are changes
            if (Object.keys(updateData).length > 0) {
                // Update user profile with better-auth
                const response = await authClient.updateUser(updateData)

                if (response.error) {
                    throw new Error(response.error.message)
                }

                toast.success('Profile updated successfully')
            } else {
                toast.info('No changes to save')
            }

            // Redirect to profile page - use the new username if it was changed, otherwise use the current one
            const redirectUsername = updateData.username || userData.username
            router.push(`/dashboard/profile/${redirectUsername}`)
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || ''} alt={userData.name} />
                        <AvatarFallback>{userData.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div>
                        <Input type="file" accept="image/*" onChange={handleAvatarChange} className="max-w-xs" />
                        <FormDescription className="mt-2 text-center">
                            Upload a new profile picture (max 4MB)
                        </FormDescription>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your unique username. Can only contain letters, numbers, and underscores.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
