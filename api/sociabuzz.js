const { Redis } = require('@upstash/redis');

// Automatically connects using Vercel environment variables
const redis = Redis.fromEnv();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  const donorName = body.supporter_name || body.name || body.display_name || "Anonymous";
  const donationAmount = body.amount || body.nominal || body.amount_raw || 0;
  const donationMessage = body.message || body.comment || "No message";

  const donation = {
    id: Date.now(),
    donor: donorName,
    amount: donationAmount,
    message: donationMessage,
    timestamp: new Date().toISOString()
  };

  // Push item into a persistent Redis list named "donations"
  await redis.rpush('donations', JSON.stringify(donation));
  console.log("Saved donation to Redis:", donation);

  return res.status(200).send("OK");
};
