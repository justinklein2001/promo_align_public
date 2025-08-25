import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // .env required
});

export const db = drizzle(pool, { schema });
export { songNodes, promoNodes, edges } from './schema';
