import Router, { RouterContext } from 'koa-router'
import bcrypt from 'bcrypt'

import { isAdmin, jwt } from '../middlewares'
import { dbModelFactory, User, Organization } from '../models'

const router = new Router({
  prefix: '/auth'
})

/**
* Users can be registered by owners of organizations only.
 * It is not possible to register yourself.
 * Registration procedure:
 * - Owner (user with admin status) of organization registers new user with 'initiated' status
 * - Owner provides password associated with this user to the user
 * - User is required to change password with first login
* */
router.post('/register', jwt, isAdmin, async (ctx: RouterContext) => {
  const { phone, password, organizationId, roles, firstName, lastName, middleName } = ctx.request.body

  if (!phone || !password || !organizationId || !firstName || !lastName || !middleName) {
    ctx.status = 400
    ctx.body = {
      error: `Expected an object with phone, password, and organizationId but got: ${ctx.request.body}`
    }
    return
  }

  const organizationsModel = dbModelFactory<Organization>('organizations')
  const organization = await organizationsModel.findById(organizationId)

  if (!organization) {
    ctx.status = 400
    ctx.body = {
      error: `Unknown organization.`
    }
    return
  }

  const usersModel = dbModelFactory<User>('users', organization.tenantId)

  const existsUserInDb = await usersModel.exists({
    phone,
    organization: organizationId,
  })

  if (existsUserInDb) {
    ctx.status = 406;
    ctx.body = { error: 'User with provided phone number is already registered' }
    return
  }

  const personModel = dbModelFactory<User>('persons', organization.tenantId)
  const person = new personModel({
    firstName,
    lastName,
    middleName,
    phones: [phone],
  })

  const personDocument = await person.save()

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = new usersModel({
    organization: organizationId,
    password: hashedPassword,
    phone,
    roles,
    status: 'initiated',
    isActive: true,
    person: personDocument,
  })

  await user.save()

  ctx.status = 200
})

export default router