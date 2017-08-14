import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import utils from './utils';
import startMock from './startMock';

program
  .command('init').alias('i')
  .description('init config directory')
  .action(async ()=> {
    const runtimeDir = path.resolve('.');
    const configDir = path.resolve(__dirname, '../src/config');
    if (utils.isDirEmpty(runtimeDir)) {
      fs.copySync(configDir, path.resolve(runtimeDir, 'config'));
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
    const runtimeDir = path.resolve('.', 'config');
    startMock(runtimeDir);
    console.log('MockServer已经启动，监听9000端口');
  });

program.parse(process.argv);
