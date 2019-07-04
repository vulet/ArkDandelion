const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
  entry: {
    options: ['./src/scripts/options.js', './src/styles/styles.scss'],
    popup: ['./src/scripts/popup.js', './src/styles/styles.scss'],
    createtx: ['./src/scripts/createtx.js', './src/styles/styles.scss'],
    background: ['./src/scripts/background.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build', process.env.TARGET),
    filename: 'scripts/[name].js',
    publicPath: '',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
              context: './src/styles/',
              outputPath: 'css/',
              publicPath: '../',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  require('autoprefixer'),
                  require('tailwindcss')('./tailwind.js'),
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets',
      },
      {
        from: `src/manifest.${process.env.TARGET}.json`,
        to: 'manifest.json',
      },
    ]),
    new HtmlWebpackPlugin({
      template: 'src/options.html',
      inject: false,
      filename: 'options.html',
    }),
    new HtmlWebpackPlugin({
      template: 'src/popup.html',
      inject: false,
      filename: 'popup.html',
    }),
    new HtmlWebpackPlugin({
      template: 'src/createtx.html',
      inject: false,
      filename: 'createtx.html',
    }),
  ],
});
