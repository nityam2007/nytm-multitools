import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Allowed origins can be overridden via env: NEXT_ALLOWED_ORIGINS (comma-separated)
const DEFAULT_ALLOWED = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.16.150:3000',
  'https://nytm.in',
  'https://www.nytm.in',
]

const allowedOrigins = (process.env.NEXT_ALLOWED_ORIGINS || DEFAULT_ALLOWED.join(',')).split(',').map(s => s.trim()).filter(Boolean)

function isAllowed(origin: string | null) {
  if (!origin) return false
  if (allowedOrigins.includes(origin)) return true
  const normalized = origin.replace(/\/$/, '')
  return allowedOrigins.includes(normalized)
}

export async function proxy(req: NextRequest) {
  // Proxy runs on the Node.js runtime in Next.js 16+.
  const dev = process.env.NODE_ENV === 'development'

  const origin = req.headers.get('origin')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 })
    if (dev && isAllowed(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin!)
      res.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return res
  }

  const res = NextResponse.next()
  if (dev && isAllowed(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin!)
    res.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return res
}

export const config = {
  matcher: ['/_next/:path*', '/((?!api|favicon.ico).*)'],
}
