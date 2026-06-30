const BASE_URL = "http://localhost:2829/api/v1";

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem("token");

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};
const request = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    });

    let data = {};

    const contentType = response.headers.get("content-type");

    try {
        if (contentType?.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();

            data = text
                ? { message: text }
                : {};
        }
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
};


export const loginUser = async (credentials) => {
    return await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
};

export const registerUser = async (userData) => {
    return await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

// ===================== PRODUCTS =====================

export const getAllProducts = async () => {
    return await request("/products", {
        method: "GET",
    });
};

export const addProduct = async (productData) => {
    return await request("/products", {
        method: "POST",
        body: JSON.stringify(productData),
    });
};

export const deleteProduct = async (productId) => {
    return await request(`/products/${productId}`, {
        method: "DELETE",
    });
};