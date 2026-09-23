const store = require('./_store');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Extract fields handling various SociaBuzz payload formats
  const donorName = body.supporter_name || body.name || body.display_name || "Anonymous Donor";
  const donationAmount = body.amount || body.nominal || body.amount_raw || 0;
  const donationMessage = body.message || body.comment || "No message";

  const donation = {
    id: Date.now(),
    donor: donorName,
    amount: donationAmount,
    message: donationMessage,
    timestamp: new Date().toISOString()
  };

  store.push(donation);
  console.log("Received payload:", body);

  return res.status(200).send("OK");
};
