/**
 * Created by zhouyong on 17/8/14.
 */
const fs = require('fs');
const path = require('path');
const net = require('net');
const compareVersions = require('compare-versions');
const colors = require('colors');

class Utils {
  isDirEmpty(dir) {
    const files = fs.readdirSync(dir, 'utf8');
    return files.length === 0;
  }

  exist(filePath) {
    return fs.existsSync(filePath);
  }

  checkWorkSpace(runtimeDir, filesShouldExist) {
    let valid = true;
    filesShouldExist = filesShouldExist || [
      '',
      'config',
      ['config', 'index.js'],
      'data',
    ];
    let filePathShouldExist = filesShouldExist.map(item => {
      if (typeof item === 'string') {
        return path.resolve(runtimeDir, item);
      } else {
        return path.resolve.apply(path, [runtimeDir, ...item]);
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
    return this._parseFilesAsList(dir, []);
  }

  _parseFilesAsList(dir, list) {
    // const list = [];
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.resolve(dir, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        this._parseFilesAsList(filePath, list);
      }
      const module = this.parseFileAsObject(filePath);
      if (module) {
        list.push(module);
      }
    });
    return list;
  }

  clearRequireCache(path) {
    const cache = require.cache[path];
    if (cache) {
      delete require.cache[path];
      cache.children.forEach(modal => this.clearRequireCache(modal.id));
    }
  }

  parseFileAsObject(pathname) {
    if (!/.*\.js(on)?$/.test(pathname)) {
      return null;
    }
    this.clearRequireCache(pathname);
    return eval(`require(path.resolve(pathname))`);
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
    this.print(colors.green('[提示] '), colors.green(msg));
  }

  error(msg) {
    this.print(colors.red('[错误] '), colors.red(msg));
  }

  warn(msg) {
    this.print(colors.yellow('[警告] '), colors.yellow(msg));
  }

  print(...args) {
    /* eslint-disable no-console */
    console.log(...args);
    /* eslint-enable no-console */
  }

}

module.exports = new Utils();