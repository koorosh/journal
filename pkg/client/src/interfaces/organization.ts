import { User } from './user'

export interface Organization {
  id: string
  name: string
  adminUser: User
}
