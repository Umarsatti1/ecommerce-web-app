import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className="flex mt-28 flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-xl pb-10 text-gray-600">
          Sorry! We could not find what you were looking for.
        </p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}