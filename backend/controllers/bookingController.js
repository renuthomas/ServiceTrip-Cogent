import { Booking } from "../models/Booking.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
const createBooking = async (req, res) => {
  const { serviceId, bookingDate, serviceAddress } = req.body;
  
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    if (req.user.role !== 'customer') {
      throw new Error('Only customers can create bookings');
    }

    const service = await Service.findById(serviceId).session(session);
    if (!service) throw new Error('Service not found');

    const [booking] = await Booking.create(
      [{
        customerId: req.user.id,
        vendorId: service.vendorId,
        serviceId,
        bookingDate,
        amount: service.price,
        address: serviceAddress,
      }],
      { session }
    );

    await User.findByIdAndUpdate(
      req.user.id, 
      { "address.street": serviceAddress },
      { session }
    );

    await session.commitTransaction();
    
    res.status(201).json({ message: 'Booking request sent', booking });

  } catch (error) {
    await session.abortTransaction();
    
    const statusCode = error.message.includes('not found') ? 404 : 400;
    res.status(error.status || statusCode).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user.id }).populate('serviceId').populate('vendorId', 'name');
  return res.status(200).json(bookings);
};

const getVendorBookings = async (req, res) => {
  const bookings = await Booking.find({ vendorId: req.user.id }).populate('serviceId').populate('customerId', 'name email');
  res.json(bookings);
};

const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  const transitions = {
    'pending': ['accepted', 'cancelled'],
    'accepted': ['completed', 'cancelled'],
    'completed': [], // Terminal state
    'cancelled': []  // Terminal state
  };

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedNextStatuses = transitions[booking.status];
    if (!allowedNextStatuses || !allowedNextStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${booking.status} to ${status}` 
      });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {createBooking,getMyBookings,getVendorBookings,updateBookingStatus};