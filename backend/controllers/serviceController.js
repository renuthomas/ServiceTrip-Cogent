import { Service } from "../models/Service.js";

const createService = async (req, res) => {
  const { title, description, category, price, location, image } = req.body;
  try {
    if (!title || !description || !category || !price || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      location,
      image: image || 'https://via.placeholder.com/300',
      vendorId: req.user.id
    });

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorServices = async (req, res) => {
  try {
    const services = await Service.find({ vendorId: req.user.id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  const { serviceId } = req.params;
  const { title, description, category, price, location, image } = req.body;
  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price) service.price = price;
    if (location) service.location = location;
    if (image) service.image = image;

    await service.save();
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(serviceId);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createService, getVendorServices, updateService, deleteService };
