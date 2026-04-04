import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <img src="/images/404.png" alt="404 illustration" className="mb-8 w-80 max-w-full" />

      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>

      <p className="mb-8 text-lg text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <Link href="/" className="rounded bg-yellow-600 px-6 py-2 text-white hover:bg-yellow-700">
        Go Home
      </Link>
    </div>
  );
}
