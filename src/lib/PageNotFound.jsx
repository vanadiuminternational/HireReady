import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] p-6 text-charcoal">
      <div className="w-full max-w-sm space-y-5 text-center">
        <p className="text-xl font-extrabold tracking-[-0.03em]">Page not found.</p>
        <Link
          to="/"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-[1.35rem] bg-charcoal px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_36px_rgba(17,24,39,0.18)]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
