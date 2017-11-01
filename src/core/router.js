'use strict';

import koaRouter from 'koa-router';
import proxy from 'http-proxy-middleware';
import c2k from 'koa2-connect';

const router = koaRouter();

router.get('/', async (ctx) =>{
  await ctx.render('index.jade');
});

router.get(
  '/emojis',
  c2k(
    proxy({
      target: 'https://api.github.com',
      changeOrigin: true
    })
  )
);

export default router;
