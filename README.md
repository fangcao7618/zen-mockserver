![Zen Logo](./public/images/zen_logo.png)
# zen-mockserver
一个实用的mock工具

### 运行环境
- [node.js](https://nodejs.org/) **v7.6** 以上
- [npm](https://www.npmjs.com/) v3 以上
- MacOS/Linux系统

> 由于我们的开发使用的都是MacOS/Linux系统，Windows下没有严格测试，稍后会支持。

### 安装
```sh
$ npm install -g zen-mockserver
```
也可以仅在项目中使用：
```sh
$ npm install zen-mockserver --save-dev
```

### 快速使用

1. 创建一个空文件夹，然后在该文件夹下初始化mockserver所需的配置文件
```sh
$ mkdir demo-project && cd demo-project
$ mock init 
```
会在当前文件夹下初始化配置文件，你将看到生成了如下的目录结构：
```bash
.
├── config
│   ├── index.js
│   └── local.js
├── data
│   └── demo.json
├── middleware
│   └── monitor.js
├── swagger-template
│   └── index.json
└── utils
    └── index.js 
```

2. 编写Mock Data
在`data`文件夹新建文件`demo-students.json`，输入如下内容:
```json
{
  "method": "get",
  "url": "/api/students",
  "response": {
    "status": 0,
    "msg": "success",
    "data|4-10": [
      {
        "name": "zhangsan",
        "age|+1": 13
      }
    ]
  }
}

```
并保存。

> 上述我们使用了`data|4-10`，`age|+1`等[mockjs](http://mockjs.com/examples.html)语法，

3. 启动服务
```sh
$ mock start
```
浏览器访问 `http://localhost:9000/api/students` 查看API
> 注意： 上面不一定是9000端口，如果9000端口号被占用，mock工具则会使用9001端口，以此类推

### 配置说明
`zen-mockserver（以下简称mock）`配置文件分为三部分，可以参考`mock init`生成的目录: 
- `config`：用于端口、代理等全局配置
- `middleware`：可根据需求自定义中间件
- `data`：自定义mock数据配置， 如demo.json：
```json
{
  "method": "get",
  "url": "/person",
  "response": {
    "status": 0,
    "msg": "success",
    "data|4-10": [
      {
        "name": "zhangsan",
        "age|+1": 13
      }
    ]
  }
}
```
上述`data|4-10`使用的是[mockjs](http://mockjs.com/examples.html)语法。


#### 如何配置代理
配置文件默认在`config/local.js` 下面，你可以设置环境变量`MOCK_CONFIG_FILE_NAME`，eg：`MOCK_CONFIG_FILE_NAME=my`，则mockserver会加载`config/my.js`下的配置文件。
- port [number] 默认启动mockserver的端口
- proxy [array] 代理配置

#### 示例配置
```js
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
      header: {
        cookie: 'sessionid=1001',
      }
    },
    // 不以/api 开头的请求转发到 http://localhost:3000/
    // 用以转发静态资源的请求
    {
      path: '^(?!/api)',
      target: 'http://localhost:3000/',
    },
  ]
};
```

### 贡献代码
欢迎大家贡献代码 : ) 

