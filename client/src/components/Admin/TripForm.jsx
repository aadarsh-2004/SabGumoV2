import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TripForm({ onSubmit, initialData = {}, isEditing = false }) {
  // Initialize state with initialData or defaults
  const [formData, setFormData] = useState({
    location_name: initialData.location_name || '',
    distance: initialData.distance || '',
    card_img: initialData.card_img || '', // URL or path
    info_img: initialData.info_img || '', // URL or path
    title: initialData.title || '',
    card_subtitle: initialData.card_subtitle || '',
    subtitle: initialData.subtitle || '',
    original_cost: initialData.original_cost || '',
    cost: initialData.cost || '',
    duration: initialData.duration || '',
    is_upcoming: initialData.is_upcoming !== undefined ? initialData.is_upcoming : false,
    description: initialData.description || '',
    maps_iframe: initialData.maps_iframe || '',
    itinerary_data: initialData.itinerary_data && initialData.itinerary_data.length > 0 
                      ? initialData.itinerary_data 
                      : [{ day: 1, title: '', activities: [{ time: '', title: '', description: '' }] }],
    rating: initialData.rating || '', 
    reviews_count: initialData.reviews_count || '', 
    features: initialData.features ? JSON.stringify(initialData.features, null, 2) : '',
    start_date: initialData.start_date || '', 
    total_seats: initialData.total_seats || '',
    booked_seats: initialData.booked_seats || '0', 
    badge: initialData.badge || '',
    pdfUrl: initialData.pdfUrl || '', // PDF URL
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // Effect to populate form when initialData changes (for editing)
  useEffect(() => {
    if (isEditing && initialData.id) { // Check if editing and initialData is loaded
      setFormData({
        location_name: initialData.location_name || '',
        distance: initialData.distance || '',
        card_img: initialData.card_img || '', 
        info_img: initialData.info_img || '', 
        title: initialData.title || '',
        card_subtitle: initialData.card_subtitle || '',
        subtitle: initialData.subtitle || '',
        original_cost: initialData.original_cost || '',
        cost: initialData.cost || '',
        duration: initialData.duration || '',
        is_upcoming: initialData.is_upcoming !== undefined ? !!initialData.is_upcoming : false,
        description: initialData.description || '',
        maps_iframe: initialData.maps_iframe || '',
        itinerary_data: initialData.itinerary_data && initialData.itinerary_data.length > 0 
                          ? initialData.itinerary_data 
                          : [{ day: 1, title: '', activities: [{ time: '', title: '', description: '' }] }],
        rating: initialData.rating || '',
        reviews_count: initialData.reviews_count || '',
        features: initialData.features ? JSON.stringify(initialData.features, null, 2) : '',
        start_date: initialData.start_date || '', 
        total_seats: initialData.total_seats || '',
        booked_seats: initialData.booked_seats || '0', 
        badge: initialData.badge || '',
        pdfUrl: initialData.pdfUrl || '', // PDF URL
      });
    }
    // If adding (not editing), ensure default state is set (already handled by useState)
  }, [initialData, isEditing]);

  // Handler for simple input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const formDataObj = new FormData();
    formDataObj.append('image', files[0]);
    
    setUploading(true);
    setUploadError(null);
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          [name]: response.data.url
        }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // --- Itinerary Handlers --- 

  const handleItineraryChange = (dayIndex, field, value) => {
    const newItinerary = [...formData.itinerary_data];
    newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value };
    setFormData(prev => ({ ...prev, itinerary_data: newItinerary }));
  };

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    const newItinerary = [...formData.itinerary_data];
    newItinerary[dayIndex].activities[activityIndex] = {
      ...newItinerary[dayIndex].activities[activityIndex],
      [field]: value,
    };
    setFormData(prev => ({ ...prev, itinerary_data: newItinerary }));
  };

  const addActivity = (dayIndex) => {
    const newItinerary = [...formData.itinerary_data];
    newItinerary[dayIndex].activities.push({ time: '', title: '', description: '' });
    setFormData(prev => ({ ...prev, itinerary_data: newItinerary }));
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...formData.itinerary_data];
    if (newItinerary[dayIndex].activities.length > 1) { // Keep at least one activity
        newItinerary[dayIndex].activities.splice(activityIndex, 1);
        setFormData(prev => ({ ...prev, itinerary_data: newItinerary }));
    }
  };

  const addDay = () => {
    const newDayNumber = formData.itinerary_data.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary_data: [...prev.itinerary_data, { day: newDayNumber, title: '', activities: [{ time: '', title: '', description: '' }] }],
    }));
  };

  const removeDay = (dayIndex) => {
    if (formData.itinerary_data.length > 1) { // Keep at least one day
        const newItinerary = [...formData.itinerary_data];
        newItinerary.splice(dayIndex, 1);
        // Re-number subsequent days if needed (optional, but good practice)
        for(let i = dayIndex; i < newItinerary.length; i++) {
            newItinerary[i].day = i + 1;
        }
        setFormData(prev => ({ ...prev, itinerary_data: newItinerary }));
    }
  };

  // --- Form Submission --- 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation example
    if (!formData.location_name || !formData.title) {
      alert('Trip Location Name and Title are required.');
      return;
    }

    let processedFeatures = [];
    if (formData.features && typeof formData.features === 'string') {
        try {
            processedFeatures = JSON.parse(formData.features);
            if (!Array.isArray(processedFeatures)) {
                console.warn("Parsed features is not an array, defaulting to empty.");
                processedFeatures = []; // Ensure it's an array
            }
        } catch (error) {
            alert('Error parsing Features JSON. Please check the format. Features will be saved as empty.');
            console.error("Error parsing features JSON:", error);
            // Decide how to handle: submit empty, or prevent submission?
            // For now, let's submit empty if parsing fails after alerting.
            processedFeatures = [];
        }
    }

    // Convert costs and counts to numbers
    const numRating = parseFloat(formData.rating) || null; // Use null if invalid
    const numReviewsCount = parseInt(formData.reviews_count, 10) || 0;
    const numCost = parseFloat(formData.cost) || null;
    const numOriginalCost = parseFloat(formData.original_cost) || null;
    const numTotalSeats = parseInt(formData.total_seats, 10) || 0;
    const numBookedSeats = parseInt(formData.booked_seats, 10) || 0;

    // Prepare data for submission
    const dataToSubmit = {
      ...formData, // Include other fields like location_name, title, description etc.
      rating: numRating,
      reviews_count: numReviewsCount,
      cost: numCost,
      original_cost: numOriginalCost,
      features: processedFeatures, // Use processed array
      is_upcoming: !!formData.is_upcoming, // Ensure boolean
      start_date: formData.start_date, // Send as 'YYYY-MM-DD' string
      total_seats: numTotalSeats,
      booked_seats: numBookedSeats,
      badge: formData.badge.trim(),
    };
    // console.log("Submitting data:", dataToSubmit); // For debugging
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
      {/* Basic Trip Details */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">Trip Location Name*</label>
          <input type="text" id="location_name" name="location_name" value={formData.location_name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., Kashmir, Goa, Ladakh" />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Display Title*</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., Magical Kashmir Vacation" />
        </div>
         <div>
          <label htmlFor="card_subtitle" className="block text-sm font-medium text-gray-700">Card Subtitle</label>
          <input type="text" id="card_subtitle" name="card_subtitle" value={formData.card_subtitle} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 7-day adventure" />
        </div>
         <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Main Subtitle</label>
          <input type="text" id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., Experience the beauty of the Himalayas" />
        </div>
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance</label>
          <input type="text" id="distance" name="distance" value={formData.distance} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 850 km from Delhi" />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
          <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 7 Days / 6 Nights" />
        </div>
        <div>
          <label htmlFor="original_cost" className="block text-sm font-medium text-gray-700">Original Cost</label>
          <input type="text" id="original_cost" name="original_cost" value={formData.original_cost} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., ₹35,000" />
        </div>
         <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Discounted Cost</label>
          <input type="text" id="cost" name="cost" value={formData.cost} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., ₹29,999" />
        </div>
         <div>
          <label htmlFor="card_img" className="block text-sm font-medium text-gray-700">Card Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="card_img_upload"
              name="card_img"
              onChange={handleImageUpload}
              className="sr-only"
              accept="image/*"
            />
            <label
              htmlFor="card_img_upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              {uploading && formData.card_img === initialData.card_img ? 'Uploading...' : 'Upload Image'}
            </label>
            <input
              type="text"
              id="card_img"
              name="card_img"
              value={formData.card_img}
              onChange={handleChange}
              className="ml-2 flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Or enter image URL"
            />
          </div>
          {formData.card_img && (
            <div className="mt-2">
              <img 
                src={formData.card_img} 
                alt="Card Preview" 
                className="h-24 w-auto border rounded-md" 
              />
            </div>
          )}
        </div>
         <div>
          <label htmlFor="info_img" className="block text-sm font-medium text-gray-700">Info Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              id="info_img_upload"
              name="info_img"
              onChange={handleImageUpload}
              className="sr-only"
              accept="image/*"
            />
            <label
              htmlFor="info_img_upload"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              {uploading && formData.info_img === initialData.info_img ? 'Uploading...' : 'Upload Image'}
            </label>
            <input
              type="text"
              id="info_img"
              name="info_img"
              value={formData.info_img}
              onChange={handleChange}
              className="ml-2 flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Or enter image URL"
            />
          </div>
          {formData.info_img && (
            <div className="mt-2">
              <img 
                src={formData.info_img} 
                alt="Info Preview" 
                className="h-24 w-auto border rounded-md" 
              />
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Detailed description of the trip, attractions, and experiences..."></textarea>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="maps_iframe" className="block text-sm font-medium text-gray-700">Google Maps IFrame Embed Code</label>
          <textarea id="maps_iframe" name="maps_iframe" rows="3" value={formData.maps_iframe} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'></textarea>
        </div>
         <div className="flex items-center">
          <input type="checkbox" id="is_upcoming" name="is_upcoming" checked={formData.is_upcoming} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <label htmlFor="is_upcoming" className="ml-2 block text-sm text-gray-900">Is Upcoming Trip?</label>
        </div>
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center justify-center bg-blue-50 p-4 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
          <p className="text-blue-700">Uploading image to Cloudinary...</p>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p className="font-medium">Upload Error</p>
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      {/* Trip Rating & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
          <input type="number" id="rating" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 4.7" />
        </div>
        <div>
          <label htmlFor="reviews_count" className="block text-sm font-medium text-gray-700">Number of Reviews</label>
          <input type="number" id="reviews_count" name="reviews_count" min="0" value={formData.reviews_count} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 142" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (JSON Array)</label>
          <textarea id="features" name="features" rows="3" value={formData.features} onChange={handleChange} placeholder='["Guided Tours", "All Meals Included", "Luxury Hotels", "Airport Transfers"]' className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"></textarea>
        </div>
      </div>

      {/* Trip Scheduling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label htmlFor="total_seats" className="block text-sm font-medium text-gray-700">Total Seats</label>
          <input type="number" id="total_seats" name="total_seats" min="0" value={formData.total_seats} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 20" />
        </div>
        <div>
          <label htmlFor="booked_seats" className="block text-sm font-medium text-gray-700">Booked Seats</label>
          <input type="number" id="booked_seats" name="booked_seats" min="0" value={formData.booked_seats} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g., 12" />
        </div>
        <div>
          <label htmlFor="badge" className="block text-sm font-medium text-gray-700">Badge Text</label>
          <input type="text" id="badge" name="badge" value={formData.badge} onChange={handleChange} placeholder="Popular, New, Limited, Sale" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
         <div className="md:col-span-2">
          <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700">PDF URL (for itinerary download)</label>
          <input type="url" id="pdfUrl" name="pdfUrl" value={formData.pdfUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="https://drive.google.com/file/d/..." />
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Trip Itinerary</h3>
          <button type="button" onClick={addDay} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">Add Day</button>
        </div>
        
        {formData.itinerary_data.map((day, dayIndex) => (
          <div key={dayIndex} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium">Day {day.day}</h4>
              {formData.itinerary_data.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeDay(dayIndex)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                >
                  Remove Day
                </button>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor={`day-${dayIndex}-title`} className="block text-sm font-medium text-gray-700">Day Title</label>
              <input 
                type="text" 
                id={`day-${dayIndex}-title`} 
                value={day.title} 
                onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                placeholder={`Day ${day.day} - e.g., Arrival in Srinagar`}
              />
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium">Activities</h5>
                <button 
                  type="button" 
                  onClick={() => addActivity(dayIndex)}
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
                >
                  Add Activity
                </button>
              </div>
              
              {day.activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="p-3 mb-2 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">Activity {activityIndex + 1}</span>
                    {day.activities.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label htmlFor={`activity-${dayIndex}-${activityIndex}-time`} className="block text-xs font-medium text-gray-700">Time</label>
                      <input 
                        type="text" 
                        id={`activity-${dayIndex}-${activityIndex}-time`} 
                        value={activity.time} 
                        onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'time', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm" 
                        placeholder="e.g. Morning, Afternoon, Evening"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor={`activity-${dayIndex}-${activityIndex}-title`} className="block text-xs font-medium text-gray-700">Title</label>
                      <input 
                        type="text" 
                        id={`activity-${dayIndex}-${activityIndex}-title`} 
                        value={activity.title} 
                        onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'title', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm" 
                        placeholder="e.g., Visit Dal Lake"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor={`activity-${dayIndex}-${activityIndex}-description`} className="block text-xs font-medium text-gray-700">Description</label>
                      <textarea 
                        id={`activity-${dayIndex}-${activityIndex}-description`} 
                        value={activity.description} 
                        onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'description', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-sm"
                        rows="2"
                        placeholder="Describe the activity in detail..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : isEditing ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
}

export default TripForm;
