const BASE_URL = "http://localhost:2829/api/payment";

/**
 * Sends a request to the Spring Boot backend to verify the Bakong payment status using md5Hash.
 * @param {string} md5Hash - The 32-character MD5 transaction hash.
 * @returns {Promise<Object>} The response data from the backend.
 */
export const verifyPaymentStatus = async (md5Hash) => {
  try {
    const response = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Your app's user login JWT token
      },
      body: JSON.stringify({ md5Hash: md5Hash })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment with backend:", error);
    throw error;
  }
};