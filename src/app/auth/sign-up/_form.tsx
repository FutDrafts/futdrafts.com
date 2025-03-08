'use client'

import { Form } from '@/components/ui/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'

const signUpSchema = z
    .object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        username: z.string().min(6),
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
        image: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ['passwordConfirmation'],
    })

export function SignUpForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const imageState = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            image: '',
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            imageState[1](file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setLoading(true)

        await authClient.signUp.email({
            email: data.email,
            password: data.password,
            username: data.username,
            name: `${data.firstName} ${data.lastName}`,
            image: data.image,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="mb-4 flex flex-col items-center">
                    <div className="relative mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-gray-100">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Profile preview" fill className="object-cover" />
                        ) : (
                            <UserIcon className="h-10 w-10 text-black" />
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-image-input')?.click()}
                    >
                        {imagePreview ? 'Change Image' : 'Add Profile Image'}
                    </Button>
                    {imagePreview && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-1 text-red-500"
                            onClick={() => {
                                form.setValue('image', '')
                                imageState[1](null)
                                setImagePreview(null)
                            }}
                        >
                            Remove
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Max" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Robinson" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="maxrobinson" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="hidden">
                            <FormControl>
                                <Input
                                    id="profile-image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleImageChange(e)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2Icon size={16} className="animate-spin" /> : 'Create an account'}
                </Button>
            </form>
        </Form>
    )
}
