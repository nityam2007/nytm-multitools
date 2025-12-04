// PostHog Analytics Provider | TypeScript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// PostHog Pageview Tracker Component for SPA navigation
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
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (posthogKey && posthogHost && typeof window !== 'undefined') {
      if (!posthog.__loaded) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: false, // We handle pageviews manually for SPA navigation
          capture_pageleave: true,
          capture_exceptions: true,
          autocapture: true,
          session_recording: {
            maskAllInputs: false,
            maskInputOptions: {
              password: true,
            },
          },
          persistence: 'localStorage+cookie',
          bootstrap: {
            distinctID: undefined,
          },
        })
      }
      setIsReady(true)
    }
  }, [])

  // If PostHog is not configured, just render children without provider
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
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
