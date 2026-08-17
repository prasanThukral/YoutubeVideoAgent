import type { ChatMessage } from '../../types/chat'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
          isUser ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
