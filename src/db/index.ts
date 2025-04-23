import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '@/env/server'
import * as schema from './schema'

export const db = drizzle(env.PG_DATABASE_URL, { schema })
