
type LoginData = {
  phone: string
  password: string
  organizationId: string
}

const serverUrl = process.env.REACT_APP_SERVER_URL

export default async function loginUser(loginData: LoginData): Promise<boolean> {
  const response = await fetch(`${serverUrl}/auth/login`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })

  if (response.ok) {
    const { token, requirePasswordChange } = await response.json()
    localStorage.setItem('token', token)

    if (requirePasswordChange) {
      localStorage.setItem('requirePasswordChange', requirePasswordChange)
    } else {
      localStorage.removeItem('requirePasswordChange')
    }
    return true
  }
  return false
}