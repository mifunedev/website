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

const APP_NAME = "ruska";
const APP_DEFAULT_TITLE = "RUSKA - Steerable Harnesses for DeepAgents";
const APP_TITLE_TEMPLATE = "%s | Ruska Labs";
const APP_DESCRIPTION =
  "Steerable Harnesses for DeepAgents";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
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
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000",
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
