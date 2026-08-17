import type { ReactNode } from 'react'
import { Header } from './Header'
import { ThreadList } from '../chat/ThreadList'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ThreadList />
        {children}
      </div>
    </div>
  )
}
