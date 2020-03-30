import Router, { RouterContext } from 'koa-router'
import bcrypt from 'bcrypt'

import jwt from '../middlewares/jwt'
import { dbModelFactory, User } from '../models'

const router = new Router({
  prefix: '/auth'
})

router.post('/changepassword', jwt, async (ctx: RouterContext) => {
  const { password, newPassword, confirmPassword } = ctx.request.body
  const { user } = ctx.state

  if (!password || !newPassword || !confirmPassword) {
    ctx.status = 400
    ctx.body = {
      error: `Expected oldPassword, password, and confirmPassword fields.`
    }
    return
  }

  if (newPassword !== confirmPassword) {
    ctx.status = 400
    ctx.body = {
      error: `Password and Confirmation Password must be equal`
    }
    return
  }

  if (!user.tenantId) {
    ctx.status = 400
    ctx.body = {
      error: `User does not belong to any organization`
    }
    return
  }

  const UsersModel = await dbModelFactory<User>('users', user.tenantId)

  const userModel = await UsersModel.findById(user.id)

  if (!await bcrypt.compare(password, userModel.password)) {
    ctx.status = 401
    ctx.body = {
      error: `Old password is incorrect.`
    }
    return
  }

  userModel.password = await bcrypt.hash(newPassword, 10)
  userModel.status = 'active'
  await userModel.save()

  ctx.response.status = 200
})

export default router