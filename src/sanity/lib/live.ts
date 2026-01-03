import { client } from './client'

// Ye function normal client use karega par naam wahi rakhega
export async function sanityFetch({ query, params = {} }: { query: string; params?: any }) {
  const data = await client.fetch(query, params)
  return { data }
}

// Ye dummy component hai taaki code na phate
export function SanityLive() {
  return null
}