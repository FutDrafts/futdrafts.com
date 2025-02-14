import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface NewsCardProps {
    title: string
    category: string
    imageUrl: string
    author: string
    publishedAt: Date
    slug: string
}

export function NewsCard({ title, category, imageUrl, author, publishedAt, slug }: NewsCardProps) {
    return (
        <Link href={`/news/${slug}`} className="group block">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="aspect-video overflow-hidden rounded-lg">
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={720}
                            height={480}
                            className="h-full w-full bg-red-200 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-primary">{category}</span>
                        <span className="text-muted-foreground">•</span>
                        <time dateTime={publishedAt.toISOString()} className="text-muted-foreground">
                            {formatDistanceToNow(publishedAt, { addSuffix: true })}
                        </time>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-semibold leading-tight group-hover:text-primary">
                        {title}
                    </h3>
                </CardContent>
                <CardFooter className="mt-auto flex flex-col items-start gap-2">
                    <p className="text-sm text-muted-foreground">By {author}</p>
                </CardFooter>
            </Card>
        </Link>
    )
}
