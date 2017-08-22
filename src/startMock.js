/**
 * Created by zhouyong on 17/8/14.
 */
import Koa from 'koa';
import path from 'path';
import serve from 'koa-static';
import views from 'koa-views';
import mockApi from './router/mockApi.js';


const app = new Koa();


app.use(async function(ctx, next){
  try{
    await next();
  }catch(err){
    ctx.status = err.status || 500;
    ctx.body = err.message;
    // logger.error(err);
  }
});

app.use(views( path.resolve(__dirname , '../src/views') , {
  extension: 'jade',
  pretty: true, //not work?? why???
  map: {
    jade: 'jade'
  }
}));


app.use(serve(__dirname + '/static'));

export default function startMock(workspaceDir) {
  const router = mockApi(workspaceDir);
  app
    .use(router.routes())
    .use(router.allowedMethods());

  app.listen(9000);
}