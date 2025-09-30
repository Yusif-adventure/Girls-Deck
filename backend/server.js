const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for audio uploads
const upload = multer({ dest: 'uploads/' });

// Dummy agent data by region
const agents = {
  'Accra': [{ name: 'Agent A', phone: '+2331111111', whatsapp: '2331111111', telegram: 'agentA_telegram' }],
  'Kumasi': [{ name: 'Agent B', phone: '+2332222222', whatsapp: '2332222222', telegram: 'agentB_telegram' }],
};


// Required for WhatsApp/Telegram integration
// const twilio = require('twilio');
// const axios = require('axios');
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
