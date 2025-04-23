'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { SendIcon, SmileIcon, X, Check, CheckCheck } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getChatMessages, sendChatMessage } from '@/actions/dashboard/chat'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

interface LeagueChatSidebarProps {
    isOpen: boolean
    onClose: () => void
    leagueCode: string
    leagueId: string
}

const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡']

export function LeagueChatSidebar({ isOpen, onClose, leagueCode, leagueId }: LeagueChatSidebarProps) {
    const [newMessage, setNewMessage] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const { data: session, isPending, error } = authClient.useSession()

    if (error) {
        toast.error(error.message)
    }

    if (!isPending && !session) {
        redirect('/auth/sign-in')
    }

    const { data: messages, isLoading } = useQuery({
        queryKey: ['chat', 'messages', leagueId],
        queryFn: () => getChatMessages(leagueId),
    })

    const sendMessageMutation = useMutation({
        mutationFn: (content: string) => sendChatMessage(leagueId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'messages', leagueCode] })
            setNewMessage('')
        },
    })

    // Format timestamp to readable format
    const formatTimestamp = (date: Date) => {
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else {
            return (
                date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
                ' ' +
                date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            )
        }
    }

    // Send a new message
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        sendMessageMutation.mutate(newMessage)
    }

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage((prev) => prev + emoji)
        setShowEmojiPicker(false)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages])

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-background mt-16 h-[calc(100vh-4rem)] w-80 border-l shadow-md md:w-96"
        >
            <div className="flex h-full flex-col">
                <div className="bg-muted/50 flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/league-logo.png" alt="League" />
                                <AvatarFallback>L</AvatarFallback>
                            </Avatar>
                            <div className="border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">League Chat</h2>
                            <p className="text-muted-foreground text-xs">3 members online</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="link" asChild>
                            <Link href="/dashboard/chats">All Chats</Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
                            <X className="size-4" />
                            <span className="sr-only">Close chat</span>
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Loader2 className="size-6 animate-spin" />
                    </div>
                ) : (
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {session &&
                                messages?.map((msg) => {
                                    const isCurrentUser = msg.user.id === session.user.id

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn('flex', {
                                                'justify-end': isCurrentUser,
                                                'justify-start': !isCurrentUser,
                                            })}
                                        >
                                            <div
                                                className={cn('flex max-w-[80%] gap-3', {
                                                    'flex-row-reverse': isCurrentUser,
                                                    'flex-row': !isCurrentUser,
                                                })}
                                            >
                                                <Avatar className="mt-1 h-8 w-8">
                                                    {msg.user.image && (
                                                        <AvatarImage src={msg.user.image} alt={msg.user.name} />
                                                    )}
                                                    <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div
                                                        className={cn('mb-1 flex items-center gap-2', {
                                                            'justify-end': isCurrentUser,
                                                            'justify-start': !isCurrentUser,
                                                        })}
                                                    >
                                                        <span className="text-sm font-medium">{msg.user.name}</span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {formatTimestamp(new Date(msg.createdAt))}
                                                        </span>
                                                    </div>

                                                    <div className="relative">
                                                        <div
                                                            className={cn('rounded-2xl p-3 shadow-sm', {
                                                                'bg-primary text-primary-foreground': isCurrentUser,
                                                                'bg-muted': !isCurrentUser,
                                                            })}
                                                        >
                                                            {msg.content}
                                                        </div>

                                                        {/* {msg.replyTo && (
                                                            <div className="text-muted-foreground mt-1 text-xs">
                                                                Replying to: {msg.replyTo.content}
                                                            </div>
                                                        )} */}

                                                        {isCurrentUser && (
                                                            <div className="mt-1 flex justify-end">
                                                                {msg.status === 'sent' && (
                                                                    <Check className="text-muted-foreground size-3" />
                                                                )}
                                                                {msg.status === 'delivered' && (
                                                                    <CheckCheck className="text-muted-foreground size-3" />
                                                                )}
                                                                {msg.status === 'read' && (
                                                                    <CheckCheck className="text-primary size-3" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                        </div>
                    </ScrollArea>
                )}
                <div className="bg-muted/50 border-t p-4">
                    <form onSubmit={handleSendMessage}>
                        <div className="flex gap-2">
                            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                                <PopoverTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon" className="hover:bg-muted">
                                        <SmileIcon className="size-5" />
                                        <span className="sr-only">Add emoji</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2" align="start">
                                    <div className="grid grid-cols-6 gap-2">
                                        {emojis.map((emoji) => (
                                            <Button
                                                key={emoji}
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-muted"
                                                onClick={() => handleEmojiSelect(emoji)}
                                            >
                                                {emoji}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="bg-background flex-1"
                                disabled={sendMessageMutation.isPending}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={sendMessageMutation.isPending || !newMessage.trim()}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {sendMessageMutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <SendIcon className="size-4" />
                                )}
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}
