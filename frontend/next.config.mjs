/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'mypuhh.s3.amazonaws.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
