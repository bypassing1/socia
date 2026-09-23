const store = require('./_store');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { supporter_name, amount, message } = req.body || {};

  const donation = {
    id: Date.now(),
    donor: supporter_name || "Anonymous",
    amount: amount || 0,
    message: message || "",
    timestamp: new Date().toISOString()
  };

  store.push(donation);
  console.log("New donation received:", donation);

  return res.status(200).send("OK");
};
