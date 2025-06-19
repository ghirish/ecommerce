import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers

// Use Node.js runtime for bcryptjs compatibility
export const runtime = 'nodejs' 