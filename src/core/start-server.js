/**
 * Created by zhouyong on 17/10/31.
 */
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import proxy from 'http-proxy-middleware';
import c2k from 'koa2-connect';
import loadConfig from './config-loader';
import utils from './utils';

utils.info('启动。。。');
const app = new Koa();
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const time = Date.now() - start;
  utils.info(`${ctx.path}\t${time}ms`);
});

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
  extension: 'pug',
  map: {
    html: 'pug'
  }
}));


app.use(serve(__dirname + '/static'));

function getConfig(workspaceDir) {
  const configFilePath = path.resolve(workspaceDir, 'config', 'index.js');
  try {
    return utils.parseFileAsObject(configFilePath);
  } catch (e) {
    utils.error(e);
  }
}

// proxy
function loadProxy(app, workspaceDir) {

  let config;
  let proxyList;
  try {
    config = getConfig(workspaceDir);
    proxyList = config.proxy || [];
  } catch (e) {
    utils.error(e);
  }

  app.use(async (ctx, next) => {
    for(let i = 0; i < proxyList.length; i++) {
      let {path, target, headers, pathRewrite} = proxyList[i];
      const regex = new RegExp(path);

      if (regex.test(ctx.path)) {
        utils.info(`${ctx.path} === ${regex.test(ctx.path)}`);
        await c2k(
          proxy({
            logLevel: 'warn',
            target,
            // headers,
            pathRewrite,
            changeOrigin: true
          })
        )(ctx);
        return;
      }
    }

    await next();
  });

  return config;
}


export default function startMock(workspaceDir) {
  const router = loadConfig(workspaceDir);
  let config = getConfig(workspaceDir);
  utils.getAvailablePort(config.port)
    .then((port) => {
      app
        .use(router.routes())
        .use(router.allowedMethods());

      loadProxy(app, workspaceDir);
      app.listen(port);
      utils.info(`Ams is started，listening on http://localhost:${port}.`);
    });
}