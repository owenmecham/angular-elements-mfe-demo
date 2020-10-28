const execa = require('execa');
const path = require('path');
const ConcatPlugin = require('webpack-concat-plugin');

module.exports = {
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapPromise('AfterEmitPlugin', () => {
          return execa('npm', ['run', 'build:elements'], { stdio: 'inherit' });
        });
      },
    },
  ],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist",
    filename: '[name].js'
  }
};
