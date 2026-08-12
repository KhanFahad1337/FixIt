import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function Admin() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const isSubAdmin = user?.role === 'subadmin';
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [subAdminForm, setSubAdminForm] = useState({ name: '', email: '', password: '', phone: '' });

  const fetchData = () => {
    if (isSubAdmin) {
      axios.get(`${API}/admin/subadmin-stats`).then(res => setStats(res.data)).catch(() => {});
    } else {
      axios.get(`${API}/admin/stats`).then(res => setStats(res.data)).catch(() => {});
      axios.get(`${API}/admin/chart`).then(res => setChartData(res.data)).catch(() => {});
      axios.get(`${API}/admin/users`).then(res => setUsers(res.data)).catch(() => {});
      axios.get(`${API}/admin/providers`).then(res => setProviders(res.data)).catch(() => {});
      axios.get(`${API}/auth/subadmins`).then(res => setSubAdmins(res.data)).catch(() => {});
    }
    axios.get(`${API}/admin/bookings`).then(res => setBookings(res.data)).catch(() => {});
    axios.get(`${API}/ai/noshow-risk`).then(res => setRiskData(res.data)).catch(() => {});
    axios.get(`${API}/noshow/all`).then(res => setReports(res.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, [isSubAdmin]);

  const approveProvider = async (id) => {
    await axios.put(`${API}/admin/providers/${id}/approve`);
    setProviders(providers.map(p => p._id === id ? { ...p, isApproved: true } : p));
  };

  const toggleProvider = async (id) => {
    const res = await axios.put(`${API}/admin/providers/${id}/toggle-status`);
    setProviders(providers.map(p => p._id === id ? res.data : p));
  };

  const deleteProvider = async (id) => {
    if (!window.confirm('Delete this provider?')) return;
    await axios.delete(`${API}/admin/providers/${id}`);
    setProviders(providers.filter(p => p._id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`${API}/admin/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await axios.delete(`${API}/admin/bookings/${id}`);
    setBookings(bookings.filter(b => b._id !== id));
  };

  const approveReport = async (id) => {
    await axios.put(`${API}/noshow/${id}/approve`);
    setReports(reports.map(r => r._id === id ? { ...r, status: 'approved' } : r));
  };

  const rejectReport = async (id) => {
    const note = prompt('Reason for rejection:');
    if (note === null) return;
    await axios.put(`${API}/noshow/${id}/reject`, { adminNote: note });
    setReports(reports.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
  };

  const clearPenalty = async (id) => {
    if (!window.confirm('Clear penalty for this provider?')) return;
    const res = await axios.put(`${API}/noshow/providers/${id}/clear-penalty`);
    setProviders(providers.map(p => p._id === id ? res.data : p));
  };

  const createSubAdmin = async (e) => {
    e.preventDefault();
    if (!subAdminForm.name || !subAdminForm.email || !subAdminForm.password || !subAdminForm.phone) return;
    try {
      await axios.post(`${API}/auth/subadmin/create`, subAdminForm);
      setSubAdminForm({ name: '', email: '', password: '', phone: '' });
      const res = await axios.get(`${API}/auth/subadmins`);
      setSubAdmins(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create sub-admin');
    }
  };

  const deleteSubAdmin = async (id) => {
    if (!window.confirm('Delete this sub-admin?')) return;
    await axios.delete(`${API}/auth/subadmin/${id}`);
    setSubAdmins(subAdmins.filter(s => s._id !== id));
  };

  const showStats = (value) => value || 0;

  return (
    <div className="animate-fade-in">
      <div className="admin-content">
        {tab === 'dashboard' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-speedometer2 me-2" style={{ color: 'var(--primary)' }}></i>Dashboard</h5>
            {isSubAdmin ? (
              <div className="row g-4">
                <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="stat-card card-gradient"><i className="bi bi-calendar-check stat-icon"></i>
                    <h2 className="fw-bold">{showStats(stats.totalBookings)}</h2><p className="mb-0 opacity-80">Total Bookings</p>
                  </div>
                </div>
                <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="stat-card card-gradient-2"><i className="bi bi-clock stat-icon"></i>
                    <h2 className="fw-bold">{showStats(stats.pendingBookings)}</h2><p className="mb-0 opacity-80">Pending</p>
                  </div>
                </div>
                <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="stat-card" style={{ background: 'var(--warning)', color: 'white' }}>
                    <i className="bi bi-check-circle stat-icon"></i>
                    <h2 className="fw-bold">{showStats(stats.completedBookings)}</h2><p className="mb-0 opacity-80">Completed</p>
                  </div>
                </div>
                <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="stat-card card-gradient-3"><i className="bi bi-exclamation-triangle stat-icon"></i>
                    <h2 className="fw-bold">{showStats(stats.pendingReports)}</h2><p className="mb-0 opacity-80">Pending Reports</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
              <div className="row g-4">
              <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="stat-card card-gradient"><i className="bi bi-people-fill stat-icon"></i>
                  <h2 className="fw-bold">{stats.totalUsers || 0}</h2><p className="mb-0 opacity-80">Users</p>
                </div>
              </div>
              <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card card-gradient-2"><i className="bi bi-person-badge-fill stat-icon"></i>
                  <h2 className="fw-bold">{stats.totalProviders || 0}</h2><p className="mb-0 opacity-80">Providers</p>
                </div>
              </div>
              <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="stat-card" style={{ background: 'var(--warning)', color: 'var(--text-white)' }}>
                  <i className="bi bi-calendar-check stat-icon"></i>
                  <h2 className="fw-bold">{stats.totalBookings || 0}</h2><p className="mb-0 opacity-80">Bookings</p>
                </div>
              </div>
              <div className="col-md-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="stat-card card-gradient-3"><i className="bi bi-currency-dollar stat-icon"></i>
                  <h2 className="fw-bold">${stats.totalRevenue || 0}</h2><p className="mb-0 opacity-80">Revenue</p>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h6 className="fw-bold mb-3"><i className="bi bi-graph-up me-2" style={{ color: 'var(--primary)' }}></i>30-Day Booking & Revenue Trend</h6>
                <div className="chart-card">
                  <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#333' : '#e0e0e0'} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: dark ? '#aaa' : '#888' }} tickFormatter={d => d.slice(5)} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: dark ? '#aaa' : '#888' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#7c3aed' }} />
                      <Tooltip
                        contentStyle={{ background: dark ? '#1a1a2e' : '#fff', border: `1px solid ${dark ? '#333' : '#e0e0e0'}`, borderRadius: 8, color: dark ? '#e0e0e0' : '#333' }}
                        labelFormatter={d => `Date: ${d}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: dark ? '#e0e0e0' : '#333' }} />
                      <Area yAxisId="left" type="monotone" dataKey="bookings" fill="#7c3aed" fillOpacity={0.15} stroke="#7c3aed" strokeWidth={2} name="Bookings" />
                      <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" fillOpacity={0.7} name="Revenue ($)" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
              </>
            )}
          </>
        )}

        {!isSubAdmin && tab === 'users' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-people me-2" style={{ color: 'var(--primary)' }}></i>Users</h5>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td><td>{u.phone}</td>
                      <td><span className="badge badge-modern-primary">{u.role}</span></td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteUser(u._id)}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!isSubAdmin && tab === 'providers' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-person-badge me-2" style={{ color: 'var(--primary)' }}></i>Providers</h5>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>Name</th><th>Profession</th><th>Rate</th><th>Rating</th><th>Missed</th><th>Penalty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {providers.map(p => (
                    <tr key={p._id}>
                      <td className="fw-semibold">{p.name}</td>
                      <td>{p.profession}</td>
                      <td className="fw-bold" style={{ color: 'var(--primary)' }}>${p.pricePerHour}/hr</td>
                      <td>{p.rating ? <><i className="bi bi-star-fill text-warning me-1"></i>{p.rating}</> : '-'}</td>
                      <td>
                        <span className={`badge ${p.missedAppointments > 0 ? 'badge-modern-danger' : 'badge-modern-success'}`}>
                          {p.missedAppointments || 0}
                        </span>
                      </td>
                      <td>
                        {p.isPenalized ? (
                          <span className="badge badge-modern-danger">
                            <i className="bi bi-exclamation-triangle me-1"></i>{p.penaltyPoints} pts
                          </span>
                        ) : (
                          <span className="badge badge-modern-success">None</span>
                        )}
                      </td>
                      <td>
                        {p.isPenalized ? (
                          <span className="badge badge-modern-danger"><i className="bi bi-lock me-1"></i>Penalized</span>
                        ) : p.isApproved ? (
                          <span className="badge badge-modern-success"><i className="bi bi-check-circle me-1"></i>Active</span>
                        ) : (
                          <span className="badge badge-modern-warning"><i className="bi bi-clock me-1"></i>Pending</span>
                        )}
                      </td>
                      <td>
                        {!p.isApproved && (
                          <button className="btn btn-modern btn-modern-secondary btn-sm me-1"
                            onClick={() => approveProvider(p._id)}>
                            <i className="bi bi-check-lg me-1"></i>Approve
                          </button>
                        )}
                        <div className="d-flex gap-1 flex-wrap">
                          <button className={`btn btn-sm ${p.isApproved ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleProvider(p._id)}>
                            {p.isApproved ? <><i className="bi bi-pause-circle"></i></> : <><i className="bi bi-play-circle"></i></>}
                          </button>
                          {p.isPenalized && (
                            <button className="btn btn-sm btn-info"
                              onClick={() => clearPenalty(p._id)}>
                              <i className="bi bi-unlock"></i>
                            </button>
                          )}
                          <button className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteProvider(p._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'reports' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-exclamation-triangle me-2" style={{ color: 'var(--primary)' }}></i>No-Show Reports</h5>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>User</th><th>Provider</th><th>Date</th><th>Amount</th><th>Action</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-4 text-muted">No reports filed.</td></tr>
                  ) : reports.map(r => (
                    <tr key={r._id}>
                      <td className="fw-semibold">{r.user?.name}</td>
                      <td>{r.provider?.name}</td>
                      <td>{r.booking ? new Date(r.booking.date).toLocaleDateString() : '-'}</td>
                      <td className="fw-bold" style={{ color: 'var(--primary)' }}>${r.booking?.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${r.action === 'refund' ? 'badge-modern-success' : r.action === 'rebook' ? 'badge-modern-info' : 'badge-modern-primary'}`}>
                          {r.action}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${r.status === 'approved' ? 'badge-modern-success' : r.status === 'rejected' ? 'badge-modern-danger' : 'badge-modern-warning'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'pending' && (
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={() => approveReport(r._id)}>
                              <i className="bi bi-check me-1"></i>Approve
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => rejectReport(r._id)}>
                              <i className="bi bi-x me-1"></i>Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-calendar-check me-2" style={{ color: 'var(--primary)' }}></i>Bookings</h5>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>User</th><th>Provider</th><th>Amount</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.user?.name || 'N/A'}</td>
                      <td>{b.provider?.name || 'N/A'}</td>
                      <td className="fw-bold" style={{ color: 'var(--primary)' }}>${b.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${b.status === 'completed' ? 'badge-modern-success' : b.status === 'cancelled' ? 'badge-modern-danger' : 'badge-modern-info'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-modern-success' : 'badge-modern-warning'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteBooking(b._id)}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fw-bold mb-3 mt-5">
              <i className="bi bi-robot me-2" style={{ color: 'var(--primary)' }}></i>AI No-Show Risk Prediction
            </h6>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>User</th><th>Provider</th><th>Date</th><th>Risk</th><th>Reasons</th></tr></thead>
                <tbody>
                  {riskData.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">No upcoming bookings to analyze.</td></tr>
                  ) : riskData.map(r => (
                    <tr key={r.bookingId}>
                      <td className="fw-semibold">{r.user}</td>
                      <td>{r.provider}</td>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: 8, maxWidth: 120 }}>
                            <div className="progress-bar" style={{
                              width: `${r.riskScore}%`,
                              background: r.riskLevel === 'high' ? '#ef4444' : r.riskLevel === 'medium' ? '#f59e0b' : '#22c55e',
                            }}></div>
                          </div>
                          <span className={`badge ${r.riskLevel === 'high' ? 'badge-modern-danger' : r.riskLevel === 'medium' ? 'badge-modern-warning' : 'badge-modern-success'}`}>
                            {r.riskLevel} · {r.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td>
                        {r.reasons.length ? (
                          <small className="text-muted">{r.reasons.join(', ')}</small>
                        ) : (
                          <small className="text-success">No red flags</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!isSubAdmin && tab === 'subadmins' && (
          <>
            <h5 className="fw-bold mb-4"><i className="bi bi-person-gear me-2" style={{ color: 'var(--primary)' }}></i>Sub Admins</h5>
            <div className="card-modern mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Add Sub Admin</h6>
                <form onSubmit={createSubAdmin} className="row g-3">
                  <div className="col-md-3">
                    <input type="text" className="form-control form-modern" placeholder="Full name"
                      value={subAdminForm.name} onChange={e => setSubAdminForm({ ...subAdminForm, name: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <input type="email" className="form-control form-modern" placeholder="Email"
                      value={subAdminForm.email} onChange={e => setSubAdminForm({ ...subAdminForm, email: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <input type="password" className="form-control form-modern" placeholder="Password"
                      value={subAdminForm.password} onChange={e => setSubAdminForm({ ...subAdminForm, password: e.target.value })} required />
                  </div>
                  <div className="col-md-2">
                    <input type="text" className="form-control form-modern" placeholder="Phone"
                      value={subAdminForm.phone} onChange={e => setSubAdminForm({ ...subAdminForm, phone: e.target.value })} required />
                  </div>
                  <div className="col-md-1">
                    <button type="submit" className="btn btn-modern btn-modern-primary w-100">
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-modern">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {subAdmins.map(s => (
                    <tr key={s._id}>
                      <td className="fw-semibold">{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td><span className="badge badge-modern-warning">{s.role}</span></td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteSubAdmin(s._id)}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
