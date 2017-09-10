/**
 * Created by zhouyong on 17/8/14.
 */
import router from './router';
// import fs from 'fs';
import path from 'path';
import mockjs from 'mockjs';
import utils from '../utils';


function parseAllRequest(dataDir, router) {
  const requests = utils.parseFilesAsObject(dataDir);
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
  const middlewares = utils.parseFilesAsObject(middlewareDir);
  middlewares.forEach((mw) => {
    router.use(mw);
  });
}

export default function (workspaceDir) {

  const dataDir = path.resolve(workspaceDir, 'data');
  const middlewareDir = path.resolve(workspaceDir, 'middleware');

  registerMiddleware(middlewareDir, router);
  parseAllRequest(dataDir, router);

  return router;
}