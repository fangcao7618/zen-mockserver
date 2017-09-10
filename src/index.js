import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import utils from './utils';
import startMock from './startMock';

program
  .command('init').alias('i')
  .description('init workspace directory')
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
      startMock(runtimeDir);
    } else {
      console.log('请先指定配置文件夹');
    }

  });

program.parse(process.argv);
