import dotenv from 'dotenv';
import path from 'path';
import { defineConfig, env } from 'prisma/config';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: './prisma/schema',
  datasource: {
    url: env('DATABASE_URL'),
 
  },
  migrations: {
    seed: 'npx tsx ./prisma/seeds/main.seed.ts',
  },
});
