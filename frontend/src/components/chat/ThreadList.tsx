import { useChat } from '../../context/ChatContext'
import { ThreadListItem } from './ThreadListItem'
import { Button } from '../ui/Button'

export function ThreadList() {
  const { threads, activeThreadId, startNewThread, selectThread, deleteThread } = useChat()

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 p-3">
      <Button variant="ghost" onClick={startNewThread} className="mb-2 justify-start border border-slate-200">
        + New conversation
      </Button>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            thread={thread}
            isActive={thread.id === activeThreadId}
            onSelect={() => selectThread(thread.id)}
            onDelete={() => deleteThread(thread.id)}
          />
        ))}
      </div>
    </div>
  )
}
