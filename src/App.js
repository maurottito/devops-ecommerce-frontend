import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    // Empty default: in Kubernetes, calls go to /products and /orders (same-origin),
    // which nginx proxies to the ClusterIP services.
    // In docker-compose, set REACT_APP_PRODUCT_SERVICE_URL and REACT_APP_ORDER_SERVICE_URL
    // as build args to override with the full service URLs.
    const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || '';
    const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || '';

    useEffect(() => {
        // Fetch products
        axios.get(`${PRODUCT_SERVICE_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const [showOrders, setShowOrders] = useState(false);

    const createOrder = (productId) => {
        axios.post(`${ORDER_SERVICE_URL}/orders`, {
            productId: productId,
            quantity: 1
        })
            .then(res => {
                alert('Order created!');
                setOrders(prev => [...prev, res.data]);
            })
            .catch(err => console.error(err));
    };

    const fetchOrders = () => {
        // Ensure products are loaded so we can resolve product names
        const productsFetch = products.length > 0
            ? Promise.resolve(products)
            : axios.get(`${PRODUCT_SERVICE_URL}/products`).then(res => { setProducts(res.data); return res.data; });

        productsFetch.then(prods =>
            axios.get(`${ORDER_SERVICE_URL}/orders`).then(res => {
                const enriched = res.data.map(order => ({
                    ...order,
                    productName: (prods.find(p => p.id === order.product_id) || {}).name || 'Unknown'
                }));
                setOrders(enriched);
                setShowOrders(true);
            })
        ).catch(err => console.error(err));
    };

    return (
        <div style={{fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <h1>E-Commerce Store</h1>
            <nav style={{marginBottom: '20px'}}>
                <button
                    onClick={() => setShowOrders(false)}
                    style={{marginRight: '10px', padding: '8px 16px', cursor: 'pointer'}}
                >
                    Products
                </button>
                <button
                    onClick={fetchOrders}
                    style={{padding: '8px 16px', cursor: 'pointer'}}
                >
                    View Orders
                </button>
            </nav>

            {!showOrders && (
                <>
                    <h2>Products</h2>
                    <div>
                        {products.map(product => (
                            <div key={product.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px'}}>
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <button onClick={() => createOrder(product.id)}>Buy Now</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {showOrders && (
                <>
                    <h2>Orders</h2>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div>
                            {orders.map(order => (
                                <div key={order.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px'}}>
                                    <p><strong>Order ID:</strong> {order.id}</p>
                                    <p><strong>Product:</strong> {order.productName} (ID: {order.product_id})</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;