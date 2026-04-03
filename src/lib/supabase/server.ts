/**
 * Static-export build: no server runtime, always use the in-memory demo client.
 * Drop-in replacement for the real Supabase server client.
 */
import { createMockClient } from './mock'

export async function createClient() {
  return createMockClient() as ReturnType<typeof createMockClient>
}

export function createServiceClient() {
  return createMockClient()
}
