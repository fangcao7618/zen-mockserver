module.exports = {
  port: 9000,
  proxy: [
    // 接口转发
    {
      path: '/posts',
      target: 'https://jsonplaceholder.typicode.com',
      pathRewrite: {
        '^/posts' : '/photos',     // rewrite path
      },
    },
    // 不以/api 开头的请求转发到 http://localhost:3000/
    // 用以转发静态资源的请求
    {
      path: '^(?!/api)',
      target: 'http://localhost:3000/',
    },
  ]
};
