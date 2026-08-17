import type { ChatThread } from '../../types/chat'

interface ThreadListItemProps {
  thread: ChatThread
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export function ThreadListItem({ thread, isActive, onSelect, onDelete }: ThreadListItemProps) {
  return (
    <div
      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm ${
        isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <button onClick={onSelect} className="flex-1 truncate text-left">
        {thread.title}
      </button>
      <button
        onClick={onDelete}
        className="ml-2 hidden text-xs text-slate-400 hover:text-red-600 group-hover:inline"
        aria-label="Delete conversation"
      >
        ✕
      </button>
    </div>
  )
}
