/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },

  // IMPORTANT: API routes require a server, so NO static export.
  output: undefined,
};

export default nextConfig;
