"use client"

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <html lang="en"><body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b1020", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
    <div style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 30 }}>MacTools Hub could not load.</h1>
      <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>This may be temporary. Try again in a moment.</p>
      <button type="button" onClick={retry} style={{ marginTop: 16, padding: "12px 20px", border: 0, borderRadius: 999, background: "#fff", color: "#0b1020", fontWeight: 700, cursor: "pointer" }}>Try again</button>
    </div>
  </body></html>
}
