import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/bookings/my-bookings');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-sky-100 text-sky-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-600">Customer dashboard</p>
              <h1 className="mt-4 text-4xl font-bold">Welcome back, {user?.name}</h1>
              <p className="mt-3 text-slate-600">Manage your service requests and track bookings from one place.</p>
            </div>
            <button onClick={logout} className="w-full max-w-sm rounded-3xl bg-rose-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 lg:w-auto">
              Logout
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-cyan-600 p-8 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/80">Total requests</p>
            <p className="mt-4 text-4xl font-semibold">{bookings.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Upcoming services</p>
            <p className="mt-4 text-4xl font-semibold">{bookings.filter((b) => b.status === 'accepted').length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Pending approvals</p>
            <p className="mt-4 text-4xl font-semibold">{bookings.filter((b) => b.status === 'pending').length}</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">My Bookings</h2>
              <p className="mt-2 text-slate-500">Track and review your service orders with one click.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            {loading ? (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-lg">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-10 shadow-lg text-center">
                <p className="text-slate-600">You have no bookings yet.</p>
                <button onClick={() => window.location.assign('/services')} className="mt-6 rounded-full bg-cyan-600 px-8 py-3 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500">
                  Browse Services
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="overflow-hidden rounded-[2rem] bg-white shadow-lg border border-slate-200">
                  <div className="grid gap-6 p-8 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Service</p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-900">{booking.serviceId?.title}</h3>
                      <p className="mt-2 text-slate-600">{booking.serviceId?.description}</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Vendor</p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">{booking.vendorId?.name}</p>
                      <p className="mt-2 text-slate-600">{booking.vendorId?.email}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Date</p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">{new Date(booking.bookingDate).toLocaleString()}</p>
                      </div>
                      <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${statusColors[booking.status]}`}>
                        {booking.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-b-[2rem] bg-slate-50 px-8 py-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-slate-500">Total amount ₹{booking.amount}</p>
                    <a href="/services" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Book again</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard;