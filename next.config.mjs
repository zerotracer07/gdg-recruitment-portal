/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["avatar.vercel.sh"],
    },
    experimental: {
        // Tree-shake the giant icon lib: dev compiles ~8900 modules otherwise
        optimizePackageImports: ["lucide-react"],
    },
};

export default nextConfig;
