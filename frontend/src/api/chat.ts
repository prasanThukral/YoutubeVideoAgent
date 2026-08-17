import { request } from './client'
import type { TalkResponse } from '../types/chat'

// The only model the backend's Joi schema currently accepts.
export const CHAT_MODEL = 'claude-haiku-4-5-20251001'

export const chatApi = {
  talk(content: string, threadId?: string) {
    return request<TalkResponse>('/ai/talk', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ model: CHAT_MODEL, content, thread_id: threadId }),
    })
  },
}
