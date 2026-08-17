import { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'
import { ErrorBanner } from '../ui/ErrorBanner'

export function ChatWindow() {
  const { activeThread, isSending, error, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThread?.messages.length, isSending])

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!activeThread?.messages.length && (
          <p className="mt-8 text-center text-sm text-slate-400">Start a new conversation below.</p>
        )}
        {activeThread?.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isSending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      {error && (
        <div className="px-4 pb-2">
          <ErrorBanner message={error} />
        </div>
      )}
      <MessageInput onSend={sendMessage} disabled={isSending} />
    </div>
  )
}
