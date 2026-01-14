import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Caching the connection in a global variable
// In development, this prevents us from creating a new connection on every hot reload
// In production, this will be a single connection for the lifetime of the server process
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var cachedClient: postgres.Sql | undefined;
}

let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  client = postgres(process.env.POSTGRES_URL);
} else {
  if (!global.cachedClient) {
    global.cachedClient = postgres(process.env.POSTGRES_URL);
  }
  client = global.cachedClient;
}

export const db = drizzle(client, { schema });
