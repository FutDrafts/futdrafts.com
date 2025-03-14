import { ErrorResponse, Resend } from 'resend'
import { env } from '@/env/server'
import * as React from 'react'

export const resend = new Resend(env.RESEND_API_KEY as string)

export interface EmailTemplateProps {
    firstName: string
    lastName: string
    username: string
}

export async function sendEmail<T extends Record<string, unknown>>({
    to,
    subject,
    Template,
    templateProps,
}: {
    to: string
    subject: string
    Template: React.ComponentType<T>
    templateProps: T
}): Promise<{
    success: boolean
    error?: ErrorResponse | Error | null | string
}> {
    try {
        const email = React.createElement(Template, templateProps)
        const { error } = await resend.emails.send({
            from: 'futdrafts@alastisolutions.org',
            to,
            subject,
            react: email,
        })

        if (error) {
            console.error('Failed to send Email:', error.message)
            return {
                success: false,
                error,
            }
        }

        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error('Error sending emails', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occured',
        }
    }
}
