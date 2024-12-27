const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const CASHFREE_APP_ID = 'YOUR_APP_ID';
const CASHFREE_SECRET_KEY = 'YOUR_SECRET_KEY';

app.post('/create_order', (req, res) => {
    const { cart, totalPrice } = req.body;

    // Generate a unique order ID
    const orderId = 'ORDER_' + Date.now();

    // Prepare the signature data
    const data = {
        order_id: orderId,
        order_amount: totalPrice,
        customer_name: 'Customer Name', // Replace with actual customer data
        customer_email: 'customer@example.com', // Replace with actual customer email
        customer_phone: '9999999999', // Replace with actual customer phone
    };

    // Create a signature
    const signatureData = `${data.order_id}|${data.order_amount}|${CASHFREE_APP_ID}`;
    const signature = crypto.createHmac('sha256', CASHFREE_SECRET_KEY).update(signatureData).digest('hex');

    // Return the order details and signature
    res.json({
        order_id: orderId,
        signature: signature,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
