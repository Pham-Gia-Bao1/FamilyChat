const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // Các cấu hình khác của Webpack
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url/"),
      // Có thể thêm các polyfill khác nếu cần
    },
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  // Các cấu hình khác của Webpack
};
