const { Redis } = require('@upstash/redis');
const redis = Redis.fromEnv();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Extract donor name across all common SociaBuzz payload variants
  const donorName = body.supporter_name 
                 || body.name 
                 || body.display_name 
                 || body.buyer_name 
                 || (body.data && body.data.supporter_name)
                 || "Anonymous";

  const donationAmount = body.amount 
                      || body.nominal 
                      || body.amount_raw 
                      || (body.data && body.data.amount)
                      || 0;

  const donationMessage = body.message 
                       || body.comment 
                       || (body.data && body.data.message)
                       || "";

  const donation = {
    id: Date.now(),
    donor: donorName,
    amount: Number(donationAmount),
    message: donationMessage,
    timestamp: new Date().toISOString()
  };

  await redis.rpush('donations', JSON.stringify(donation));
  console.log("Saved donation:", donation);

  return res.status(200).send("OK");
};
