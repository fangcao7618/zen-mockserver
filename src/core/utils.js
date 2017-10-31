/**
 * Created by zhouyong on 17/8/14.
 */
import fs from 'fs';
import path from 'path';
import net from 'net';
import compareVersions from 'compare-versions';
import colors from 'colors';

class Utils {
  constructor() {
    this.portrange = 45032;
  }

  isDirEmpty(dir) {
    const files = fs.readdirSync(dir, 'utf8');
    return files.length === 0;
  }

  checkWorkSpace() {

  }

  parseFilesAsObject(dir) {
    const list = [];
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.resolve(dir, file);
      const module = eval(`require('${filePath}')`);
      list.push(module);
    });
    return list;
  }

  findProxy(data, path) {
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
  }

  getDynamicPort(cb) {
    let port = this.portrange;
    this.portrange += 1;
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        cb(port);
      });
      server.close();
    });
    server.on('error', () => {
      this.getDynamicPort(cb);
    });
  }

  checkNodeVersion() {
    if (compareVersions(process.versions.node, '7.6.0') === -1) {
      this.error('The version of Node.js should be higher than v7.6.0.');
      process.exit(-1);
    }
  }

  info(msg) {
    this.print('[info] ', colors.green(msg));
  }

  error(msg) {
    this.print('[error] ', colors.red(msg));
  }

  warn(msg) {
    this.print('[warning] ', colors.yellow(msg));
  }

  print(...args) {
    /* eslint-disable no-console */
    console.log(...args);
    /* eslint-enable no-console */
  }

}

export default new Utils();