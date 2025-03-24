import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react'
import { Textarea } from './textarea'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { Bold, Italic, List, Link, Code, Heading1, Heading2 } from 'lucide-react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface MarkdownEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null)

        // Forward the ref
        useImperativeHandle(ref, () => textareaRef.current!)

        // Function to insert markdown syntax
        const insertMarkdown = (syntax: string, selection: string = '', wrap: boolean = true) => {
            const textarea = textareaRef.current
            if (!textarea) return

            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const selectedText = textarea.value.substring(start, end) || selection

            const before = textarea.value.substring(0, start)
            const after = textarea.value.substring(end)

            let newText
            if (wrap) {
                newText = `${before}${syntax}${selectedText}${syntax}${after}`
            } else {
                newText = `${before}${syntax}${selectedText}${after}`
            }

            // Create a new change event
            const event = {
                target: {
                    value: newText,
                },
            } as ChangeEvent<HTMLTextAreaElement>

            onChange(event)

            // Set cursor position after update
            setTimeout(() => {
                textarea.focus()
                const newCursorPos = wrap
                    ? start + syntax.length + selectedText.length + syntax.length
                    : start + syntax.length + selectedText.length
                textarea.selectionStart = newCursorPos
                textarea.selectionEnd = newCursorPos
            }, 0)
        }

        return (
            <div className="overflow-hidden rounded-md border shadow-sm">
                <Tabs defaultValue="write" className="w-full">
                    <div className="bg-muted/10 border-b">
                        <div className="flex items-center justify-between px-4">
                            <TabsList className="h-10 bg-transparent py-2">
                                <TabsTrigger value="write" className="h-8 rounded-md px-4 text-sm font-medium">
                                    Write
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="h-8 rounded-md px-4 text-sm font-medium">
                                    Preview
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="write" className="m-0 border-t p-0">
                            <div className="bg-muted/5 flex flex-wrap items-center gap-1 px-2 py-1">
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('**')}
                                            >
                                                <Bold className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Bold</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('*')}
                                            >
                                                <Italic className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Italic</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('# ', '', false)}
                                            >
                                                <Heading1 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Heading 1</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('## ', '', false)}
                                            >
                                                <Heading2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Heading 2</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('- ', '', false)}
                                            >
                                                <List className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>List</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('[', '](url)', false)}
                                            >
                                                <Link className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Link</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => insertMarkdown('`')}
                                            >
                                                <Code className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Code</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <Textarea
                                ref={textareaRef}
                                className={cn(
                                    'min-h-64 resize-none rounded-none border-0 p-4 font-mono focus-visible:ring-0 focus-visible:ring-offset-0',
                                    className,
                                )}
                                value={value}
                                onChange={onChange}
                                placeholder="Type markdown content here..."
                                {...props}
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="m-0 border-t p-0">
                            <div className="prose dark:prose-invert prose-sm min-h-64 max-w-none overflow-auto p-4">
                                {value ? (
                                    <ReactMarkdown>{value}</ReactMarkdown>
                                ) : (
                                    <p className="text-muted-foreground italic">Nothing to preview</p>
                                )}
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="text-muted-foreground flex items-center border-t px-4 py-2 text-xs">
                    <div>Markdown supported</div>
                </div>
            </div>
        )
    },
)

MarkdownEditor.displayName = 'MarkdownEditor'
