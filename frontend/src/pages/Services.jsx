import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

const Services = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [search, setSearch] = useState(location?.state?.searchData || '');
  const [category, setCategory] = useState('All');
  const [address, setAddress] = useState(user?.address?.street || '');

  useEffect(() => {
    axios.get('/api/services')
      .then((res) => setServices(res.data))
      .catch(() => toast.error('Failed to load services'));
  }, []);

  const filteredServices = services.filter((service) => {
    const searchMatch = search
      ? service.title.toLowerCase().includes(search.toLowerCase()) || service.description.toLowerCase().includes(search.toLowerCase())
      : true;
    const categoryMatch = category === 'All' ? true : service.category === category;
    return searchMatch && categoryMatch;
  });

  const categories = ['All', 'Home Services', 'Automotive'];

  const bookService = async () => {
  if (!user) {
    toast.error('Please login/signup before booking');
    navigate('/login');
    return;
  }
  
  if (!bookingDate) return toast.error('Please select date');
  
  // NEW: Address Validation
  if (!address || address.length < 10) {
    return toast.error('Please provide a complete service address');
  }

  try {
    await axios.post('/api/bookings/create', {
      serviceId: selectedService._id,
      bookingDate,
      serviceAddress: address // Send the address with the booking
    });
    
    toast.success('Booking request sent to vendor!');
    setSelectedService(null);
    setBookingDate('');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Booking failed');
  }
};

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Book a service</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-900">Find the best professionals for every job.</h1>
              <p className="mt-3 text-slate-500">Search by service type, category, or location and book with confidence.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[36rem]">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {filteredServices.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">No services found. Try another search term or category.</p>
            </div>
          ) : filteredServices.map((service) => (
            <div key={service._id} className="overflow-hidden rounded-[2rem] bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <img src={service.image} alt={service.title} className="h-64 w-full object-cover" />
              <div className="p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">{service.category}</p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">{service.title}</h2>
                  </div>
                  <p className="text-right text-3xl font-semibold text-slate-900">₹{service.price}</p>
                </div>
                <p className="mt-5 text-slate-600 line-clamp-3">{service.description}</p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{service.location}</div>
                  <button
                    onClick={() => {setSelectedService(service);setBookingDate('');setAddress(user?.address?.street || '');}}
                    className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-500"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Booking</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">{selectedService.title}</h2>
                <p className="mt-2 text-slate-500">Service price ₹{selectedService.price} • {selectedService.location}</p>
              </div>
              <button onClick={() => {setSelectedService(null);setBookingDate('');setAddress(user?.address?.street || '');}} 
                className="rounded-full bg-slate-100 px-4 py-3 text-slate-700 hover:bg-slate-200">
                Close
              </button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-1">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Choose date & time</p>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
    <p className="text-sm text-slate-500 font-semibold">Service Location</p>
    <textarea
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Building name, Street, Landmark..."
      rows="2"
      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-500 text-sm"
    />
    <p className="mt-2 text-[10px] text-slate-400 italic">
      The vendor needs this to reach your location.
    </p>
  </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Booking amount</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">₹{selectedService.price}</p>
                <p className="mt-2 text-sm text-slate-500">Pay after service completion.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button onClick={bookService} className="flex-1 rounded-full bg-cyan-600 px-6 py-4 text-sm font-semibold text-white hover:bg-cyan-500">
                Confirm Booking
              </button>
              <button onClick={() => {setSelectedService(null);setBookingDate('');setAddress(user?.address?.street || '');}}  
                className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;