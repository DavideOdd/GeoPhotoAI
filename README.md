# GeoPhotoAI

Generate AI photos based on your location and weather conditions, with authentic analog film aesthetics.

## Features

- **Location-Aware**: Uses your GPS position to contextualize the generated image
- **Weather Integration**: Fetches real-time weather data to influence the scene
- **Analog Film Simulation**: Choose from 10 iconic film stocks (Kodak Portra, Fuji Velvia, Cinestill 800T, etc.)
- **Full Camera Control**: Adjust ISO, aperture, shutter speed, filters, grain, and vignette
- **Multiple Formats**: 35mm, 6x6 Medium Format, Polaroid, Panoramic, and more
- **AI Image Generation**: Powered by Pollinations.ai or Dezgo (free, no API key required)
- **Email Sharing**: Send your creation directly via email with all photo metadata

## Live Demo

Once deployed, access the app at: `https://[your-username].github.io/GeoPhotoAI`

## Quick Start

1. Clone or download this repository
2. Configure EmailJS (see setup guide below)
3. Deploy to GitHub Pages
4. Open on your mobile device and start shooting!

---

## EmailJS Setup Guide

GeoPhotoAI uses EmailJS to send photos via email. Follow these steps to configure it:

### Step 1: Create an EmailJS Account

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click "Sign Up Free"
3. Create your account (free tier allows 200 emails/month)

### Step 2: Add an Email Service

1. After logging in, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook**
   - **Yahoo**
   - Or any other provider
4. Follow the connection instructions for your provider
5. Give your service a name (e.g., "GeoPhotoAI")
6. Click **Create Service**
7. **Copy the Service ID** (looks like `service_xxxxxxx`)

### Step 3: Create an Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Set up your template:

**Template Name**: `geophotoai_template`

**Subject**:
```
Your GeoPhotoAI Capture - {{location}}
```

**Content** (HTML):
```html
<div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f5f5dc; padding: 20px;">
  <h1 style="color: #FFD700; text-align: center;">GeoPhotoAI</h1>

  <div style="text-align: center; margin: 20px 0;">
    <img src="{{image_url}}" alt="Your Photo" style="max-width: 100%; border: 8px solid white;">
  </div>

  {{#if message}}
  <div style="background: #252525; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="color: #FFD700; margin: 0 0 10px 0;">Personal Message:</p>
    <p style="margin: 0;">{{message}}</p>
  </div>
  {{/if}}

  <pre style="background: #252525; padding: 15px; border-radius: 8px; font-size: 12px; overflow-x: auto;">{{photo_data}}</pre>

  <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
    Generated with GeoPhotoAI
  </p>
</div>
```

4. Click **Save**
5. **Copy the Template ID** (looks like `template_xxxxxxx`) template_g9511h6

### Step 4: Get Your Public Key

1. Go to **Account** (click your email in the top right) 
2. Select **General**
3. Find and **copy your Public Key** ujq30eb0nXJjojxXx

### Step 5: Configure the App

1. Open `config.js` in your project
2. Replace the placeholder values:

```javascript
const CONFIG = {
    EMAILJS_PUBLIC_KEY: 'your_actual_public_key',
    EMAILJS_SERVICE_ID: 'your_actual_service_id',
    EMAILJS_TEMPLATE_ID: 'your_actual_template_id',
    // ... rest of config
};
```

3. Save the file

### Step 6: Test

1. Open the app locally or deploy it
2. Generate a photo
3. Enter your email and send
4. Check your inbox!

---

## Deployment to GitHub Pages

### Option 1: GitHub Web Interface

1. Create a new repository on GitHub named `GeoPhotoAI`
2. Upload all project files
3. Go to **Settings** > **Pages**
4. Under "Source", select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**
7. Wait a few minutes, then access `https://[username].github.io/GeoPhotoAI`

### Option 2: Git Command Line

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - GeoPhotoAI"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/[username]/GeoPhotoAI.git

# Push
git push -u origin main
```

Then enable GitHub Pages in repository settings.

---

## Project Structure

```
GeoPhotoAI/
├── index.html          # Main HTML file
├── config.js           # Configuration (EmailJS credentials)
├── css/
│   └── style.css       # Kodak '80s vintage styling
├── js/
│   ├── app.js          # Main application logic
│   ├── geolocation.js  # Location detection
│   ├── weather.js      # Open-Meteo integration
│   ├── ai-generator.js # AI image generation
│   └── email.js        # EmailJS integration
├── assets/             # Static assets (if any)
└── README.md           # This file
```

---

## Available Film Stocks

| Film | Characteristics |
|------|----------------|
| Kodak Portra 400 | Warm tones, soft skin tones, portrait film |
| Kodak Ektar 100 | Vivid saturation, punchy contrast |
| Kodak Tri-X 400 | Classic B&W, high contrast |
| Kodak Gold 200 | Golden warmth, nostalgic |
| Fuji Velvia 50 | Extreme saturation, vivid colors |
| Fuji Superia 400 | Cool tones, muted colors |
| Ilford HP5 Plus | B&W, fine grain, wide tonal range |
| Cinestill 800T | Cinematic, orange/teal, halation |
| Agfa Vista 200 | Pastel, faded vintage |
| Polaroid 600 | Instant film, unique color cast |

---

## Available Formats

| Format | Aspect Ratio | Style |
|--------|--------------|-------|
| 35mm | 3:2 | Standard |
| 6x6 Medium | 1:1 | Hasselblad style |
| 6x7 Medium | 7:6 | Mamiya style |
| 4x5 Large | 5:4 | View camera |
| Polaroid | 1:1 | With white border |
| 110 Film | 4:3 | Pocket camera |
| Half Frame | 3:4 | Vertical |
| Panoramic | 65:24 | XPan style |

---

## Technologies Used

- **HTML5/CSS3/JavaScript** - Pure frontend, no frameworks
- **Geolocation API** - Browser location detection
- **Nominatim** - Reverse geocoding (OpenStreetMap)
- **Open-Meteo** - Weather data (free, no API key)
- **Pollinations.ai** - AI image generation (free, no API key)
- **Dezgo** - Alternative AI generation (free tier)
- **EmailJS** - Email sending service

---

## Privacy

- Location data is only used for image generation and is not stored
- Weather data is fetched based on coordinates only
- Email addresses are sent directly to EmailJS and not stored by the app
- No analytics or tracking

---

## Troubleshooting

### Location not working?
- Make sure you've granted location permissions
- Try on HTTPS (required for geolocation)
- Check if location services are enabled on your device

### Image not generating?
- Pollinations.ai may be slow during peak times (wait up to 2 minutes)
- Try switching to Dezgo as an alternative
- Check your internet connection

### Email not sending?
- Verify your EmailJS credentials in `config.js`
- Check that you haven't exceeded the free tier limit (200/month)
- Make sure your email template has the correct variable names

---

## License

MIT License - Feel free to use, modify, and distribute.

---

## Credits

Created with Kodak '80s vibes.

Powered by:
- [Pollinations.ai](https://pollinations.ai/)
- [Open-Meteo](https://open-meteo.com/)
- [EmailJS](https://www.emailjs.com/)
- [OpenStreetMap/Nominatim](https://nominatim.org/)
