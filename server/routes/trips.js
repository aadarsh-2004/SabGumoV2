const express = require('express');
const supabase = require('../supabase'); // Use Supabase instead of SQLite

const router = express.Router();

// Helper function for safe JSON parsing
const safeJsonParse = (str, defaultValue = []) => {
  if (!str) return defaultValue;
  try {
    // Ensure we don't double-parse if it's already an object/array (e.g., from req.body)
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (e) {
    console.error("Failed to parse JSON string:", str, e);
    return defaultValue;
  }
};

// Helper function for safe JSON stringifying
const safeJsonStringify = (obj, defaultValue = '[]') => {
  if (obj === undefined || obj === null) return defaultValue;
  try {
    // Ensure we don't double-stringify if it's already a string
    return typeof obj === 'string' ? obj : JSON.stringify(obj);
  } catch (e) {
    console.error("Failed to stringify object:", obj, e);
    return defaultValue;
  }
};

// --- Trip CRUD Operations --- 

// GET /api/trips - Get all trips
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) throw error;

    // Process trips (no need to parse JSON as Supabase returns parsed JSON for JSONB columns)
    const trips = data.map(trip => ({
      ...trip,
      // Calculate remaining seats
      remaining_seats: trip.total_seats - trip.booked_seats,
      // Convert boolean for consistency with frontend
      is_upcoming: !!trip.is_upcoming
    }));
    
    res.status(200).json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err.message);
    res.status(500).json({ message: 'Error fetching trips' });
  }
});

// GET /api/trips/:id - Get a single trip by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Trip not found' });
      }
      throw error;
    }
    
    // Add remaining seats calculation
    const trip = {
      ...data,
      remaining_seats: data.total_seats - data.booked_seats,
      is_upcoming: !!data.is_upcoming
    };
    
    res.status(200).json(trip);
  } catch (err) {
    console.error(`Error fetching trip ${id}:`, err.message);
    res.status(500).json({ message: 'Error fetching trip' });
  }
});

// POST /api/trips - Create a new trip
router.post('/', async (req, res) => {
  // Extract data from request body
  const {
    location_name, distance, card_img, info_img, title, card_subtitle,
    subtitle, original_cost, cost, duration, is_upcoming,
    description, maps_iframe, itinerary_data,
    rating, reviews_count, features,
    start_date, total_seats, booked_seats, badge, pdfUrl
  } = req.body;

  // Basic validation
  if (!location_name || !title || !itinerary_data) {
    return res.status(400).json({ message: 'Missing required trip fields (location_name, title, itinerary_data)' });
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([{
        location_name,
        distance,
        card_img,
        info_img,
        title,
        card_subtitle,
        subtitle,
        original_cost,
        cost,
        duration,
        is_upcoming,
        description,
        rating,
        reviews_count,
        features, // Supabase will store this as JSONB
        start_date,
        total_seats,
        booked_seats,
        badge,
        maps_iframe,
        itinerary_data, // Supabase will store this as JSONB
        pdfUrl
      }])
      .select();
    
    if (error) throw error;
    
    console.log(`New trip created with ID: ${data[0].id}`);
    res.status(201).json({ message: 'Trip created successfully', id: data[0].id });
  } catch (err) {
    console.error('Error creating trip:', err.message);
    res.status(500).json({ message: 'Error creating trip' });
  }
});

// PUT /api/trips/:id - Update an existing trip
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    location_name, distance, card_img, info_img, title, card_subtitle,
    subtitle, original_cost, cost, duration, is_upcoming,
    description, maps_iframe, itinerary_data,
    rating, reviews_count, features,
    start_date, total_seats, booked_seats, badge, pdfUrl
  } = req.body;

  // Basic validation
  if (!location_name || !title || !itinerary_data) {
    return res.status(400).json({ message: 'Missing required trip fields (location_name, title, itinerary_data)' });
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .update({
        location_name,
        distance,
        card_img,
        info_img,
        title,
        card_subtitle,
        subtitle,
        original_cost,
        cost,
        duration,
        is_upcoming,
        description,
        rating,
        reviews_count,
        features,
        start_date,
        total_seats,
        booked_seats,
        badge,
        maps_iframe,
        itinerary_data,
        pdfUrl
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Trip not found for update' });
    }
    
    console.log(`Trip ${id} updated successfully.`);
    res.status(200).json({ message: 'Trip updated successfully' });
  } catch (err) {
    console.error(`Error updating trip ${id}:`, err.message);
    res.status(500).json({ message: 'Error updating trip' });
  }
});

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Trip not found for deletion' });
    }
    
    console.log(`Trip ${id} deleted successfully.`);
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    console.error(`Error deleting trip ${id}:`, err.message);
    res.status(500).json({ message: 'Error deleting trip' });
  }
});

module.exports = router;
