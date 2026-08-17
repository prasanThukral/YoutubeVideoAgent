export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

export interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
}

export interface TalkResponse {
  response: unknown
  thread_id: string
}
