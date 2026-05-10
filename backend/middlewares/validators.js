import { z } from 'zod';

// Schema for User Signup
const signupSchema = z.object({
  body: z.object({ // Added wrapper
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().max(10, "Phone number must be of 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(['customer', 'vendor']),
    city: z.string().min(2, "City is required").optional(),
  })
});

// Schema for Booking Creation
const bookingSchema = z.object({
  body:z.object({
    serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Service ID"),
    bookingDate: z.string().refine((date) => new Date(date) > new Date(), {
      message: "Booking date must be in the future",
    }),
    serviceAddress: z.string().min(10, "Please provide a more detailed address (min 10 chars)"),
  })
});

const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string({ required_error: "Service ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Service ID format"),
    bookingDate: z.string({ required_error: "Date is required" })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
      .refine((val) => new Date(val) > new Date(), { message: "Date must be in the future" }),
    serviceAddress: z.string({ required_error: "Address is required" })
      .min(10, "Address is too short, please provide more detail"),
  }),
});

// Schema for updating status
const updateStatusSchema = z.object({
  body: z.object({
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Booking ID"),
    status: z.enum(["accepted", "completed", "cancelled"], {
      error_map: () => ({ message: "Status must be accepted, completed, or cancelled" }),
    }),
  }),
});


const validate = (schema) => async (req, res, next) => {
  //console.log(req.body);
  try {
    await schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error){
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: error?.issues[0]?.message || "Validation Error"
      });
    }
    // If it's not a Zod error, pass it to your global error handler
    next(error); 
    }
  };

export {signupSchema,bookingSchema,createBookingSchema,updateStatusSchema,validate};