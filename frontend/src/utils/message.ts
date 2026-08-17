// The agent can reply with a plain string or, when a tool call was involved,
// an array of LangChain content blocks. Normalize either shape to plain text.
export function extractText(response: unknown): string {
  if (typeof response === 'string') return response

  if (Array.isArray(response)) {
    return response
      .map((block) => {
        if (typeof block === 'string') return block
        if (block && typeof block === 'object' && 'text' in block) return String((block as { text: unknown }).text)
        return JSON.stringify(block)
      })
      .join('\n')
  }

  return JSON.stringify(response)
}
