/**
 * Created by zhouyong on 17/8/14.
 */
import fs from 'fs';
import path from 'path';
import net from 'net';

const utils = {};

utils.isDirEmpty = function(dir) {
  const files = fs.readdirSync(dir, 'utf8');
  return files.length === 0;
};

utils.checkWorkSpace = function() {

};

utils.parseFilesAsObject = function (dir) {
  const list = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.resolve(dir, file);
    const module = eval(`require('${filePath}')`);
    list.push(module);
  });
  return list;
};

utils.findProxy = function(data, path) {
  let proxyPass;
  for(let i = 0; i < data.length; i++) {
    if (data[i].location instanceof RegExp &&
      data[i].proxyPass !== undefined &&
      data[i].location.test(path)) {
      proxyPass = data[i].proxyPass;
      break;
    }
  }
  return proxyPass;
};


let portrange = 45032;
utils.getDynamicPort = (cb) => {
  let port = portrange;
  portrange += 1;
  const server = net.createServer();
  server.listen(port, () => {
    server.once('close', () => {
      cb(port);
    });
    server.close();
  });
  server.on('error', () => {
    utils.getDynamicPort(cb);
  });
};

export default utils;