module.exports = {
  plugins: {
    'postcss-plugin': (css) => {
      return process(css).then(result => {
        return result;
      });
    },
  },
};
