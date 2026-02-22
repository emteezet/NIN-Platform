/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow serving uploaded images
  images: {
    remotePatterns: [],
  },
  // Needed for PDFKit to work in API routes
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
