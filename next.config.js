/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["drive.google.com"],
    protocol: "https",
    port: "",
  },
};

module.exports = nextConfig;
