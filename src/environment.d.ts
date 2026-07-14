declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      PAYLOAD_DB_PUSH?: string
      POSTGRES_URL: string
      DATABASE_URL: string
      GOOGLE_MAPS_API_KEY: string
      BLOB_READ_WRITE_TOKEN: string
      CRON_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      INDEXNOW_ENABLED?: string
      INDEXNOW_KEY?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
