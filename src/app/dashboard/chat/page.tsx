'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ArchiveIcon, ChevronDownIcon, SendIcon, SmileIcon } from 'lucide-react'
import { useState } from 'react'

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

interface League {
    id: string
    name: string
    image?: string
    isArchived: boolean
    unreadCount?: number
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [activeLeague, setActiveLeague] = useState<string | null>(null)
    const [showArchived, setShowArchived] = useState(false)
    
    // Mock data for leagues
    const [leagues] = useState<League[]>([
        { id: 'league1', name: 'Fantasy Premier League', image: 'https://via.placeholder.com/50', isArchived: false, unreadCount: 3 },
        { id: 'league2', name: 'NBA Fantasy', image: 'https://via.placeholder.com/50', isArchived: false },
        { id: 'league3', name: 'NFL Fantasy', image: 'https://via.placeholder.com/50', isArchived: false, unreadCount: 1 },
        { id: 'league4', name: 'MLB 2023', image: 'https://via.placeholder.com/50', isArchived: true },
        { id: 'league5', name: 'NHL 2023', image: 'https://via.placeholder.com/50', isArchived: true },
    ])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const message: Message = {
            id: '1',
            content: newMessage,
            sender: {
                id: '1',
                name: 'John Doe',
                image: 'https://via.placeholder.com/150',
            },
            timestamp: new Date(),
            reactions: {},
        }

        setMessages([...messages, message])
        setNewMessage('')
    }

    const addReaction = (messageId: string, emoji: string) => {
        setMessages(
            messages.map((msg) => {
                if (msg.id === messageId) {
                    const updatedReactions = { ...msg.reactions }

                    if (!updatedReactions[emoji]) {
                        updatedReactions[emoji] = ['1']
                    } else if (!updatedReactions[emoji].includes('1')) {
                        updatedReactions[emoji] = [...updatedReactions[emoji], '1']
                    } else {
                        updatedReactions[emoji] = updatedReactions[emoji].filter((id) => id !== '1')
                        if (updatedReactions[emoji].length === 0) {
                            delete updatedReactions[emoji]
                        }
                    }

                    return { ...msg, reactions: updatedReactions }
                }
                return msg
            }),
        )
    }

    const formatTimestamp = (timestamp: Date) => {
        return timestamp.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })
    }

    const emojis = ['👍', '👎', '😂', '🔥', '❤️', '👏', '👀', '💔', '💜']

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 border-r flex flex-col h-full">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">League Chats</h2>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        <div className="space-y-1">
                            {leagues
                                .filter(league => !league.isArchived)
                                .map(league => (
                                    <Button
                                        key={league.id}
                                        variant={activeLeague === league.id ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setActiveLeague(league.id)}
                                    >
                                        <div className="flex items-center w-full">
                                            {league.image && (
                                                <Avatar className="h-6 w-6 mr-2">
                                                    <AvatarImage src={league.image} alt={league.name} />
                                                    <AvatarFallback>{league.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <span className="truncate">{league.name}</span>
                                            {league.unreadCount && (
                                                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                                    {league.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                ))
                            }
                        </div>
                        
                        <div className="mt-6">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-between items-center"
                                onClick={() => setShowArchived(!showArchived)}
                            >
                                <div className="flex items-center">
                                    <ArchiveIcon className="h-4 w-4 mr-2" />
                                    <span>Archived</span>
                                </div>
                                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", {
                                    "transform rotate-180": showArchived
                                })} />
                            </Button>
                            
                            {showArchived && (
                                <div className="mt-2 space-y-1 pl-2">
                                    {leagues
                                        .filter(league => league.isArchived)
                                        .map(league => (
                                            <Button
                                                key={`${league.id}-archived`}
                                                variant={activeLeague === league.id ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                                onClick={() => setActiveLeague(league.id)}
                                            >
                                                <div className="flex items-center w-full">
                                                    {league.image && (
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src={league.image} alt={league.name} />
                                                            <AvatarFallback>{league.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <span className="truncate">{league.name}</span>
                                                </div>
                                            </Button>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <h1 className="text-xl font-bold">
                        {activeLeague 
                            ? leagues.find(l => l.id === activeLeague)?.name || 'Chat'
                            : 'Select a league chat'}
                    </h1>
                </div>

                <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">
                        {messages.map((msg) => {
                            const isCurrentUser = msg.sender.id === '1'

                            return (
                                <div
                                    key={`${msg.id}-message-${msg.sender.id}`}
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
                                        <Avatar className="mt-1 h-10 w-10">
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
                                                                variant={'ghost'}
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

                <div className="border-t p-4 shrink-0">
                    <form onSubmit={handleSendMessage}>
                        <div className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                                disabled={!activeLeague}
                            />
                            <Button type="submit" size="icon" disabled={!activeLeague}>
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
