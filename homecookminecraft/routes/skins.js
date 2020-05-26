'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({prefix: '/skins'});

const Skins = AV.Object.extend('Skins');

// 查询 Skins 列表
router.get('/', async function(ctx) {
  ctx.state.title = 'SKINS 列表';
  const query = new AV.Query(Skins);
  query.descending('createdAt');
  try {
    ctx.state.skins = await query.find();
  } catch (err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Skins 数据表还未创建，所以返回空的 Skins 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      ctx.state.skins = [];
    } else {
      throw err;
    }
  }
  await ctx.render('skins.ejs');
});

// 新增 Skins 项目
router.post('/', async function(ctx) {
  const content = ctx.request.body.content;
  console.log(content);
  ctx.body = content;
  var skins = new Skins();
  skins.set('content', content);
  await skins.save();
  ctx.redirect('/skins');
});

module.exports = router;
