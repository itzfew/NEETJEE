// Handle payment initiation and send data to serverless backend function for Cashfree payment
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('product') === '1' ? 'Product 1' : 'Product 2';
    const price = params.get('price');

    document.getElementById('product-name').innerText = productName;
    document.getElementById('product-price').innerText = '$' + price;

    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        initiatePayment(price);
    });
};

function initiatePayment(price) {
    const orderData = {
        order_id: 'order_' + new Date().getTime(),
        order_amount: price,
        order_currency: 'INR',
        customer_name: document.getElementById('name').value,
        customer_email: document.getElementById('email').value,
        customer_phone: document.getElementById('phone').value,
    };

    fetch('/api/create-payment-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json())
    .then(data => {
        const paymentToken = data.payment_token;

        // Start Cashfree payment
        CashfreeCheckout.init({
            order_token: paymentToken,
            order_amount: price,
            order_currency: 'INR',
            customer_email: orderData.customer_email,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
        }).startPayment();
    })
    .catch(error => {
        console.error('Payment initiation failed:', error);
    });
}
