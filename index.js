const express = require('express');
const app = express();

app.use(express.json());

// In-memory queue to store unread donations
let donationQueue = [];

// Endpoint 1: Receives webhooks from SociaBuzz
app.post('/sociabuzz-webhook', (req, res) => {
    const data = req.body;

    const donation = {
        donor: data.name || data.supporter_name || "Anonymous",
        amount: data.amount || 0,
        message: data.message || ""
    };

    donationQueue.push(donation);
    console.log("New donation queued:", donation);

    res.status(200).json({ status: "success" });
});

// Endpoint 2: Polled by Roblox Studio to retrieve pending donations
app.get('/get-donations', (req, res) => {
    const pending = [...donationQueue];
    donationQueue = []; // Clear queue after sending to Roblox
    res.json({ donations: pending });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));