/**
 * Created by zhouyong on 17/10/31.
 */
const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');
const utils = require('./utils');
const startServer = require('./start-server');
const pkg = require('../../package.json');

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
    await startServer(runtimeDir);

  });

if (!process.argv.slice(2).length) {
  program.outputHelp((txt) => (colors.green(txt)));
}

module.exports = program;