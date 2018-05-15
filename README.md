# zen-mock-server
一个实用的mock工具

#### 运行环境
- [node.js](https://nodejs.org/) **v7.6** 以上
- [npm](https://www.npmjs.com/) v3 以上

#### 安装
```sh
$ npm install -g zen-mock-server
```
也可以仅在项目中使用：
```sh
$ npm install zen-mock-server --save-dev
```
然后在package.json的scripts中添加：
```
"mock:dev": "mock start ../mockDir"
```

#### 快速使用

初始化配置文件
```sh
$ mock init 
```
会在当前文件夹下初始化配置文件。

启动服务 
```sh
$ mock start [mockDir]
```
浏览器访问 `http://localhost:9000/person` 查看API
> 注意： 上面不一定是9000端口，如果9000端口号被占用，mock工具则会使用9001端口，以此类推

#### 文件配置
`zen-mock-server（以下简称mock）`配置文件分为三部分，可以参考`mock init`生成的目录: 
- `config`：用于端口、代理等全局配置
- `data`：自定义mock数据配置， 如demo.json：
```json
{
  "method": "get",
  "url": "/person",
  "response": {
    "status": 0,
    "msg": "success",
    "data|4-10": [  // 这里使用的是mockjs的语法
      {
        "name": "zhangsan",
        "age|+1": 13
      }
    ]
  }
}
```
- `middleware`：可根据需求自定义中间件

#### 贡献代码
欢迎大家贡献代码 : ) 

