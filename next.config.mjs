/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev access from local network IP
  allowedDevOrigins: ['192.168.1.6'],
  // Allow serving uploaded images
  images: {
    remotePatterns: [],
  },
  // Needed for PDFKit to work in API routes
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
