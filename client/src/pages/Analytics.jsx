import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import ClickChart from '../components/ClickChart';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/${id}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!data) return <div className="text-center py-20">Link not found</div>;

  const chartData = Object.entries(data.clicksByDay)
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <Link to="/dashboard" className="text-gray-500 hover:text-black mb-4 inline-block transition">
        &larr; Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{data.link.title || 'Untitled Link'}</h1>
        <p className="text-gray-500 text-sm break-all">{data.link.originalUrl}</p>
        <p className="text-sm text-gray-400 mt-1">/{data.link.shortCode}</p>
        <div className="mt-4 text-4xl font-bold text-black">{data.totalClicks} <span className="text-lg text-gray-400 font-normal">total clicks</span></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Clicks Over Time</h2>
        {chartData.length > 0 ? (
          <ClickChart data={chartData} />
        ) : (
          <p className="text-gray-500">No click data yet</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
        {data.topReferrers.length > 0 ? (
          <div className="space-y-2">
            {data.topReferrers.map((r) => (
              <div key={r.referrer} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm truncate max-w-md">{r.referrer}</span>
                <span className="font-semibold text-sm">{r.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No referrer data yet</p>
        )}
      </div>
    </div>
  );
}
