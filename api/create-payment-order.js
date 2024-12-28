const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { order_id, order_amount, customer_name, customer_email, customer_phone } = req.body;

        // Cashfree API credentials
        const CASHFREE_APP_ID = 'your_cashfree_app_id';  // Replace with your Cashfree app id
        const CASHFREE_SECRET_KEY = 'your_cashfree_secret_key';  // Replace with your Cashfree secret key

        // Prepare data for Cashfree order creation
        const data = {
            order_id: order_id,
            order_amount: order_amount,
            order_currency: 'INR',
            customer_name: customer_name,
            customer_email: customer_email,
            customer_phone: customer_phone,
            return_url: 'https://your-website.com/payment-success',  // Replace with your payment success URL
            notify_url: 'https://your-website.com/payment-notify',  // Replace with your notification URL
        };

        try {
            // Make the API request to Cashfree to create the payment order
            const response = await axios.post('https://api.cashfree.com/api/v2/cftoken/order', data, {
                headers: {
                    'Authorization': `Bearer ${CASHFREE_SECRET_KEY}`,
                },
            });

            // Send the payment token back to the frontend
            res.status(200).json({
                payment_token: response.data.payment_token,  // Send the payment token
            });
        } catch (error) {
            console.error('Error creating Cashfree payment order:', error);
            res.status(500).json({ error: 'Payment order creation failed' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
