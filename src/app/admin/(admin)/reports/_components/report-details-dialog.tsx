'use client'

import { Loader2Icon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ReportTable, statusIcons } from './types'

interface ReportDetailsDialogProps {
    report: ReportTable | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    newComment: string
    setNewComment: (comment: string) => void
    onAddComment: () => void
    isAddingComment: boolean
}

export function ReportDetailsDialog({
    report,
    isOpen,
    onOpenChange,
    newComment,
    setNewComment,
    onAddComment,
    isAddingComment,
}: ReportDetailsDialogProps) {
    if (!report) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report Details</DialogTitle>
                    <DialogDescription>Full information about the report</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium">Category</h4>
                            <p className="text-muted-foreground text-sm capitalize">{report.category}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Reason</h4>
                            <p className="text-muted-foreground text-sm">{report.reason}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Details</h4>
                            <p className="text-muted-foreground text-sm">{report.details}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium">Created At</h4>
                                <p className="text-muted-foreground text-sm">
                                    {new Date(report.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Status</h4>
                                <div className="flex items-center gap-2">
                                    {statusIcons[report.status as keyof typeof statusIcons]}
                                    <span className="text-muted-foreground text-sm capitalize">{report.status}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">Reported User</h4>
                                <div className="flex items-start gap-4 rounded-lg border p-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={report.reportedUser.image ?? ''} />
                                        <AvatarFallback>{report.reportedUser.name?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">{report.reportedUser.name}</p>
                                        <p className="text-muted-foreground text-sm">{report.reportedUser.email}</p>
                                        {report.reportedUser.banned && (
                                            <div className="text-destructive text-sm">
                                                Banned until:{' '}
                                                {report.reportedUser.banExpires
                                                    ? new Date(report.reportedUser.banExpires).toLocaleDateString()
                                                    : 'Permanently'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Reported By</h4>
                                <div className="flex items-start gap-4 rounded-lg border p-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={report.reportedByUser.image ?? ''} />
                                        <AvatarFallback>
                                            {report.reportedByUser.name?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">{report.reportedByUser.name}</p>
                                        <p className="text-muted-foreground text-sm">{report.reportedByUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="comments" className="space-y-4">
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                            <div className="space-y-4">
                                {report.comments && report.comments.length > 0 ? (
                                    report.comments.toReversed().map((comment) => (
                                        <div key={comment.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={comment.admin.image ?? ''} />
                                                    <AvatarFallback>
                                                        {comment.admin.name?.[0]?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{comment.admin.name}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">No comments yet</div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="space-y-2">
                            <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={onAddComment} disabled={!newComment.trim() || isAddingComment}>
                                {isAddingComment ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Adding Comment...
                                    </>
                                ) : (
                                    'Add Comment'
                                )}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
