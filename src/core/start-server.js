/**
 * Created by zhouyong on 17/10/31.
 */
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import loadConfig from './config-loader';
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

// todo: instead with http-proxy-middleware
export default function startMock(workspaceDir) {
  const router = loadConfig(workspaceDir);

  utils.getAvailablePort(8000)
    .then((port) => {
      app
        .use(router.routes())
        .use(router.allowedMethods());

      app.listen(port);
      utils.info(`MockServer已经启动，监听${port}端口`);
    });
}