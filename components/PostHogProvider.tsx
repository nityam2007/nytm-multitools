// PostHog Analytics Provider | TypeScript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// PostHog Pageview Tracker Component
function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthogClient.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

// Wrapped in Suspense to avoid hydration issues with useSearchParams
function SuspendedPageview() {
  return (
    <Suspense fallback={null}>
      <PostHogPageview />
    </Suspense>
  )
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

    if (posthogKey && typeof window !== 'undefined') {
      if (!posthog.__loaded) {
        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: 'https://eu.posthog.com',
          capture_pageview: false, // Disable automatic pageview capture, we handle it manually
          capture_pageleave: true,
          capture_exceptions: true,
          autocapture: true,
          respect_dnt: true,
          persistence: 'localStorage+cookie',
          debug: process.env.NODE_ENV === 'development',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              posthog.debug()
            }
          },
        })

        // Suppress PostHog survey loading errors
        const originalWarn = console.warn
        const originalError = console.error
        
        console.warn = (...args: unknown[]) => {
          const message = String(args[0] || '')
          if (message.includes('Could not load surveys') || message.includes('surveys')) {
            return
          }
          originalWarn.apply(console, args)
        }
        
        console.error = (...args: unknown[]) => {
          const message = String(args[0] || '')
          if (message.includes('surveys')) {
            return
          }
          originalError.apply(console, args)
        }
      }
      setIsReady(true)
    }
  }, [])

  // If PostHog is not configured, just render children without provider
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  if (!isReady) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPageview />
      {children}
    </PHProvider>
  )
}
