/**
 * Created by zhouyong on 17/10/31.
 */
import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import utils from './utils';
import loadConfig from './config-loader';
import pkg from '../../package.json';

utils.checkNodeVersion();

program
  .version(pkg.version)
  .command('init').alias('i')
  .description('初始化工作目录')
  .action(async ()=> {
    const runtimeDir = path.resolve('.');
    const configDir = path.resolve(__dirname, '../src/template');
    if (utils.isDirEmpty(runtimeDir)) {
      fs.copySync(configDir, runtimeDir);
      console.log('初始化成功!');
    } else {
      console.log('[错误] 请选择一个空文件夹!');
    }
  });

program
  .command('start').alias('s')
// .option('-d, --dir', '指定工作目录')
  .description('启动MockServer')
  .action(async ()=> {
    const runtimeDir = path.resolve('.');
    if (fs.existsSync(runtimeDir)) {
      loadConfig(runtimeDir);
    } else {
      console.log('请先指定配置文件夹');
    }

  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
