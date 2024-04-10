const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devTool = devMode ? 'inline-source-map' : undefined;
const devServer = devMode ? { static: path.resolve(__dirname, './dist') } : undefined;

module.exports = {
  entry: path.resolve(__dirname, './src/index'),
  mode: mode,
  devtool: devTool,
  devServer: devServer,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      // favicon: path.resolve(__dirname, './src/favicon.ico'),
    }),
    new CleanWebpackPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src/img'),
    //       to: path.resolve(__dirname, 'dist/img'),
    //     },
    //   ],
    // }),
    new EslingPlugin({ extensions: 'ts' }),
  ],
};