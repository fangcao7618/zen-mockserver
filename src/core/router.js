'use strict';

const koaRouter = require('koa-router');

const router = koaRouter();

router.get('/api', async (ctx) =>{
  await ctx.render('index.pug');
});

module.exports = router;
