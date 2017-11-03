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
    this.portrange = 8000;
  }

  isDirEmpty(dir) {
    const files = fs.readdirSync(dir, 'utf8');
    return files.length === 0;
  }

  exist(filePath) {
    return fs.existsSync(filePath);
  }

  checkWorkSpace(runtimeDir) {
    let valid = true;
    const filesShouldExist = [
      '',
      'config',
      ['config', 'index.js'],
      'data',
    ];
    let filePathShouldExist = filesShouldExist.map(item => {
      if (typeof item === 'string') {
        return path.resolve(runtimeDir, item);
      } else {
        return path.resolve.apply(path, item);
      }
    });

    filePathShouldExist.forEach(filePath => {
      if (!this.exist(filePath)) {
        this.error(`File not found: ${filePath}`);
        valid = false;
      }
    });

    if (!valid) {
      this.error('Please make sure your workspace is correct.');
      process.exit(-1);
    }
  }

  parseFilesAsList(dir) {
    const list = [];
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.resolve(dir, file);
      const module = this.parseFileAsObject(filePath);
      list.push(module);
    });
    return list;
  }

  parseFileAsObject(path) {
    return eval(`require('${path}')`);
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

  _getDynamicPort(cb, port) {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        cb(port);
      });
      server.close();
    });
    server.on('error', () => {
      this._getDynamicPort(cb, port + 1);
    });
  }

  getAvailablePort(initPort=9000) {
    return new Promise((resolve) => {
      this._getDynamicPort((port) => {
        resolve(port);
      }, initPort);
    });
  }

  checkNodeVersion() {
    if (compareVersions(process.versions.node, '7.6.0') === -1) {
      this.error('The version of Node.js should be higher than v7.6.0.');
      process.exit(-1);
    }
  }

  info(msg) {
    this.print(colors.green('[info] '), colors.green(msg));
  }

  error(msg) {
    this.print(colors.red('[error] '), colors.red(msg));
  }

  warn(msg) {
    this.print(colors.yellow('[warning] '), colors.yellow(msg));
  }

  print(...args) {
    /* eslint-disable no-console */
    console.log(...args);
    /* eslint-enable no-console */
  }

}

export default new Utils();