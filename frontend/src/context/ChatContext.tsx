import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { chatApi } from '../api/chat'
import { extractText } from '../utils/message'
import type { ChatMessage, ChatThread } from '../types/chat'

const STORAGE_KEY = 'chatThreads'

interface ChatContextValue {
  threads: ChatThread[]
  activeThread: ChatThread | null
  activeThreadId: string | null
  isSending: boolean
  error: string | null
  startNewThread: () => void
  selectThread: (id: string) => void
  deleteThread: (id: string) => void
  sendMessage: (content: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | null>(null)

function loadThreads(): ChatThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ChatThread[]) : []
  } catch {
    return []
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>(loadThreads)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  }, [threads])

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null

  function startNewThread() {
    setActiveThreadId(null)
    setError(null)
  }

  function selectThread(id: string) {
    setActiveThreadId(id)
    setError(null)
  }

  function deleteThread(id: string) {
    setThreads((prev) => prev.filter((t) => t.id !== id))
    setActiveThreadId((current) => (current === id ? null : current))
  }

  async function sendMessage(content: string) {
    setError(null)
    setIsSending(true)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    }

    const threadIdBeforeSend = activeThreadId

    // Optimistically show the user's message. If this is a brand new thread it
    // isn't in `threads` yet, so it's just held in local state until the
    // backend hands us the real thread_id below.
    if (threadIdBeforeSend) {
      setThreads((prev) =>
        prev.map((t) => (t.id === threadIdBeforeSend ? { ...t, messages: [...t.messages, userMessage] } : t)),
      )
    }

    try {
      const { response, thread_id } = await chatApi.talk(content, threadIdBeforeSend ?? undefined)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: extractText(response),
        createdAt: Date.now(),
      }

      setThreads((prev) => {
        const exists = prev.some((t) => t.id === thread_id)
        if (exists) {
          return prev.map((t) =>
            t.id === thread_id ? { ...t, messages: [...t.messages, assistantMessage] } : t,
          )
        }
        const newThread: ChatThread = {
          id: thread_id,
          title: content.slice(0, 40) || 'New conversation',
          messages: [userMessage, assistantMessage],
          createdAt: Date.now(),
        }
        return [newThread, ...prev]
      })

      setActiveThreadId(thread_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending your message')
      // Roll back the optimistic user message on failure.
      if (threadIdBeforeSend) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadIdBeforeSend ? { ...t, messages: t.messages.filter((m) => m.id !== userMessage.id) } : t,
          ),
        )
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThread,
        activeThreadId,
        isSending,
        error,
        startNewThread,
        selectThread,
        deleteThread,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}
