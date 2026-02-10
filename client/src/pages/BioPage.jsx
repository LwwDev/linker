import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const themeStyles = {
  default: { bg: 'bg-gray-50', text: 'text-gray-900', link: 'bg-white border border-gray-200 hover:shadow-md' },
  dark: { bg: 'bg-gray-950', text: 'text-white', link: 'bg-gray-900 border border-gray-800 hover:bg-gray-800' },
  light: { bg: 'bg-white', text: 'text-gray-900', link: 'bg-gray-50 border border-gray-200 hover:bg-gray-100' },
  minimal: { bg: 'bg-white', text: 'text-gray-700', link: 'border-b border-gray-200 rounded-none hover:bg-gray-50' },
  contrast: { bg: 'bg-black', text: 'text-white', link: 'bg-white text-black border border-gray-200 hover:bg-gray-100' },
};

export default function BioPage() {
  const { username } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/bio/${username}`)
      .then((res) => setPage(res.data.bioPage))
      .catch(() => setError('Page not found'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-gray-500">{error}</div>;

  const theme = themeStyles[page.theme] || themeStyles.default;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} -mx-4 -mt-8 px-4 py-16`}>
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {page.username?.[0]?.toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold mb-2">{page.title}</h1>
        {page.bioText && <p className="text-sm opacity-75 mb-8">{page.bioText}</p>}

        <div className="space-y-3">
          {page.links
            ?.sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-6 py-3 rounded-xl font-medium transition ${theme.link}`}
              >
                {link.title || link.url}
              </a>
            ))}
        </div>

        <p className="mt-12 text-xs opacity-50">Powered by Linker</p>
      </div>
    </div>
  );
}
