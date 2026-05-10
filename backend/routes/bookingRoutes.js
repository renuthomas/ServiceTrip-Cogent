import express from "express";
import { protect, authorizeRole } from "../middlewares/auth.js";
import { createBooking, getMyBookings, getVendorBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { createBookingSchema,updateStatusSchema,validate } from "../middlewares/validators.js";

const router = express.Router();

router.post('/create', protect, authorizeRole(['customer']), validate(createBookingSchema),createBooking);

router.get('/my-bookings', protect, authorizeRole(['customer']), getMyBookings);

router.get('/vendor-bookings', protect, authorizeRole(['vendor']), getVendorBookings);

router.put('/status', protect, authorizeRole(['vendor']), validate(updateStatusSchema),updateBookingStatus);

export { router as bookingRouter };