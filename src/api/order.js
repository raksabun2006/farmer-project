// src/api/order.js

const BASE_URL = "http://localhost:2829";

// Change 'public' to 'export'
export async function getOrderDetails(orderId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/v1/orders/${orderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch order information details");
    }
    return await response.json();
}

// Change 'public' to 'export'
export async function generateBakongQR(amount, orderId) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/payment/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ orderId: orderId, amount: parseFloat(amount) })
    });
    if (!response.ok) {
        throw new Error("Failed to generate dynamic KHQR payload matrix");
    }
    return await response.json();
}

// Change 'public' to 'export'
export async function verifyBakongPayment(md5Hash) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/payment/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ md5Hash: md5Hash })
    });
    if (!response.ok) {
        throw new Error("Payment validation handshake failed");
    }
    return await response.json();
}