import { useState } from 'react';
import { Link } from 'react-router-dom';
import QRCodeModal from './QRCodeModal';

export default function LinkList({ links, onDelete, onToggle }) {
  const [qrLink, setQrLink] = useState(null);

  const copyToClipboard = (shortCode) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
  };

  if (links.length === 0) {
    return <p className="text-gray-400 text-center py-10">No links yet. Create your first short link above.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{link.title || 'Untitled'}</h3>
                <p className="text-gray-500 font-mono text-sm mt-1">
                  /{link.shortCode}
                </p>
                <p className="text-gray-400 text-sm truncate mt-1">{link.originalUrl}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-semibold text-gray-500">
                  {link.clickCount || 0} clicks
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => copyToClipboard(link.shortCode)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Copy
              </button>
              <Link
                to={`/analytics/${link.id}`}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Analytics
              </Link>
              <button
                onClick={() => setQrLink(link)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                QR Code
              </button>
              <button
                onClick={() => onToggle(link.id, link.isActive)}
                className={`text-xs px-3 py-1.5 rounded-lg border border-gray-200 transition ${
                  link.isActive ? 'text-black hover:bg-gray-50' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {link.isActive ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-black hover:bg-gray-50 transition ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {qrLink && <QRCodeModal link={qrLink} onClose={() => setQrLink(null)} />}
    </>
  );
}
