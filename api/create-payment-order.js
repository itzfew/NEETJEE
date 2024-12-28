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

    try {
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

      // Log the response to check for errors or unexpected results
      const responseText = await response.text(); // Use `text()` to capture non-JSON responses
      console.log("Cashfree Response:", responseText);

      // Attempt to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText); // Try parsing as JSON
      } catch (e) {
        // If parsing fails, log and send a response with the raw response
        console.error("Error parsing response as JSON:", e.message);
        return res.status(500).json({
          status: 'error',
          message: 'Error parsing Cashfree response',
          raw_response: responseText
        });
      }

      if (data.status === 'OK') {
        return res.json({
          status: 'success',
          payment_url: data.payment_url
        });
      } else {
        return res.status(500).json({ 
          status: 'error', 
          message: data.message || 'Unknown error from Cashfree' 
        });
      }
    } catch (error) {
      console.error("Error during API call to Cashfree:", error.message);
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
