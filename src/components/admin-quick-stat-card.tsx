import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function AdminQuickStatCard({ statistic, title, description }: { statistic: number, title: string, description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{statistic}</p>
      </CardContent>
    </Card>
  )
}

