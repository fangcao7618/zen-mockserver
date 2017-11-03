/**
 * Created by zhouyong on 17/10/31.
 */
import program from 'commander';
import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import utils from './utils';
import startServer from './start-server';
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
      utils.info('Initialized successfully.');
    } else {
      utils.error('Please select an empty folder.');
    }
  });

program
  .command('start [dir]')
  .description('Start the mock server.')
  .action(async (dir)=> {
    let inputDir = dir || '';
    const runtimeDir = path.resolve('.', inputDir);
    utils.info(`Loading workspace from ${runtimeDir}.`);
    utils.checkWorkSpace(runtimeDir);
    startServer(runtimeDir);

  });

if (!process.argv.slice(2).length) {
  program.outputHelp((txt) => (colors.green(txt)));
}

export default program;