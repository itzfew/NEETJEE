const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customer_name, customer_email, customer_address, amount, currency } = req.body;

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    // Prepare payment order data
    const orderData = {
      order_id: `ORD_${Date.now()}`,
      order_amount: amount,
      order_currency: currency,
      customer_name,
      customer_email,
      customer_phone: "9999999999",  // You can collect phone in the checkout form
      return_url: `https://your-site.com/payment-success`,
      cancel_url: `https://your-site.com/payment-failure`
    };

    // Make API call to Cashfree
    const response = await fetch('https://api.cashfree.com/api/v2/cftoken/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cf-access-key-id': appId,
        'x-cf-secret-key': secretKey
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (data.status === 'OK') {
      // Payment link or details
      return res.json({
        status: 'success',
        payment_url: data.payment_url
      });
    } else {
      return res.status(500).json({ status: 'error', message: data.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
