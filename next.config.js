/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles this automatically, but good to be explicit
  reactStrictMode: true,
  // Allow external images if needed
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'oyenino.com' },
    ],
  },
};

module.exports = nextConfig;
