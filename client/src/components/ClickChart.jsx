import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClickChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          labelFormatter={(d) => new Date(d).toLocaleDateString()}
          formatter={(value) => [value, 'Clicks']}
        />
        <Area type="monotone" dataKey="clicks" stroke="#000000" fill="#e5e7eb" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
