import "./globals.css";
import Providers from "@/components/Providers";
import OfflineBanner from "@/components/OfflineBanner";

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
  themeColor: "#008751",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NIN-Platform",
  },
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
      </body>
    </html>
  );
}

function SWRegistration() {
  const { useEffect } = require("react");
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registered:", registration))
        .catch((error) => console.log("SW registration failed:", error));
    }
  }, []);
  return null;
}
