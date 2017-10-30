module.exports = {
  port: 9000,
  env: 'local', //local, dev, prod
  local: {
    url: 'http://localhost:9000'
  },
  dev: {
    url: 'http://10.128.8.4:6005',
    headers: {
      cookie: 'cookie.key=YzAyMVlUaEVZTXNIbjhqVGFQSmFzUkVZajBQMFh4ai84Q2VjSU9MNUdwbXVMaEpFRlptZjdTNm5JZFQ5YVVOYjNMRVlTZWxBRW5KSmJkRzVSWjhWWWFIa1g5eWw4QWlqTE01TkJCa2xrdGM9',
      test: 'test-dev'
    },
  },
  prod: {
    url: 'http://10.128.8.4:6005',
    headers: {
      cookie: 'cookie.key=YzAyMVlUaEVZTXNIbjhqVGFQSmFzUkVZajBQMFh4ai84Q2VjSU9MNUdwbXVMaEpFRlptZjdTNm5JZFQ5YVVOYjNMRVlTZWxBRW5KSmJkRzVSWjhWWWFIa1g5eWw4QWlqTE01TkJCa2xrdGM9',
      test: 'test-prod'
    }
  }
};
