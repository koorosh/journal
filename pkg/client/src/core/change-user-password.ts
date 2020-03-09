
export type ChangeUserPasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

const serverUrl = process.env.REACT_APP_SERVER_URL

export default async function changeUserPassword(data: ChangeUserPasswordPayload): Promise<boolean> {
  const response = await fetch(`${serverUrl}/auth/changepassword`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })
  return response.ok
}

export function requireChangePassword() {
  return localStorage.getItem('requirePasswordChange')
}