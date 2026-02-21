/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow serving uploaded images
  images: {
    remotePatterns: [],
  },
  // Needed for PDFKit to work in API routes
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
};

export default nextConfig;
