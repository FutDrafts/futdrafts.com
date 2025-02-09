'use client'

import { Form } from '@/components/ui/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'

const signUpSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    image: z.string().optional(),
})

export function SignUpForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            image: '',
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setLoading(true)
        console.log(image)

        await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: `${data.firstName} ${data.lastName}`,
            image: data.image,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" data-netlify="true">
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
                        <FormItem>
                            <FormLabel>Profile Image (optional)</FormLabel>
                            <FormControl>
                                <div className="flex items-end gap-4">
                                    {imagePreview && (
                                        <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                                            <Image
                                                src={imagePreview}
                                                alt="Profile preview"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex w-full items-center gap-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleImageChange(e)
                                            }}
                                            className="w-full"
                                        />
                                        {imagePreview && (
                                            <X
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    field.onChange(null)
                                                    setImage(null)
                                                    setImagePreview(null)
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create an account'}
                </Button>
            </form>
        </Form>
    )
}
