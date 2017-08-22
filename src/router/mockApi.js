/**
 * Created by zhouyong on 17/8/14.
 */
import router from './router';
import fs from 'fs';
import path from 'path';
import mockjs from 'mockjs';

function parseFilesAsObject(dir) {
  const list = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.resolve(dir, file);
    const module = eval(`require('${filePath}')`);
    list.push(module);
  });
  return list;
}

function parseAllRequest(dataDir, router) {
  const requests = parseFilesAsObject(dataDir);
  requests.forEach((request) => {
    const method = request.method.toLowerCase();
    const url = request.url;
    const res = request.response;
    router[method](url, (ctx) => {
      ctx.body = mockjs.mock(res);
    });
  });
}

function registerMiddleware(middlewareDir, router) {
  fs.readdirSync(middlewareDir).forEach(file => {
    const filePath = path.resolve(middlewareDir, file);
    const middlewareFunc = eval(`require('${filePath}')`);
    router.use(middlewareFunc);
  });
}

export default function (workspaceDir) {

  // const configDir = path.resolve(workspaceDir, 'config');
  const dataDir = path.resolve(workspaceDir, 'data');
  const middlewareDir = path.resolve(workspaceDir, 'middleware');

  registerMiddleware(middlewareDir, router);
  parseAllRequest(dataDir, router);

  return router;
}