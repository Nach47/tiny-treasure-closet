import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center lg:px-10">
      <p className="eyebrow">Page Not Found</p>
      <h1 className="mt-3 text-4xl">This treasure has wandered off</h1>
      <p className="mt-4 text-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}
