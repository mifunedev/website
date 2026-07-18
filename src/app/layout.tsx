import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import InitialLoadActiveUsers from "@/components/users/InitialLoadActiveUsers";
import JsonLd from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/theme-provider";
import { GA_ID, NODE_ENV, SITE_URL } from "@/config/app";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

const APP_NAME = "Mifune";
const APP_DEFAULT_TITLE =
  "Run coding agents in a sandbox, not on your machine.";
const APP_TITLE_TEMPLATE = "%s | Mifune";
const APP_DESCRIPTION =
  "Open Harness connects one repository to an isolated, persistent Docker workspace for your preferred coding agent. Self-host it or choose Mifune-managed Open Harness Cloud.";

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
    "coding agent workspace",
    "persistent Docker workspace",
    "Open Harness",
    "Open Harness Cloud",
    "managed coding agent workspace",
    "self-hosted Open Harness",
    "coding agent engineering support",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
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
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
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
        {NODE_ENV === "production" && GA_ID ? (
          <>
            <GoogleAnalytics gaId={GA_ID} />
            <InitialLoadActiveUsers />
          </>
        ) : null}
      </body>
    </html>
  );
}
