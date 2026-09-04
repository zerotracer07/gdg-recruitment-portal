import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 p-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/gdg.svg" alt="GDG VITC" className="h-14 w-14 opacity-90" />
      <p className="text-6xl font-extrabold tracking-tight text-muted-foreground/40">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist or was moved.
      </p>
      <div className="flex gap-2">
        <Link
          href="/"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/departments"
          className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
        >
          Departments
        </Link>
      </div>
    </main>
  );
}
