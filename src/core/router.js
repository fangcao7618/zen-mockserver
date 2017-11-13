'use strict';

import koaRouter from 'koa-router';

const router = koaRouter();

router.get('/api', async (ctx) =>{
  await ctx.render('index.pug');
});

export default router;
