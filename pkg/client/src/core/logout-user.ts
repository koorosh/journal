import client from '../graphql-client'

export default async function logoutUser() {
  localStorage.clear()
  await client.resetStore()
}