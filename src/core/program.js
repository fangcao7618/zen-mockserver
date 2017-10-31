/**
 * Created by zhouyong on 17/10/31.
 */
import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import utils from './utils';
import loadConfig from './config-loader';
import pkg from '../../package.json';

utils.checkNodeVersion();

program
  .version(pkg.version)
  .command('init')
  .description('Initialize workspace.')
  .action(async ()=> {
    const runtimeDir = path.resolve('.');
    const configDir = path.resolve(__dirname, '../src/template');
    if (utils.isDirEmpty(runtimeDir)) {
      fs.copySync(configDir, runtimeDir);
      utils.info('Please select an empty folder.');
    } else {
      utils.error('!');
    }
  });

program
  .command('start').alias('s')
// .option('-d, --dir', '指定工作目录')
  .description('start the mock server.')
  .action(async ()=> {
    const runtimeDir = path.resolve('.');
    if (fs.existsSync(runtimeDir)) {
      loadConfig(runtimeDir);
    } else {
      utils.warn('Please specify the configuration folder first.');
    }

  });

if (!process.argv.slice(2).length) {
  program.outputHelp((txt) => (colors.red(txt)));
}

export default program;