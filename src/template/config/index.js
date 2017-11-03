module.exports = {
  port: 9000,
  proxy: [
    {
      path: '/posts',
      target: 'https://jsonplaceholder.typicode.com',
      pathRewrite: {
        '^/posts' : '/photos',     // rewrite path
      },
    },
    {
      path: '/api/users',
      target: 'https://jsonplaceholder.typicode.com',
      pathRewrite: function (path) {
        return path.replace('/api/users', '/users');
      },
      headers: {
        cookie: 'userId=xxxx'
      }
    },
  ]
};
