const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        use: 'file-loader'
      },
      // {
      //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
      //   loader: 'file-loader',
      //   src: path.resolve(__dirname, src, assets)
      // }
    ],
  },
  devtool: 'source-map',
  devServer: {
    open: true,
    contentBase: './dist',
  },
};