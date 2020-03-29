import Router, { RouterContext } from 'koa-router'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { dbModelFactory, Organization, User } from '../models'

const router = new Router({
  prefix: '/auth'
})

router.post('/login', async (ctx: RouterContext) => {
  const { phone, password, organizationId } = ctx.request.body

  if (!phone || !password || !organizationId) {
    ctx.status = 401
    ctx.body = {
      error: `Phone, organizationId, and password fields`
    }
    return
  }

  const organizationsModel = dbModelFactory<Organization>('organizations')

  const { tenantId } = await organizationsModel.findById(organizationId)

  const usersModel = dbModelFactory<User>('users', tenantId)

  const user = await usersModel.findOne({
    phone,
    organization: organizationId,
  })

  if (!user) {
    ctx.status = 401
    ctx.body = {
      error: `Phone number or password is incorrect.`
    }
    return
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    ctx.status = 401
    ctx.body = {
      error: `Phone number or password is incorrect.`
    }
    return
  }

  if (!user.isActive) {
    ctx.status = 401
    ctx.body = {
      error: `Current user is not active.`
    }
    return
  }

  ctx.status = 200
  ctx.response.body = {
    token: jsonwebtoken.sign({
      id: user.id,
      roles: user.roles,
      tenantId: organizationId,
    }, process.env.JWT_SECRET),
    requirePasswordChange: user.status === 'initiated',
  }
})

export default router