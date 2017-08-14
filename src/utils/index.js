/**
 * Created by zhouyong on 17/8/14.
 */
import fs from 'fs';

const utils = {};

utils.isDirEmpty = function(dir) {
  const files = fs.readdirSync(dir, 'utf8');
  return files.length === 0;
};

utils.checkWorkSpace = function() {

};

export default utils;