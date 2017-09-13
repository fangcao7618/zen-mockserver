/**
 * Created by zhouyong on 17/8/14.
 */
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import http from 'http';
import httpProxy from 'http-proxy';
import url from 'url';
import mockApi from './router/mockApi.js';
import utils from './utils';


const app = new Koa();


app.use(async function(ctx, next){
  try{
    await next();
  }catch(err){
    ctx.status = err.status || 500;
    ctx.body = err.message;
    // logger.error(err);
  }
});

app.use(views( path.resolve(__dirname , '../src/views') , {
  extension: 'jade',
  pretty: true, //not work?? why???
  map: {
    jade: 'jade'
  }
}));


app.use(serve(__dirname + '/static'));

export default function startMock(workspaceDir) {
  const router = mockApi(workspaceDir);
  const configFile = path.resolve(workspaceDir, 'config', 'index.js');
  const config = eval(`require('${configFile}')`);

  const dataDir = path.resolve(workspaceDir, 'data');
  const data = utils.parseFilesAsObject(dataDir);

  const proxy = httpProxy.createProxyServer({});

  const port = config.port || 9000; // 默认端口
  utils.getDynamicPort((dynamicPort) => {
    // console.log('dynamicPort:', dynamicPort);
    http.createServer(function (req, res) {
      const path = url.parse(req.url).pathname;
      let proxyPass = utils.findProxy(data, path);
      if (proxyPass !== undefined) {
        proxy.web(req, res, {target: proxyPass});
      } else {
        proxy.web(req, res, {target: `http://localhost:${dynamicPort}`});
      }
      app.callback(req, res);
    }).listen(port);

    app
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(dynamicPort);
    console.log(`MockServer已经启动，监听${port}端口`);
  });
}