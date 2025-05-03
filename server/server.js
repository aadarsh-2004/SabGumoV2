const express = require('express');
const cors = require('cors');
// nodemailer no longer needed
require('dotenv').config(); // Load environment variables from .env file
const supabase = require('./supabase'); // Use Supabase instead of SQLite DB
const cloudinary = require('./cloudinary'); // Import Cloudinary configuration
const fileUpload = require('express-fileupload'); // Import express-fileupload
const adminAuthRoutes = require('./routes/adminAuth'); // Import admin routes
const tripRoutes = require('./routes/trips'); // Import trip routes

const app = express();
const PORT = process.env.PORT || 3001; // Backend server port

// Middleware
// Configure CORS for Vercel deployment
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow requests from specified origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Allow Vercel preview deployment URLs (if pattern is known/needed)
    if (/--subgumo-2.*\.vercel\.app$/.test(origin)) { 
        return callback(null, true);
    }
    // Otherwise, disallow
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true, // Allow cookies if needed for auth sessions
})); 

app.use(express.json()); // Parse JSON request bodies
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
})); // Add file upload middleware

// Placeholder Route
app.get('/', (req, res) => {
  res.send('SubGumo Backend Server Running!');
});

// --- API Routes --- 
app.use('/api/admin', adminAuthRoutes); // Use admin auth routes
app.use('/api/trips', tripRoutes); // Use trip CRUD routes

// --- Image Upload Route ---
app.post('/api/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file uploaded' 
      });
    }

    const file = req.files.image;
    
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'subgumo', // Store in a specific folder
      use_filename: true,
      unique_filename: true,
    });

    // Return the Cloudinary URL and other details
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
});

// --- Inquiry Routes ---
// POST /api/send-email - Save inquiry to database (renamed endpoint would be better but keeping for compatibility)
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, destination, guests, travelDates, message } = req.body;

  // Basic Validation
  if (!name || !email || !destination) {
      return res.status(400).json({ message: 'Missing required inquiry fields (name, email, destination).' });
  }

  // Save inquiry to Supabase
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name,
        email,
        phone,
        destination,
        guests,
        travel_dates: travelDates, // Use snake_case column name for Supabase
        message,
        received_at: new Date().toISOString(), // Use ISO string format for timestamp
        is_completed: false
      }])
      .select();
    
    if (error) throw new Error(`Failed to save inquiry: ${error.message}`);
    
    console.log(`Inquiry saved with ID: ${data[0].id}`);
    res.status(200).json({ message: 'Inquiry received successfully!' });
  } catch (dbError) {
    console.error('Database error saving inquiry:', dbError.message);
    return res.status(500).json({ message: dbError.message });
  }
});

// GET /api/inquiries - Get all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('received_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching inquiries:', err.message);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

// POST /api/inquiries - Create a new inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, destination, message, travelDates, guests } = req.body;
  
  if (!name || !email || !message) { // Basic validation
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }
  
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name, 
        email, 
        phone, 
        destination,
        guests,
        travel_dates: travelDates, // Use snake_case column name for Supabase
        message,
        received_at: new Date().toISOString(),
        is_completed: false
      }])
      .select();
    
    if (error) throw error;
    
    console.log(`New inquiry created with ID: ${data[0].id}`);
    res.status(201).json({ message: 'Inquiry submitted successfully', id: data[0].id });
  } catch (err) {
    console.error('Error creating inquiry:', err.message);
    res.status(500).json({ message: 'Error submitting inquiry' });
  }
});

// PATCH /api/inquiries/:id - Update inquiry status
app.patch('/api/inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body; // Expecting { is_completed: boolean }

  // Validate input
  if (typeof is_completed !== 'boolean') {
    return res.status(400).json({ message: 'Invalid status provided. Expecting a boolean value for is_completed.' });
  }

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ is_completed })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    console.log(`Inquiry ${id} status updated to ${is_completed}.`);
    res.status(200).json({ message: 'Inquiry status updated successfully' });
  } catch (err) {
    console.error(`Error updating inquiry ${id}:`, err.message);
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
});

// Start the server - COMMENTED OUT FOR VERCEL
/*
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
*/

// Export the app for Vercel
module.exports = app;
