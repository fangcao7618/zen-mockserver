module.exports = {
  port: 9000,
  proxy: [
    {
      path: 'emojis',
      target: 'https://api.github.com/emojis',
      cookie: 'xxxxxxxxxx'
    },
    {
      path: '/users/',
      target: 'https://api.github.com/users/',
      cookie: 'xxxxxxxxxx'
    }
  ]
};
