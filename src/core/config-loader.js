/**
 * Created by zhouyong on 17/10/31.
 */
import router from './router';
import path from 'path';
import mockjs from 'mockjs';
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

export default function (workspaceDir) {

  const dataDir = path.resolve(workspaceDir, 'data');
  const middlewareDir = path.resolve(workspaceDir, 'middleware');

  registerMiddleware(middlewareDir, router);
  parseAllRequest(dataDir, router);

  return router;
}