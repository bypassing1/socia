const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();
const ROBLOX_SECRET = process.env.ROBLOX_SECRET || "a8f9c2d1-4e7a-4b9e";

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientSecret = req.headers['x-roblox-secret'] || req.query.secret;

  if (clientSecret !== ROBLOX_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve all items stored in Redis
  const rawDonations = await redis.lrange('donations', 0, -1);
  
  // Clear the list once retrieved so items aren't processed twice
  if (rawDonations.length > 0) {
    await redis.del('donations');
  }

  const donations = rawDonations.map(item => (typeof item === 'string' ? JSON.parse(item) : item));

  return res.status(200).json({ success: true, donations });
};
