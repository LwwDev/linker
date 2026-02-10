import { useState, useEffect } from 'react';
import api from '../api/client';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/links');
      setLinks(res.data.links);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreated = (link) => {
    setLinks((prev) => [link, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      const res = await api.put(`/links/${id}`, { isActive: !isActive });
      setLinks((prev) => prev.map((l) => (l.id === id ? res.data.link : l)));
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <LinkForm onCreated={handleCreated} />
      <LinkList links={links} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
}
