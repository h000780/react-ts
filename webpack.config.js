module.exports = {
  mode: "development",
  entry: {
    desktop: "/source/desktop.js"
  },
  output: {},
  resolve: {
    extensions: ["*", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["css-loader", "style-loader"]
      }
    ]
  }
};
