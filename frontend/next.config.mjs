/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Proxy frontend /api requests to backend during development
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
