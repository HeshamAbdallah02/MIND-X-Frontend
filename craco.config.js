// frontend/craco.config.js
module.exports = {
  devServer: (devServerConfig) => {
    return {
      ...devServerConfig,
      onBeforeSetupMiddleware: undefined,
      onAfterSetupMiddleware: undefined,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }
        return middlewares;
      },
    };
  },
  webpack: {
    configure: (webpackConfig) => {
      return {
        ...webpackConfig,
        devServer: {
          ...webpackConfig.devServer,
          onBeforeSetupMiddleware: undefined,
          onAfterSetupMiddleware: undefined,
          setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
              throw new Error('webpack-dev-server is not defined');
            }
            return middlewares;
          },
        },
      };
    },
  },
};