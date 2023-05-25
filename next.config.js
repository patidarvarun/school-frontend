/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "mdx", "md", "jsx", "js", "tsx"],
};

module.exports = nextConfig;
