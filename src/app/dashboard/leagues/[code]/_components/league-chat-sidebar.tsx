'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { MessageSquareIcon, SendIcon, SmileIcon, X } from 'lucide-react'
import Link from 'next/link'

interface Message {
    id: string
    content: string
    sender: {
        id: string
        name: string
        image: string
    }
    timestamp: Date
    reactions: {
        [key: string]: string[]
    }
}

interface LeagueChatSidebarProps {
    isOpen: boolean
    onClose: () => void
    leagueCode: string
}

// Mock data - replace with real data fetching
const mockMessages: Message[] = [
    {
        id: '1',
        content: 'Did you see that ludicrous display last night?',
        sender: {
            id: '2',
            name: 'Jane Smith',
            image: '/avatars/jane-smith.jpg',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        reactions: {
            '👍': ['1'],
            '😂': ['3', '4'],
        },
    },
    {
        id: '2',
        content: 'What was Wenger thinking sending Walcott on that early?',
        sender: {
            id: '3',
            name: 'Bob Johnson',
            image: '/avatars/bob-johnson.jpg',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        reactions: {},
    },
    {
        id: '3',
        content: 'The thing about Arsenal is, they always try to walk it in!',
        sender: {
            id: '1',
            name: 'John Doe',
            image: '/avatars/john-doe.jpg',
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        reactions: {
            '❤️': ['2', '3'],
        },
    },
]

const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡']

export function LeagueChatSidebar({ isOpen, onClose }: LeagueChatSidebarProps) {
    const [messages, setMessages] = useState<Message[]>(mockMessages)
    const [newMessage, setNewMessage] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)

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

    // Add reaction to a message
    const addReaction = (messageId: string, emoji: string) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) => {
                if (msg.id === messageId) {
                    const updatedReactions = { ...msg.reactions }
                    if (!updatedReactions[emoji]) {
                        updatedReactions[emoji] = []
                    }

                    // Toggle reaction
                    const currentUserId = '1' // Replace with actual user ID
                    if (updatedReactions[emoji].includes(currentUserId)) {
                        updatedReactions[emoji] = updatedReactions[emoji].filter((id) => id !== currentUserId)
                        if (updatedReactions[emoji].length === 0) {
                            delete updatedReactions[emoji]
                        }
                    } else {
                        updatedReactions[emoji].push(currentUserId)
                    }

                    return { ...msg, reactions: updatedReactions }
                }
                return msg
            }),
        )
    }

    // Send a new message
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const newMsg: Message = {
            id: Date.now().toString(),
            content: newMessage,
            sender: {
                id: '1', // Current user ID
                name: 'John Doe', // Current user name
                image: '/avatars/john-doe.jpg', // Current user image
            },
            timestamp: new Date(),
            reactions: {},
        }

        setMessages((prev) => [...prev, newMsg])
        setNewMessage('')
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
        <div className="bg-background h-full w-80 border-l shadow-md md:w-96">
            <div className="flex h-full flex-col pt-16">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">League Chat</h2>
                    <div className="flex flex-row gap-1">
                        <Button asChild variant={'outline'}>
                            <Link href={`/dashboard/chat`}>
                                <MessageSquareIcon className="h-5 w-5" />
                                All Chats
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => {
                            const isCurrentUser = msg.sender.id === '1' // Replace with actual user ID check

                            return (
                                <div
                                    key={msg.id}
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
                                            <AvatarImage src={msg.sender.image} alt={msg.sender.name} />
                                            <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div
                                                className={cn('mb-1 flex items-center gap-2', {
                                                    'justify-end': isCurrentUser,
                                                    'justify-start': !isCurrentUser,
                                                })}
                                            >
                                                <span className="text-sm font-medium">{msg.sender.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatTimestamp(msg.timestamp)}
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <div
                                                    className={cn('rounded-lg p-3', {
                                                        'bg-primary text-primary-foreground': isCurrentUser,
                                                        'bg-secondary text-secondary-foreground': !isCurrentUser,
                                                    })}
                                                >
                                                    {msg.content}
                                                </div>

                                                {Object.keys(msg.reactions).length > 0 && (
                                                    <div
                                                        className={cn('mt-1 flex gap-1', {
                                                            'justify-end': isCurrentUser,
                                                            'justify-start': !isCurrentUser,
                                                        })}
                                                    >
                                                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                                                            <Button
                                                                key={emoji}
                                                                className="bg-background inline-flex items-center rounded-full border px-2 py-1 text-xs"
                                                                onClick={() => addReaction(msg.id, emoji)}
                                                            >
                                                                {emoji} {users.length}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}

                                                <div
                                                    className={cn('mt-1', {
                                                        'text-right': isCurrentUser,
                                                        'text-left': !isCurrentUser,
                                                    })}
                                                >
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="size-6 rounded-full p-0"
                                                            >
                                                                <SmileIcon className="size-4" />
                                                                <span className="sr-only">Add Reactions</span>
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            align={isCurrentUser ? 'end' : 'start'}
                                                            className="w-auto p-2"
                                                        >
                                                            <div className="flex gap-2">
                                                                {emojis.map((emoji) => (
                                                                    <Button
                                                                        key={emoji}
                                                                        className="hover:bg-muted rounded p-1 text-lg"
                                                                        onClick={() => addReaction(msg.id, emoji)}
                                                                    >
                                                                        {emoji}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                <div className="border-t p-4">
                    <form onSubmit={handleSendMessage}>
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon">
                                <SendIcon className="size-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
