const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Process both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Process .css files
        use: ['style-loader', 'css-loader'], // Apply loaders for CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Process image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/', // Output directory for images
              publicPath: 'images/', // Public URL path for images
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow importing without specifying extensions
  },
  devtool: 'source-map', // Optional: helps with debugging
};
