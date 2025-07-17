import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      
      {
        source: '/tools',
        destination: '/apps',
        permanent: true,
      },
      {
        source: '/:locale/tools',
        destination: '/:locale/apps',
        permanent: true,
      },
    ];
  },
  // 性能优化配置
  experimental: {
    // 确保兼容性
    esmExternals: true,
    // 优化服务器组件
    serverComponentsExternalPackages: ['canvas'],
    // 优化包导入
    optimizePackageImports: [
      '@/components/ui',
      '@/lib',
      'lucide-react',
      'react-icons',
    ],
  },
  // 优化构建
  transpilePackages: [],
  
  // 压缩优化
  compress: true,
  
  // 静态文件缓存配置
  async headers() {
    return [
      {
        source: '/imgs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  
  // Webpack 优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 工具组件单独打包
          tools: {
            name: 'tools',
            chunks: 'all',
            test: /[\\/]components[\\/]tools[\\/]/,
            priority: 40,
          },
          // UI 组件单独打包
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]components[\\/]ui[\\/]/,
            priority: 30,
          },
          // 块组件单独打包
          blocks: {
            name: 'blocks',
            chunks: 'all',
            test: /[\\/]components[\\/]blocks[\\/]/,
            priority: 20,
          },
          // 供应商库
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  // 环境变量兼容
  env: {
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL ,
    NEXT_PUBLIC_AUTH_GOOGLE_ENABLED: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED || 'false',
    NEXT_PUBLIC_AUTH_GITHUB_ENABLED: process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED || 'false',
    NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED || 'false',
    NEXT_PUBLIC_LOCALE_DETECTION: process.env.NEXT_PUBLIC_LOCALE_DETECTION || 'false',
  },
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    ...nextConfig.experimental,
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
