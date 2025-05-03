# Cloudinary Setup for SubGumo

This document explains how to set up Cloudinary for image hosting on your SubGumo travel website.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signing up, you'll be taken to your dashboard
3. Take note of your Cloud Name, API Key, and API Secret

## 2. Configure Your Server

1. Add the following to your `.env` file in the server directory:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. Replace the placeholder values with your actual Cloudinary credentials

## 3. Test Your Connection

1. Start your server: `npm start`
2. Open your admin panel and try to upload an image using the TripForm
3. If successful, you should see the image uploaded to Cloudinary and displayed in the form

## Benefits of Using Cloudinary

- **Automatic Optimization**: Images are automatically optimized for web delivery
- **Responsive Images**: Cloudinary can generate different sizes based on screen size
- **CDN Delivery**: Images are delivered via a global CDN for fast loading
- **Transformations**: You can resize, crop, and apply effects through URL parameters
- **25GB Storage**: Free tier includes 25GB storage and 25GB monthly bandwidth

## URL Transformations

You can modify images on-the-fly by adding parameters to the URL. For example:

- Resize: Add `w_500,h_300` to resize to 500x300px
- Crop: Add `c_fill` to crop the image to fit
- Quality: Add `q_auto` for automatic quality optimization

Example: `https://res.cloudinary.com/your-cloud-name/image/upload/w_500,h_300,c_fill,q_auto/your-image-id.jpg` 