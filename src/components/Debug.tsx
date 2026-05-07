export type DebugProps<T> = T & {
  title?: string
  open?: boolean
}

export function Debug<T>({ title, open = false, ...props }: DebugProps<T>) {
  return (
    <details id={`debug-${title}`} {...{ open }}>
      <summary>{title ?? "Debug"}</summary>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </details>
  )
}
export default Debug
