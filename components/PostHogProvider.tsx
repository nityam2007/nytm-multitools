'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check if PostHog key exists
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

    if (posthogKey && typeof window !== 'undefined') {
      // Initialize PostHog only if not already initialized
      if (!posthog.__loaded) {
        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: 'https://eu.posthog.com',
          capture_pageview: true,
          capture_pageleave: true,
          capture_exceptions: true,
          respect_dnt: true,
          persistence: 'localStorage+cookie',
          debug: process.env.NODE_ENV === 'development',
        })
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

  return <PHProvider client={posthog}>{children}</PHProvider>
}
