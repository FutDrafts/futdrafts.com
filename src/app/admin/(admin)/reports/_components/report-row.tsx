'use client'

import { AlertCircleIcon, CheckCircle2Icon, MoreVerticalIcon, Trash2Icon, UserX2Icon, EyeIcon } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ReportTable, statusIcons } from './types'
import { reportStatus } from '@/db/schema'

type ReportStatus = (typeof reportStatus.enumValues)[number]

interface ReportRowProps {
    report: ReportTable
    onViewDetails: (report: ReportTable) => void
    onStatusChange: (reportId: string, status: ReportStatus) => void
    onBanUser: (report: ReportTable) => void
}

export function ReportRow({ report, onViewDetails, onStatusChange, onBanUser }: ReportRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div>
                    <div className="font-medium">{report.reportedUser.name}</div>
                    <div className="text-muted-foreground text-sm">{report.reportedUser.email}</div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <AlertCircleIcon className="text-destructive h-4 w-4" />
                    <span>{report.reason}</span>
                </div>
            </TableCell>
            <TableCell>
                <span className="capitalize">{report.category}</span>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {statusIcons[report.status as keyof typeof statusIcons]}
                    <span
                        className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-medium', {
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500':
                                report.status === 'pending',
                            'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500':
                                report.status === 'resolved',
                            'bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-500':
                                report.status === 'dismissed',
                        })}
                    >
                        {report.status}
                    </span>
                </div>
            </TableCell>
            <TableCell>{report.reportedByUser.name}</TableCell>
            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(report)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        {report.status === 'pending' && (
                            <>
                                <DropdownMenuItem
                                    className="text-green-600 focus:text-green-600"
                                    onClick={() => onStatusChange(report.id, 'resolved')}
                                >
                                    <CheckCircle2Icon className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-muted-foreground"
                                    onClick={() => onStatusChange(report.id, 'dismissed')}
                                >
                                    <Trash2Icon className="mr-2 h-4 w-4" />
                                    Dismiss Report
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onBanUser(report)}
                                >
                                    <UserX2Icon className="mr-2 h-4 w-4" />
                                    Ban User
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
