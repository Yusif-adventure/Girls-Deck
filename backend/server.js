

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

// Agents with coordinates (example data)
const agentsWithCoords = [
  { name: 'Agent A', phone: '+2331111111', whatsapp: '2331111111', telegram: 'agentA_telegram', lat: 5.6037, lng: -0.1870 }, // Accra
  { name: 'Agent B', phone: '+2332222222', whatsapp: '2332222222', telegram: 'agentB_telegram', lat: 6.6885, lng: -1.6244 }, // Kumasi
  { name: 'Agent C', phone: '+2333333333', whatsapp: '2333333333', telegram: 'agentC_telegram', lat: 9.4008, lng: -0.8393 }, // Tamale
  { name: 'Agent D', phone: '+2334444444', whatsapp: '2334444444', telegram: 'agentD_telegram', lat: 7.5610, lng: -0.2554 }, // Koforidua
];

// Return all agents (for audio page agent select)
app.get('/api/agents', (req, res) => {
  res.json({ agents: agentsWithCoords });
});

app.post('/api/audio', upload.single('audio'), async (req, res) => {
  try {
    const { channel } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });
    const fs = require('fs');
    let transcription = '[Transcription would appear here if Google Speech-to-Text was configured]';
    let sendResult = '';
    if (channel === 'whatsapp') {
      sendResult = 'Sent to WhatsApp';
    } else if (channel === 'telegram') {
      sendResult = 'Sent to Telegram';
    }
    fs.unlinkSync(req.file.path);
    res.json({ success: true, transcription, sendResult });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Haversine formula to calculate distance between two lat/lng points (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

app.post('/api/nearest-agents', async (req, res) => {
  const { lat, lng } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'lat and lng required as numbers' });
  }

  // Reverse geocode using OpenStreetMap Nominatim
  let place = '';
  try {
    const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'GirlsDeckApp/1.0 (your-email@example.com)'
      }
    });
    if (geoRes.data && geoRes.data.address) {
      const addr = geoRes.data.address;
      place = addr.city || addr.town || addr.village || addr.hamlet || addr.county || addr.state || addr.country || '';
    }
  } catch (e) {
    place = '';
  }

  const agentsSorted = agentsWithCoords
    .map(agent => ({
      ...agent,
      distance: getDistanceFromLatLonInKm(lat, lng, agent.lat, agent.lng)
    }))
    .sort((a, b) => a.distance - b.distance);
  res.json({ place, agents: agentsSorted });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
