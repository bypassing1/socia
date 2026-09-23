const express = require('express');
const app = express();

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory queue to temporarily store incoming donations
let donationQueue = [];

// Secret key for authentication with Roblox
// Change this to a secure random string
const ROBLOX_SECRET = process.env.ROBLOX_SECRET || "YOUR_CUSTOM_SECRET_KEY";

// Root health check endpoint
app.get('/', (req, res) => {
  res.send('SociaBuzz to Roblox middleware is running!');
});

// 1. Endpoint for SociaBuzz Webhook
app.post('/webhook/sociabuzz', (req, res) => {
  const { supporter_name, amount, message } = req.body;

  const donation = {
    id: Date.now(),
    donor: supporter_name || "Anonymous",
    amount: amount || 0,
    message: message || "",
    timestamp: new Date().toISOString()
  };

  donationQueue.push(donation);
  console.log("New SociaBuzz Donation Received:", donation);

  // Return HTTP 200 to acknowledge receipt to SociaBuzz
  res.status(200).send("OK");
});

// 2. Endpoint polled by Roblox Game Server
app.get('/api/donations', (req, res) => {
  const clientSecret = req.headers['x-roblox-secret'];

  // Verify request authority from Roblox
  if (clientSecret !== ROBLOX_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve current unhandled donations and clear queue
  const currentDonations = [...donationQueue];
  donationQueue = [];

  res.json({ success: true, donations: currentDonations });
});

// Listen on Railway's dynamic PORT or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});