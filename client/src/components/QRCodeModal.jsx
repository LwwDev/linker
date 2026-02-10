import QRCode from 'react-qr-code';

export default function QRCodeModal({ link, onClose }) {
  const shortUrl = `${window.location.origin}/${link.shortCode}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-center">QR Code</h3>
        <div className="flex justify-center mb-4">
          <QRCode value={shortUrl} size={200} />
        </div>
        <p className="text-center text-sm text-gray-500 mb-4 break-all">{shortUrl}</p>
        <button
          onClick={onClose}
          className="w-full border rounded-lg py-2 text-sm hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
