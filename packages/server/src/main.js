const Koa = require('koa')
const Router = require('koa-router')
const Knex = require('knex')

const WebApp = require('./WebApp.js')

const app = new Koa()
const router = new Router()

const db = Knex({
	client: 'pg',
	connection: {
		host : '127.0.0.1',
		user : 'appstore',
		password : 'appstore123',
		database : 'appstore'
	}
})

router.get('/foo', async (ctx, next) => {
	const t = await db.select('*').from('app')

	try {
		console.log(t[0])
		const resp = await WebApp.validate(t[0], { stripUnknown: true })
		console.log(resp)
	} catch (e) {                               
		console.log('schema failed to validate', e)
	}
	
	ctx.response.body = t
})

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000);
