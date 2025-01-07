// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com'], // Allowed domains for images
    },
    serverExternalPackages: ["mongoose"], // External server-side packages
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true, // Enable top-level await
      };
      return config;
    },
  };
  
  export default nextConfig;
  