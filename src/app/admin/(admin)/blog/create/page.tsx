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
import remarkGfm from 'remark-gfm'
import { createPost } from '@/actions/posts'
import { PostFormData } from '@/lib/validator'
import { toast } from 'sonner'
import { postCategory, postStatus } from '@/db/schema'

type PostCategory = (typeof postCategory.enumValues)[number]
type PostStatus = (typeof postStatus.enumValues)[number]

const categories = [
    { value: 'transfers', label: 'Transfers' },
    { value: 'match-reports', label: 'Match Reports' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'news', label: 'News' },
] as const

const imageUploadHandler = async (file: File): Promise<string> => {
    try {
        // Create a FormData instance
        const formData = new FormData()
        formData.append('file', file)

        // TODO: Replace with your actual image upload endpoint
        const response = await fetch('/server/api/upload', {
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
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        category: 'news',
        content: '',
        excerpt: '',
        status: 'draft',
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await createPost(formData)

            if (result.success) {
                toast.success('Article created successfully')
                router.push('/admin/blog')
            } else {
                toast.error('Failed to create article')
            }
        } catch (error) {
            console.error('Failed to create article:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to create article')
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
                    <h1 className="text-3xl font-bold">Create Blog Post</h1>
                    <p className="text-muted-foreground">Create a new blog post</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Post Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter post title"
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
                                onValueChange={(value) => setFormData({ ...formData, category: value as PostCategory })}
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
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as PostStatus })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                placeholder="Brief summary of the article"
                                value={formData.excerpt || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
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
                                    remarkPlugins: [remarkGfm],
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
