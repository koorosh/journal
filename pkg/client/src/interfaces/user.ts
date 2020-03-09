import { Person } from './person'

export type UserRoles = 'principal' | 'teacher' | 'groupManager' | 'god' | 'admin'

export interface User {
  id: string
  person: Person
  roles: UserRoles
}
