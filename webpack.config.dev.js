const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({ 
  template: './public/index.html',
  inject: false
});

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './index.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    hot: false,
    inline: false,
    compress: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/react', '@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader'
          },
        ],
      }
    ]
  },
  plugins: [HTMLWebpackPluginConfig]
}
