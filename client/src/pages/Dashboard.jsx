import React from 'react';
import { AuthContext } from '../main.jsx';
import { authApi } from '../api.js';

export default function Dashboard() {
  const { token } = React.useContext(AuthContext);
  const [links, setLinks] = React.useState([]);
  const [form, setForm] = React.useState({ originalUrl: '', customCode: '' });
  const [error, setError] = React.useState(null);
  const api = React.useMemo(() => authApi(token), [token]);

  const load = async () => {
    try {
      const res = await api.get('/api/links');
      setLinks(res.data);
    } catch (e) { /* ignore */ }
  };

  React.useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
  await api.post('/api/links', { ...form });
  setForm({ originalUrl: '', customCode: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Create failed');
    }
  };

  const del = async (id) => {
    await api.delete(`/api/links/${id}`);
    load();
  };

  const base = window.location.origin;

  return (
    <div>
      <h2>Your Links</h2>
      <form onSubmit={submit} className="create-form">
        <input placeholder="Original URL" value={form.originalUrl} onChange={e => setForm({ ...form, originalUrl: e.target.value })} />
        <input placeholder="Custom code (optional)" value={form.customCode} onChange={e => setForm({ ...form, customCode: e.target.value })} />
        <button>Create</button>
      </form>
      {error && <p className="error">{error}</p>}
  <table className="links-table">
    <thead><tr><th>Short</th><th>Original</th><th>Clicks</th><th>Created</th><th>Expires</th><th></th></tr></thead>
        <tbody>
          {links.map(l => (
            <tr key={l._id}>
              <td><a href={`${base}/r/${l.shortCode}`} target="_blank" rel="noreferrer">{base}/r/{l.shortCode}</a></td>
              <td className="original-url" title={l.originalUrl}>{l.originalUrl}</td>
              <td>{l.clicks}</td>
      <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : '-'}</td>
              <td>{l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : '-'}</td>
              <td><button onClick={() => del(l._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
