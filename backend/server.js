// Uncomment and configure these for real transcription and messaging
// const { SpeechClient } = require('@google-cloud/speech');
// const speechClient = new SpeechClient({ keyFilename: 'path-to-google-credentials.json' });

// POST /api/audio: Receive audio, transcribe, and send to agent
app.post('/api/audio', upload.single('audio'), async (req, res) => {
  try {
    const { channel, agentContact } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });
    // Read audio file
    const fs = require('fs');
    const audioBytes = fs.readFileSync(req.file.path).toString('base64');

    // Transcribe audio using Google Speech-to-Text
    let transcription = '';
    try {
      // Uncomment for real transcription
      // const [response] = await speechClient.recognize({
      //   audio: { content: audioBytes },
      //   config: { encoding: 'WEBM_OPUS', languageCode: 'en-US' },
      // });
      // transcription = response.results.map(r => r.alternatives[0].transcript).join(' ');
      transcription = '[Transcription would appear here if Google Speech-to-Text was configured]';
    } catch (err) {
      transcription = '[Transcription failed or not configured]';
    }

    // Send transcription to agent via WhatsApp or Telegram
    let sendResult = '';
    if (channel === 'whatsapp') {
      await sendWhatsAppMessage(agentContact, transcription);
      sendResult = 'Sent to WhatsApp';
    } else if (channel === 'telegram') {
      await sendTelegramMessage(agentContact, transcription);
      sendResult = 'Sent to Telegram';
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, transcription, sendResult });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process audio' });
  }
});
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for audio uploads
const upload = multer({ dest: 'uploads/' });
const checking="checking status of server";
// Dummy agent data by region
const agents = {
  'Accra': [{ name: 'Agent A', phone: '+2331111111', whatsapp: '2331111111', telegram: 'agentA_telegram' }],
  'Kumasi': [{ name: 'Agent B', phone: '+2332222222', whatsapp: '2332222222', telegram: 'agentB_telegram' }],
};
console.log (checking);


// Required for WhatsApp/Telegram integration
// const twilio = require('twilio');
// const { SpeechClient } = require('@google-cloud/speech');

// TODO: Insert your credentials below
// const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
// const telegramBotToken = 'YOUR_TELEGRAM_BOT_TOKEN';
// const speechClient = new SpeechClient({ keyFilename: 'path-to-google-credentials.json' });

// Helper: Send WhatsApp message (Twilio example)
async function sendWhatsAppMessage(to, message) {
  // await twilioClient.messages.create({
  //   from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
  //   to: `whatsapp:${to}`,
  //   body: message,
  // });
}

// Helper: Send Telegram message
async function sendTelegramMessage(chatId, message) {
  // await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
  //   chat_id: chatId,
  //   text: message,
  // });
}

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Agents with coordinates (example data)
const agentsWithCoords = [
  { name: 'Agent A', phone: '+2331111111', whatsapp: '2331111111', telegram: 'agentA_telegram', lat: 5.6037, lng: -0.1870 }, // Accra
  { name: 'Agent B', phone: '+2332222222', whatsapp: '2332222222', telegram: 'agentB_telegram', lat: 6.6885, lng: -1.6244 }, // Kumasi
  { name: 'Agent C', phone: '+2333333333', whatsapp: '2333333333', telegram: 'agentC_telegram', lat: 9.4008, lng: -0.8393 }, // Tamale
  { name: 'Agent D', phone: '+2334444444', whatsapp: '2334444444', telegram: 'agentD_telegram', lat: 7.5610, lng: -0.2554 }, // Koforidua
];

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
