const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Cashfree credentials (use environment variables for security)
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Parse JSON data
app.use(express.json());

// Endpoint to create order and signature for Cashfree
app.post('/create_order', (req, res) => {
    const { cart, totalPrice } = req.body;

    // Generate a unique order ID (usually from the backend)
    const orderId = 'ORDER_' + Date.now();

    // Prepare the signature data
    const data = {
        order_id: orderId,
        order_amount: totalPrice,
        customer_name: 'Customer Name', // Replace with actual customer data
        customer_email: 'customer@example.com', // Replace with actual customer email
        customer_phone: '9999999999', // Replace with actual customer phone
    };

    // Generate Cashfree signature using HMAC SHA256
    const signatureData = `${data.order_id}|${data.order_amount}|${CASHFREE_APP_ID}`;
    const signature = crypto.createHmac('sha256', CASHFREE_SECRET_KEY).update(signatureData).digest('hex');

    // Return the order details and signature
    res.json({
        order_id: orderId,
        signature: signature,
    });
});

// Serve the frontend index.html when visiting the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
