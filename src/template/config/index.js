module.exports = {
  port: 9000,
  proxy: [
    {
      path: '/emojis',
      target: 'https://api.github.com',
      pathRewrite: {
        '^/emojis' : '/events',     // rewrite path
      },
      cookie: 'xxxxxxxxxx'
    }
  ]
};
