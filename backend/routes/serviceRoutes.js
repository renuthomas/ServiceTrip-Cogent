import express from "express";
import { protect, authorizeRole } from "../middlewares/auth.js";
import { Service } from "../models/Service.js";
import { createService, getVendorServices, updateService, deleteService } from "../controllers/serviceController.js";

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  const services = await Service.find().populate('vendorId', 'name');
  res.json(services);
});

// Get vendor's own services (protected)
router.get('/my-services', protect, authorizeRole(['vendor']), getVendorServices);

// Create service (vendor only)
router.post('/', protect, authorizeRole(['vendor']), createService);

// Update service (vendor only)
router.put('/:serviceId', protect, authorizeRole(['vendor']), updateService);

// Delete service (vendor only)
router.delete('/:serviceId', protect, authorizeRole(['vendor']), deleteService);

// Add sample services (for testing)
router.post('/seed', async (req, res) => {
  await Service.deleteMany();
  const services = [
    { title: "AC Repair Service", description: "Professional AC repair at your home", category: "Home Services", price: 899, location: "Delhi", vendorId: "67f8a1b2c3d4e5f678901234" },
    { title: "Plumbing Service", description: "Expert plumbing solutions", category: "Home Services", price: 499, location: "Mumbai", vendorId: "67f8a1b2c3d4e5f678901234" },
    { title: "Car Washing", description: "Premium car cleaning service", category: "Automotive", price: 599, location: "Bangalore", vendorId: "67f8a1b2c3d4e5f678901234" }
  ];
  await Service.insertMany(services);
  res.json({ message: "Sample services added" });
});

export {router as serviceRouter};