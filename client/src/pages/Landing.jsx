import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-6">
        Shorten Links. <span className="text-gray-400">Track Clicks.</span>
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
        Create short URLs, build your link-in-bio page, and track analytics — all in one platform.
      </p>

      <div className="flex gap-4 justify-center">
        {user ? (
          <Link
            to="/dashboard"
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/register"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">URL Shortening</h3>
          <p className="text-gray-500">Create custom short links with your own slugs or auto-generated codes.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Click Analytics</h3>
          <p className="text-gray-500">Track clicks, referrers, and trends with detailed analytics dashboards.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Link-in-Bio</h3>
          <p className="text-gray-500">Build a beautiful bio page with all your important links in one place.</p>
        </div>
      </div>
    </div>
  );
}
