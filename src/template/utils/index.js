/**
 * Created by zhouyong on 17/8/21.
 */

const utils = {};

utils.printLog = function (path, totalTime) {
  console.log(`${path}\tX-Response-Time: ${totalTime}ms`);
};

module.exports = utils;
