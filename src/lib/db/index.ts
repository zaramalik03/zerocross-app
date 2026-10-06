import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// Prevent multiple connections in development due to hot reload
const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined
}

const connection =
  globalForDb.connection ??
  postgres(connectionString, { max: 1 })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connection = connection
}

export const db = drizzle(connection, { schema })