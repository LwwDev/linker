import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

export default function BioEditor() {
  const { user } = useAuth();
  const [bio, setBio] = useState({ title: '', bioText: '', theme: 'default', links: [] });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/bio').then((res) => setBio(res.data.bioPage)).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put('/bio', bio);
      setBio(res.data.bioPage);
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    setBio((prev) => ({
      ...prev,
      links: [...prev.links, { title: '', url: '', order: prev.links.length }],
    }));
  };

  const updateLink = (index, field, value) => {
    setBio((prev) => ({
      ...prev,
      links: prev.links.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    }));
  };

  const removeLink = (index) => {
    setBio((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const themes = ['default', 'dark', 'light', 'minimal', 'contrast'];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bio Page Editor</h1>
        <a
          href={`/bio/${user?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-black text-sm transition"
        >
          View Public Page &rarr;
        </a>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Page Title</label>
          <input
            type="text"
            value={bio.title}
            onChange={(e) => setBio((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio Text</label>
          <textarea
            value={bio.bioText || ''}
            onChange={(e) => setBio((prev) => ({ ...prev, bioText: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setBio((prev) => ({ ...prev, theme: t }))}
                className={`px-4 py-2 rounded-lg text-sm capitalize border transition ${
                  bio.theme === t ? 'bg-black text-white border-black' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Links</label>
            <button
              onClick={addLink}
              className="text-sm text-gray-500 hover:text-black transition"
            >
              + Add Link
            </button>
          </div>
          <div className="space-y-3">
            {bio.links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Link title"
                    value={link.title}
                    onChange={(e) => updateLink(i, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={link.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <button
                  onClick={() => removeLink(i)}
                  className="text-gray-400 hover:text-black text-sm mt-1 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <span className="text-sm text-gray-600">{message}</span>}
        </div>
      </div>
    </div>
  );
}
