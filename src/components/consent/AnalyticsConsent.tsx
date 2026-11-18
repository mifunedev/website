"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import InitialLoadActiveUsers from "@/components/users/InitialLoadActiveUsers";
import { Button } from "@/components/ui/button";
import {
  COOKIE_SETTINGS_EVENT,
  mayLoadAnalytics,
  readAnalyticsConsent,
  removeGoogleAnalyticsCookies,
  writeAnalyticsConsent,
  type ConsentStorage,
} from "@/lib/analytics-consent";

const PRIVACY_POLICY_URL = "https://console.mifune.dev/legal/privacy";

type DataLayerWindow = Window & { dataLayer?: unknown[] };

function gtag(..._args: unknown[]) {
  const target = window as DataLayerWindow;
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push(arguments);
}

function browserStorage(): ConsentStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function grantAnalyticsConsent(alreadyLoaded: boolean) {
  if (!alreadyLoaded) {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
  gtag("consent", "update", { analytics_storage: "granted" });
}

export default function AnalyticsConsent({ gaId }: { gaId: string }) {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const loadedRef = useRef(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);

  const loadAnalytics = useCallback(() => {
    grantAnalyticsConsent(loadedRef.current);
    loadedRef.current = true;
    setAnalyticsLoaded(true);
  }, []);

  useEffect(() => {
    const consent = readAnalyticsConsent(browserStorage());
    if (consent === null) {
      setBannerOpen(true);
    } else if (mayLoadAnalytics(consent)) {
      loadAnalytics();
    }

    const reopen = () => {
      focusOnOpen.current = true;
      setBannerOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, [loadAnalytics]);

  useEffect(() => {
    if (bannerOpen && focusOnOpen.current) {
      focusOnOpen.current = false;
      bannerRef.current?.focus();
    }
  }, [bannerOpen]);

  const accept = () => {
    writeAnalyticsConsent(browserStorage(), "granted");
    setBannerOpen(false);
    loadAnalytics();
  };

  const reject = () => {
    writeAnalyticsConsent(browserStorage(), "denied");
    setBannerOpen(false);
    if (loadedRef.current) {
      gtag("consent", "update", { analytics_storage: "denied" });
      removeGoogleAnalyticsCookies(document, window.location.hostname);
    }
  };

  return (
    <>
      {analyticsLoaded ? (
        <>
          <GoogleAnalytics gaId={gaId} />
          <InitialLoadActiveUsers />
        </>
      ) : null}
      {bannerOpen ? (
        <div
          ref={bannerRef}
          role="region"
          aria-label="Cookie consent"
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none p-4 focus-visible:outline-none"
        >
          <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <p className="font-montserrat text-sm leading-relaxed text-muted-foreground">
              We use Google Analytics cookies to understand site traffic, only
              if you accept.{" "}
              <a
                href={PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-foreground underline underline-offset-4 hover:text-oh-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
              >
                Privacy policy
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={reject}
                className="min-h-11 flex-1 px-6 focus-visible:ring-2 focus-visible:ring-oh-focus sm:flex-none"
              >
                Reject
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={accept}
                className="min-h-11 flex-1 px-6 focus-visible:ring-2 focus-visible:ring-oh-focus sm:flex-none"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}
