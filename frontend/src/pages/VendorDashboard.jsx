import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const VendorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'services'
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    category: 'Home Services',
    price: '',
    location: '',
    image: ''
  });

  const loadBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/vendor-bookings');
      setBookings(res.data);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await axios.get('/api/services/my-services');
      setServices(res.data);
    } catch {
      toast.error('Failed to load services');
    }
  };

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          axios.get('/api/bookings/vendor-bookings'),
          axios.get('/api/services/my-services')
        ]);
        if (active) {
          setBookings(bookingsRes.data);
          setServices(servicesRes.data);
        }
      } catch {
        if (active) toast.error('Failed to load data');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      await axios.put('/api/bookings/status', { bookingId, status });
      toast.success(`Booking ${status}`);
      await loadBookings();
    } catch {
      toast.error('Failed to update request');
      setLoading(false);
    }
  };

  const handleServiceFormChange = (e) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
  };

  const createService = async () => {
    if (!serviceForm.title || !serviceForm.description || !serviceForm.price || !serviceForm.location) {
      return toast.error('Please fill all required fields');
    }
    try {
      await axios.post('/api/services', serviceForm);
      toast.success('Service created successfully!');
      setServiceForm({ title: '', description: '', category: 'Home Services', price: '', location: '', image: '' });
      setShowServiceForm(false);
      await loadServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create service');
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${serviceId}`);
      toast.success('Service deleted');
      await loadServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-sky-100 text-sky-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700'
  };

  const categories = ['Home Services', 'Automotive'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-2xl border border-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-600">Vendor dashboard</p>
              <h1 className="mt-4 text-4xl font-bold">Hello, {user?.name}</h1>
              <p className="mt-3 text-slate-600">Accept jobs, manage services, and keep your schedule organized.</p>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Pending requests</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{bookings.filter((booking) => booking.status === 'pending').length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Active jobs</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{bookings.filter((booking) => booking.status === 'accepted').length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">My services</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{services.length}</p>
          </div>
        </section>

        {/* Tabs */}
        <div className="mt-10 flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold transition ${activeTab === 'requests' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-slate-600'}`}
          >
            Service Requests
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-semibold transition ${activeTab === 'services' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-slate-600'}`}
          >
            My Services
          </button>
        </div>

        {/* Service Requests Tab */}
{activeTab === 'requests' && (
  <section className="mt-10">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-semibold">Service Requests</h2>
        <p className="mt-2 text-slate-500">View all incoming bookings and update status easily.</p>
      </div>
    </div>

    <div className="mt-8 space-y-6">
      {loading ? (
        <div className="rounded-[2rem] bg-white p-10 shadow-lg text-center">Loading requests...</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 shadow-lg text-center">
          <p className="text-slate-600">No service requests yet.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="overflow-hidden rounded-[2rem] bg-white shadow-lg border border-slate-200">
            <div className="grid gap-6 p-8 lg:grid-cols-[1.2fr_0.9fr_0.8fr]">
              {/* Service & Customer Info */}
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Service & Customer</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{booking.serviceId?.title}</h3>
                <p className="mt-2 text-slate-600 font-medium">Customer: {booking.customerId?.name}</p>
                
                {/* NEW: ADDRESS SECTION */}
                <div className="mt-4 flex items-start gap-2 text-slate-500">
                  <svg className="h-5 w-5 mt-0.5 text-cyan-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm italic">{booking.address || 'Address not provided'}</p>
                </div>
              </div>

              {/* Schedule Info */}
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Schedule</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{new Date(booking.bookingDate).toLocaleString()}</p>
                <p className="mt-2 text-xl font-bold text-cyan-700">₹{booking.amount}</p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Status</p>
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusColors[booking.status]}`}>
                  {booking.status.toUpperCase()}
                </span>
                
                {/* NEW: GET DIRECTIONS BUTTON */}
                {booking.status === 'accepted' && booking.address && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-cyan-600 hover:text-cyan-500 transition-colors uppercase tracking-widest"
                  >
                    <span>View on Map</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row">
              {booking.status === 'pending' ? (
                <>
                  <button onClick={() => updateStatus(booking._id, 'accepted')} className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500 shadow-md">
                    Accept request
                  </button>
                  <button onClick={() => updateStatus(booking._id, 'cancelled')} className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Reject request
                  </button>
                </>
              ) : booking.status === 'accepted' ? (
                <button onClick={() => updateStatus(booking._id, 'completed')} className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md">
                  Mark as Work Finished
                </button>
              ) : (
                <p className="text-slate-500 text-sm font-medium italic">Record archived under: {booking.status}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </section>
)}

        {/* My Services Tab */}
        {activeTab === 'services' && (
          <section className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-semibold">My Services</h2>
                <p className="mt-2 text-slate-500">Create and manage your service offerings.</p>
              </div>
              <button
                onClick={() => setShowServiceForm(!showServiceForm)}
                className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                {showServiceForm ? 'Cancel' : '+ Add Service'}
              </button>
            </div>

            {/* Service Form */}
            {showServiceForm && (
              <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Create New Service</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="Service title"
                    value={serviceForm.title}
                    onChange={handleServiceFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price (₹)"
                    value={serviceForm.price}
                    onChange={handleServiceFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                  <select
                    name="category"
                    value={serviceForm.category}
                    onChange={handleServiceFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="location"
                    placeholder="Service location/area"
                    value={serviceForm.location}
                    onChange={handleServiceFormChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Service description"
                    value={serviceForm.description}
                    onChange={handleServiceFormChange}
                    className="w-full sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                    rows="3"
                  />
                  <input
                    type="text"
                    name="image"
                    placeholder="Image URL (optional)"
                    value={serviceForm.image}
                    onChange={handleServiceFormChange}
                    className="w-full sm:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={createService}
                  className="mt-6 w-full rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white hover:bg-cyan-500"
                >
                  Create Service
                </button>
              </div>
            )}

            {/* Services List */}
            <div className="space-y-6">
              {loading ? (
                <div className="rounded-[2rem] bg-white p-10 shadow-lg text-center">Loading services...</div>
              ) : services.length === 0 ? (
                <div className="rounded-[2rem] bg-white p-10 shadow-lg text-center">
                  <p className="text-slate-600">You haven't created any services yet. Click "Add Service" to get started!</p>
                </div>
              ) : (
                services.map((service) => (
                  <div key={service._id} className="overflow-hidden rounded-[2rem] bg-white shadow-lg border border-slate-200">
                    <div className="grid gap-6 p-8 lg:grid-cols-[1fr_0.8fr]">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{service.category}</p>
                        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{service.title}</h3>
                        <p className="mt-2 text-slate-600">{service.description}</p>
                        <div className="mt-4 flex gap-4">
                          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{service.location}</div>
                          <div className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">₹{service.price}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 justify-end">
                        <button
                          onClick={() => deleteService(service._id)}
                          className="w-full rounded-full border border-rose-300 bg-white px-6 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;