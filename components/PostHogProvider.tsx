// PostHog Analytics Provider | TypeScript
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useState, Suspense, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// PostHog Pageview Tracker Component for SPA navigation
function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      const search = searchParams?.toString()
      if (search) {
        url = url + '?' + search
      }
      
      // Capture pageview with full context
      posthogClient.capture('$pageview', {
        $current_url: url,
        $pathname: pathname,
        $host: window.location.host,
        $referrer: document.referrer || undefined,
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

  const initPostHog = useCallback(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (!posthogKey || !posthogHost || typeof window === 'undefined') {
      return false
    }

    if (posthog.__loaded) {
      return true
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
      
      // Pageview & Navigation
      capture_pageview: false, // Manual capture for SPA navigation accuracy
      capture_pageleave: true, // Track when users leave pages
      
      // Autocapture - capture all user interactions
      autocapture: {
        dom_event_allowlist: ['click', 'change', 'submit'],
        element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'],
        css_selector_allowlist: ['[data-ph-capture]', '[data-track]'],
        capture_copied_text: true,
      },
      
      // Exception & Error Tracking
      capture_exceptions: true,
      
      // Session Recording
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
        maskTextSelector: '[data-ph-mask]',
        recordCrossOriginIframes: false,
      },
      
      // Performance & Web Vitals
      capture_performance: true,
      
      // Persistence
      persistence: 'localStorage+cookie',
      
      // Person Profiles - create profiles for all users
      person_profiles: 'always',
      
      // Property sanitization - keep default properties
      property_denylist: [],
      
      // Enable heatmaps
      enable_heatmaps: true,
      
      // Cross-subdomain tracking
      cross_subdomain_cookie: true,
      
      // Secure cookies in production
      secure_cookie: window.location.protocol === 'https:',
      
      // Loaded callback
      loaded: (ph) => {
        // Set super properties that persist across all events
        ph.register({
          app_name: 'NYTM Tools',
          app_version: '1.6.0',
          platform: 'web',
        })
        
        // Capture initial session start
        ph.capture('$session_start', {
          $referrer: document.referrer || undefined,
          $referring_domain: document.referrer ? new URL(document.referrer).hostname : undefined,
        })
      },
    })

    return true
  }, [])

  useEffect(() => {
    const initialized = initPostHog()
    setIsReady(initialized)
  }, [initPostHog])

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

// Export posthog instance for direct usage in components
export { posthog }

// Helper hook to capture custom events with proper typing
export function useTrackEvent() {
  const posthogClient = usePostHog()
  
  return useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (posthogClient) {
      posthogClient.capture(eventName, {
        ...properties,
        $current_url: window.location.href,
        timestamp: new Date().toISOString(),
      })
    }
  }, [posthogClient])
}
