/**
 * Created by zhouyong on 17/8/14.
 */
import router from './router';
import fs from 'fs';
import path from 'path';
import mockjs from 'mockjs';

function getAllRequest(configDir) {
  const requests = [];
  // configDir = `/Users/zhouyong/Desktop/didi/sea-mock-server/src/config`;
  fs.readdirSync(configDir).forEach(file => {
    const absPath = path.resolve(configDir, file);
    try {
      const data = fs.readFileSync(absPath, 'utf8');
      requests.push(mockjs.mock(JSON.parse(data)));
    } catch(e) {
      console.error(`[Error] in file: ${file}`);
      console.error(`[Error] ${e.message}`);
    }
  });
  return requests;
}

export default function (configDir) {

  const requests = getAllRequest(configDir);

  requests.forEach((request) => {
    const method = request.method.toLowerCase();
    const url = request.url;
    const res = request.response;
    router[method](url, (ctx) => {
      ctx.body = res;
    });
  });

  return router;
}