import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import InitialLoadActiveUsers from "@/components/users/InitialLoadActiveUsers";
import { GA_ID, NODE_ENV, SITE_URL } from "@/config/app";
import { ThemeProvider } from "@/components/theme-provider";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
// import { botScript } from "@/config/bot";

// Primary font - Montserrat for clean, minimal UI elements
const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

// Futuristic font for "Be Present" headline
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

const APP_NAME = "mifune";
const APP_DEFAULT_TITLE = "Mifune – AI Workers for Your Business, Built & Managed";
const APP_TITLE_TEMPLATE = "%s | Mifune";
const APP_DESCRIPTION =
  "Free AI Workflow Audit with real feedback in one business day — no meetings, no BS. We build and manage AI workers in your business; you own everything.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "AI automation",
    "managed AI workers",
    "AI implementation",
    "business automation",
    "AI workflow audit",
    "OpenHarness",
    "done-for-you AI",
    "AI partner",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    url: SITE_URL,
    locale: "en_US",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    // Match the navbar (bg-background) light/dark --background tokens from globals.css
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // hsl(0 0% 100%)
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }, // hsl(240 10% 3.9%)
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${montserrat.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-montserrat">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
      {NODE_ENV === "production" && GA_ID && (
        <>
          <GoogleAnalytics gaId={GA_ID} />
          <InitialLoadActiveUsers />
        </>
      )}
    </html>
  );
}
