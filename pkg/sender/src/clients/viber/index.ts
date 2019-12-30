import axios from 'axios'
import Router from 'koa-router'

import db from '../../config/db'
import uuid from 'uuid'

export interface UserProfile {
  id: string
  name: string
  avatar: string
  country: string
  language: string
  api_version: number
}

export interface Message {
  type: 'text'
  text: string
  media?: string
  location?: {
    lat: number
    lon: number
  }
  tracking_data?: string
}

export interface ReceiveMessage {
  event: 'message' | 'webhook' | 'conversation_started'
  timestamp: number
  message_token: number
  sender: UserProfile
  message: Message
}

const client = axios.create({
  headers: {
    'X-Viber-Auth-Token': process.env.VIBER_API_KEY,
  }
})

export function setWebHook() {
  return client.post('https://chatapi.viber.com/pa/set_webhook', {
    url: process.env.VIBER_WEBHOOK_URL,
  })
}

export function sendTextMessage(receiverId: string, text: string) {
  return client.post('https://chatapi.viber.com/pa/send_message', {
    receiver: receiverId,
    type: 'text',
    sender: {
      name: 'School Journal'
    },
    text
  })
}

export async function isNewSubscriber(subscriberId: string) {
  const subscriber = await db
    .from('subscribers')
    .where({
      subscriber_id: subscriberId,
      is_active: true
    })
    .first()

  return !subscriber
}

export async function applyUserAccessCode(code: string, subscriberId: string): Promise<boolean> {
  const record = await db.from('person_subscribers')
    .where({
      code
    })
    .first()

  const existsCode = !!(record && record.code)

  if (existsCode) {
    await Promise.all([
      db.table('person_subscribers')
        .update({
          subscriber_id: subscriberId
        })
        .where({
          id: record.id
        }),
      db.table('subscribers')
        .insert({
          id: uuid(),
          subscriber_id: subscriberId,
          is_active: true,
        })
    ])
  }

  return existsCode
}

export const router = new Router({
  prefix: '/viber/webhook'
})

router.post('/', async ctx => {
  const msg: ReceiveMessage = ctx.request.body

  switch (msg.event) {
    case 'webhook':
      return ctx.response.status = 200
    case 'message':
      const isNew = await isNewSubscriber(msg.sender.id)
      if (isNew) {
        const isValidAccessCode = await applyUserAccessCode(msg.message.text, msg.sender.id)
        if (isValidAccessCode) {
          await sendTextMessage(msg.sender.id, 'Вітаємо! Ви зареєстровані в системі!')
        } else {
          await sendTextMessage(msg.sender.id, 'Невірний код доступу!')
        }
      } else {
        // for already existing users. Ignore their messages for awhile
        await sendTextMessage(msg.sender.id, 'Ваша думка для нас важлива! Пишіть ще!')
      }
      ctx.response.status = 200
      break
    case 'conversation_started':
      ctx.response.body = {
        sender: {
          name: 'Шкільний Журнал'
        },
        type: 'text',
        text: 'Вітаємо! Зверніться до класного керівника для отримання коду доступу. ' +
          'Якщо Ви отримали код доступу - відправте його в повідомленні.'
      }
      ctx.response.status = 200
      break
    default:
      ctx.response.status = 200
  }
})