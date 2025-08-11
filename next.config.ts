import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // Increase the server action timeout to 2 minutes to allow for video generation
  serverActions: {
    bodySizeLimit: '4mb',
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  reactStrictMode: true,
};

if (process.env.NODE_ENV === 'development') {
    nextConfig.experimental = {
        ...nextConfig.experimental,
        serverActions: {
            ...nextConfig.experimental?.serverActions,
            // Increase timeout for server actions in development
            // to allow for slower video generation.
            executionTimeout: 120, // 2 minutes
        },
    }
}


export default nextConfig;
