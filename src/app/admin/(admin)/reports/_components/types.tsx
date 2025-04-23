import { report, reportComment, user } from '@/db/schema'
import { ClockIcon, CheckCircle2Icon, Trash2Icon } from 'lucide-react'

export type ReportTable = typeof report.$inferSelect & {
    reportedBy: UserTable
    reported: UserTable
    resolvedBy: UserTable
    reportComments: ReportCommentTable[]
}

export type ReportCommentTable = typeof reportComment.$inferSelect & {
    user: UserTable
}

export type UserTable = typeof user.$inferSelect

export const statusIcons = {
    pending: <ClockIcon className="h-4 w-4 text-yellow-500" />,
    resolved: <CheckCircle2Icon className="h-4 w-4 text-green-500" />,
    dismissed: <Trash2Icon className="text-muted-foreground h-4 w-4" />,
} as const
