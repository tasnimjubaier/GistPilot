export function uuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID()
  }
  // Fallback
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}