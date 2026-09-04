"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 32, textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>{error?.message || "Application error"}</p>
          <button type="button" onClick={() => reset?.()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
