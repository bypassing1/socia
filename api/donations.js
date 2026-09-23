const store = require('./_store');
const ROBLOX_SECRET = process.env.ROBLOX_SECRET || "a8f9c2d1-4e7a-4b9e";

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientSecret = req.headers['x-roblox-secret'];

  if (clientSecret !== ROBLOX_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Drain store queue
  const currentDonations = [...store];
  store.length = 0; 

  return res.status(200).json({ success: true, donations: currentDonations });
};
