'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import rehypeRaw from 'rehype-raw'

interface FormData {
    title: string
    category: string
    content: string
    excerpt: string
}

const categories = [
    { value: 'transfers', label: 'Transfers' },
    { value: 'match-reports', label: 'Match Reports' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'interviews', label: 'Interviews' },
] as const

const imageUploadHandler = async (file: File): Promise<string> => {
    try {
        // Create a FormData instance
        const formData = new FormData()
        formData.append('file', file)

        // TODO: Replace with your actual image upload endpoint
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.url // Return the URL of the uploaded image
    } catch (error) {
        console.error('Failed to upload image:', error)
        throw error
    }
}

export default function CreateArticle() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '',
        content: '',
        excerpt: '',
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Implement article creation
            // await createArticle(formData)
            router.push('/admin/news')
        } catch (error) {
            console.error('Failed to create article:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6" data-color-mode="dark">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create Article</h1>
                    <p className="text-muted-foreground">Create a new news article</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Article Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter article title"
                                value={formData.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Brief summary of the article"
                                value={formData.excerpt}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <MDEditor
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value || '' })}
                                height={400}
                                preview="live"
                                hideToolbar={false}
                                enableScroll={true}
                                previewOptions={{
                                    rehypePlugins: [[rehypeRaw, { passThrough: ['div', 'span'] }]],
                                }}
                                onDrop={async (e) => {
                                    e.preventDefault()
                                    const files = Array.from(e.dataTransfer.files)
                                    const imageFiles = files.filter((file) => file.type.startsWith('image/'))

                                    if (imageFiles.length > 0) {
                                        try {
                                            const uploadPromises = imageFiles.map((file) => imageUploadHandler(file))
                                            const urls = await Promise.all(uploadPromises)
                                            const markdownImages = urls.map((url) => `![](${url})`).join('\n')
                                            const newContent = formData.content + '\n' + markdownImages
                                            setFormData({ ...formData, content: newContent })
                                        } catch (error) {
                                            console.error('Failed to upload images:', error)
                                        }
                                    }
                                }}
                                onPaste={async (e) => {
                                    const items = Array.from(e.clipboardData.items)
                                    const imageItems = items.filter((item) => item.type.startsWith('image/'))

                                    if (imageItems.length > 0) {
                                        e.preventDefault()
                                        try {
                                            const uploadPromises = imageItems.map((item) => {
                                                const file = item.getAsFile()
                                                if (!file) return Promise.reject('No file found')
                                                return imageUploadHandler(file)
                                            })
                                            const urls = await Promise.all(uploadPromises)
                                            const markdownImages = urls.map((url) => `![](${url})`).join('\n')
                                            const newContent = formData.content + '\n' + markdownImages
                                            setFormData({ ...formData, content: newContent })
                                        } catch (error) {
                                            console.error('Failed to upload images:', error)
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Article'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
