import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import InitialLoadActiveUsers from "@/components/users/InitialLoadActiveUsers";
import { GA_ID, NODE_ENV } from "@/config/app";
import { ThemeProvider } from "@/components/theme-provider";
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
const APP_DEFAULT_TITLE = "Mifune - Managed AI Workers for Your Business";
const APP_TITLE_TEMPLATE = "%s | Mifune";
const APP_DESCRIPTION =
  "Deploy managed AI workers into your business without hiring more staff. Mifune builds and maintains AI automation for non-technical business owners.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
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
  openGraph: {
    type: "website",
    siteName: APP_NAME,
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
  themeColor: "#22c55e",
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
