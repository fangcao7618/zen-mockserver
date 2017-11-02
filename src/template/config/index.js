module.exports = {
  port: 9000,
  proxy: [
    {
      path: '/emojis',
      target: 'https://api.github.com',
      pathRewrite: {
        '^/emojis' : '/events',     // rewrite path
      },
    },
    {
      path: '/users/:id',
      target: 'https://api.github.com',
      pathRewrite: function (path) {
        return path + '/repos';
      },
      headers: {
        cookie: 'userId=xxxx'
      }
    },
  ]
};
