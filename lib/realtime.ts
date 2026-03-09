import Pusher from 'pusher'

type RealtimePayload = Record<string, unknown>

let pusherClient: Pusher | null = null

function getPusherServer() {
  if (pusherClient) return pusherClient

  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_KEY
  const secret = process.env.PUSHER_SECRET
  const cluster = process.env.PUSHER_CLUSTER

  if (!appId || !key || !secret || !cluster) {
    return null
  }

  pusherClient = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  })
  return pusherClient
}

export async function publishRealtimeEvent(channel: string, event: string, payload: RealtimePayload) {
  const pusher = getPusherServer()
  if (!pusher) return false
  await pusher.trigger(channel, event, payload)
  return true
}
