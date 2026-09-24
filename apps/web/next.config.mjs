/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@next-digital-crm/shared-types"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
