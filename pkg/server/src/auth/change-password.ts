import Router, { RouterContext } from 'koa-router'
import bcrypt from 'bcrypt'

import { UsersModel } from '../models'
import jwt from '../middlewares/jwt'

const router = new Router({
  prefix: '/auth'
})

router.post('/changepassword', jwt, async (ctx: RouterContext) => {
  const { oldPassword, password, confirmPassword } = ctx.request.body

  if (!oldPassword || !password || !confirmPassword) {
    ctx.status = 400
    ctx.body = {
      error: `Expected oldPassword, password, confirmPassword, and organizationId fields.`
    }
    return
  }

  if (password !== confirmPassword) {
    ctx.status = 400
    ctx.body = {
      error: `Password and Confirmation Password must be equal`
    }
    return
  }

  const user = await UsersModel.findById(ctx.state.user.id)

  if (!await bcrypt.compare(oldPassword, user.password)) {
    ctx.status = 401
    ctx.body = {
      error: `Old password is incorrect.`
    }
    return
  }

  user.password = await bcrypt.hash(password, 10)
  user.status = 'active'
  await user.save()

  ctx.response.status = 200
})

export default router