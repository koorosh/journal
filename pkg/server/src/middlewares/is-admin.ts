import { UserRoles } from '../models'

export default async function isAdmin(ctx, next) {
  const roles: UserRoles[] = ctx.state.user.roles || []
  const isAdmin = roles.some(role => role === 'admin')

  if (!isAdmin) {
    ctx.status = 401;
    ctx.body = { error: 'Restricted access.' }
    return
  }
  await next()
}