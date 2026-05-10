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

export {router as serviceRouter};