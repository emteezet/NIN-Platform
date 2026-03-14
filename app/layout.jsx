import "./globals.css";
import Providers from "@/components/Providers";
import OfflineBanner from "@/components/OfflineBanner";
import SWRegistration from "@/components/SWRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export const metadata = {
  title: "NIN Slip Generator | Third-Party Simulation",
  description:
    "A school project simulation of a third-party NIN slip and ID card generator. Not affiliated with NIMC or any government agency.",
  keywords: [
    "NIN",
    "National Identification Number",
    "Nigeria",
    "ID Card",
    "simulation",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NIN-Platform",
  },
  icons: {
    apple: "/icon-192x192.png",
  }
};

export const viewport = {
  themeColor: "#008751",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <OfflineBanner />
          {children}
        </Providers>
        <SWRegistration />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
