import Router, { RouterContext } from 'koa-router'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

import { isAdmin, jwt } from '../middlewares'
import { dbModelFactory, User } from '../models'

const router = new Router({
  prefix: '/auth'
})

router.get('/root-user',  async (ctx: RouterContext) => {
  const { phone, password } = ctx.request.body
  if (!phone || !password) {
    ctx.status = 400
    ctx.body = {
      error: `Expected an object with phone and password but got: ${ctx.request.body}`
    }
    return
  }

  const usersModel = dbModelFactory<User>('users')
  const user = await usersModel.findOne({
    phone,
  })

  if (!user) {
    ctx.status = 400
    ctx.body = {
      error: `Cannot find user with provided credentials`
    }
    return
  }

  ctx.status = 200
  ctx.response.body = {
    token: jsonwebtoken.sign({
      id: user.id,
      roles: user.roles,
    }, process.env.JWT_SECRET),
  }
})

router.post('/root-user', async (ctx: RouterContext) => {
  const { phone, password, roles, payload } = ctx.request.body

  if (payload !== process.env.ROOT_USER_KEY) {
    ctx.status = 406;
    return
  }

  if (!phone || !password) {
    ctx.status = 400
    ctx.body = {
      error: `Expected an object with phone and password but got: ${ctx.request.body}`
    }
    return
  }

  const usersModel = dbModelFactory<User>('users')

  const existsUserInDb = await usersModel.exists({
    phone,
  })

  if (existsUserInDb) {
    ctx.status = 406;
    ctx.body = { error: 'User with provided phone number is already registered' }
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new usersModel({
    password: hashedPassword,
    phone,
    roles,
    status: 'active',
    isActive: true,
  })

  await user.save()

  ctx.status = 200
})

export default router