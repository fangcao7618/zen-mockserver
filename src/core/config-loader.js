/**
 * Created by zhouyong on 17/10/31.
 */
import router from './router';
// import fs from 'fs';
import path from 'path';
import mockjs from 'mockjs';
import proxy from 'http-proxy-middleware';
import c2k from 'koa2-connect';
import utils from './utils';


function parseAllRequest(dataDir, router) {
  const requests = utils.parseFilesAsList(dataDir);
  requests.forEach((request) => {
    const method = request.method && request.method.toLowerCase();
    const url = request.url;
    const res = request.response;
    if (url !== undefined && method !== undefined) {
      router[method](url, (ctx) => {
        ctx.body = mockjs.mock(res);
      });
    }
  });
}

function registerMiddleware(middlewareDir, router) {
  try {
    const middlewares = utils.parseFilesAsList(middlewareDir);
    middlewares.forEach((mw) => {
      router.use(mw);
    });
  } catch (e) {
    utils.error('Please check your code in mock/middleware.');
    utils.error(e);
    process.exit(-1);
  }
}

function parseConfig(configFilePath, router) {
  let config;
  try {
    config = utils.parseFileAsObject(configFilePath);
    let proxyList = config.proxy || [];
    proxyList.forEach((conf) => {
      let {path, target, /*cookie,*/ pathRewrite } = conf;
      router.all(
        path,
        c2k(
          proxy({
            target,
            pathRewrite,
            changeOrigin: true
          })
        )
      );
    });

  } catch(e) {
    utils.error(e);
    utils.error('Please check your config folder.');
  }
  return config;
}

export default function (workspaceDir) {

  const dataDir = path.resolve(workspaceDir, 'data');
  const middlewareDir = path.resolve(workspaceDir, 'middleware');
  const configFilePath = path.resolve(workspaceDir, 'config', 'index.js');

  registerMiddleware(middlewareDir, router);
  parseAllRequest(dataDir, router);
  let config = parseConfig(configFilePath, router);

  return {
    router,
    port: config.port,
  };
}