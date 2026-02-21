import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <div className="flex flex-1 relative w-full">
            <Sidebar />
            <main className="flex-1 w-full md:ml-64 md:px-8">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
