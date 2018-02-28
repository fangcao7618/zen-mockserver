/**
 * Created by zhouyong on 17/10/31.
 */
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const views = require('koa-views');
const proxy = require('http-proxy-middleware');
const c2k = require('koa2-connect');
const loadConfig = require('./config-loader');
const utils = require('./utils');

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

app.use(views( path.resolve(__dirname , '../views') , {
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
        if (target.toLowerCase() === 'local') {
          break;
        }
        await c2k(
          proxy({
            logLevel: 'warn',
            target,
            headers,
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


module.exports = async function startMock(workspaceDir) {
  let config = getConfig(workspaceDir);
  const port = await utils.getAvailablePort(config.port);

  loadProxy(app, workspaceDir);
  const router = loadConfig(workspaceDir);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(port);
  utils.info(`MockServer is started，listening on http://localhost:${port}.`);
};
