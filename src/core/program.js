/**
 * Created by zhouyong on 17/10/31.
 */
const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');
const utils = require('./utils');
const startServer = require('./start-server');
const toSwagger = require('./to-swagger');
const pkg = require('../../package.json');

utils.checkNodeVersion();

program
  .version(pkg.version)
  .command('init [dir]')
  .description('初始化工作目录.')
  .action(async (dir)=> {
    let inputDir = dir || '';
    const runtimeDir = path.resolve('.', inputDir);
    const configDir = path.resolve(__dirname, '../template');
    if (!utils.exist(runtimeDir)) {
      utils.error(`路径不存在，请选择正确的路径: ${runtimeDir}`);
      return;
    }
    if (utils.isDirEmpty(runtimeDir)) {
      fs.copySync(configDir, runtimeDir);
      utils.info('初始化成功，生成了config，data，middlewate等文件夹。');
    } else {
      utils.error('请选择一个空的文件夹.');
    }
  });

program
  .command('start [dir]')
  .description('启动Mock Server.')
  .action(async (dir)=> {
    let inputDir = dir || '';
    const runtimeDir = path.resolve('.', inputDir);
    utils.info(`从路径${runtimeDir}加载配置文件.`);
    utils.checkWorkSpace(runtimeDir);
    await startServer(runtimeDir);
  });

program
  .command('swagger [dir]')
  .description('生成swagger描述文件.')
  .action(async (dir)=> {
    let inputDir = dir || '';
    const runtimeDir = path.resolve('.', inputDir);
    utils.info(`从路径${runtimeDir}加载配置文件.`);
    const filesShouldExist =[
      '',
      'config',
      ['config', 'index.js'],
      'swagger-template',
      ['swagger-template', 'index.json'],
      'data',
    ];
    utils.checkWorkSpace(runtimeDir, filesShouldExist);

    toSwagger(runtimeDir);
  });

if (!process.argv.slice(2).length) {
  program.outputHelp((txt) => (colors.green(txt)));
}

module.exports = program;