// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const serverEnv = createEnv({
  server: {
    XAI_API_KEY: z.string().min(1),
    PPINFRA_API_KEY: z.string().optional(),
    AZURE_RESOURCE_NAME: z.string().optional(),
    AZURE_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    CEREBRAS_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    E2B_API_KEY: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1).url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    ELEVENLABS_API_KEY: z.string().optional(),
    TAVILY_API_KEY: z.string().min(1),
    TAVILY_API_KEYS: z.string().optional(),
    EXA_API_KEY: z.string().min(1),
    TMDB_API_KEY: z.string().optional(),
    YT_ENDPOINT: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
    OPENWEATHER_API_KEY: z.string().optional(),
    SANDBOX_TEMPLATE_ID: z.string().min(1),
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    MAPBOX_ACCESS_TOKEN: z.string().optional(),
    TRIPADVISOR_API_KEY: z.string().optional(),
    AVIATION_STACK_API_KEY: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    BLOB_READ_WRITE_TOKEN:  z.string().optional(),
    DEBUG: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
})
