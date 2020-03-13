import Router, { RouterContext } from 'koa-router'
import { checkConnection } from '../../db'

const router = new Router({
  prefix: '/api/internal'
})

router.get('/health', async (ctx: RouterContext) => {
  const dbState = checkConnection()
  ctx.set('X-Mongo-State', dbState ? 'Ok' : 'Bad')
  ctx.response.status = 200
})

export default router