const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
