import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../../api/axiosConfig';

const Cart = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // ✅ Add default quantity if missing
  const cart = Array.isArray(state?.cart) 
    ? state.cart.map(item => ({
        ...item,
        quantity: item.quantity ?? 1, // Default to 1
      })) 
    : [];
  
  // ✅ Correct total price calculation
  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1; 
    return sum + price * quantity;
  }, 0);

  const [sessionActive, setSessionActive] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");

  const checkSession = async () => {
    try {
      const response = await axios.get("/check-session", { withCredentials: true });
      if (!response.data.authenticated) {
        alert("⚠️ Session expired. Redirecting to login...");
        setSessionActive(false);
        navigate("/login");
      } else {
        setSessionActive(true);
      }
    } catch (error) {
      console.error("⚠️ Session check failed:", error.message);
      navigate("/login");
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get("/get-csrf-token", { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error("⚠️ Failed to fetch CSRF token:", error.message);
    }
  };

  const goToCheckout = () => {
    if (!sessionActive) {
      alert("⚠️ Session expired. Please log in again.");
      navigate("/login");
      return;
    }
    if (!csrfToken) {
      alert("⚠️ CSRF Token not available. Please try again.");
      return;
    }
    navigate("/checkout", {
      state: {
        cart,
        totalPrice,
        csrfToken,
      },
    });
  };

  useEffect(() => {
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (sessionActive) {
      fetchCsrfToken();
    }
  }, [sessionActive]);

  useEffect(() => {
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center bg-orange-400 min-h-screen w-full">
      <div className="p-4 w-full sm:w-1/2 md:w-1/3 h-1/2 mt-16 text-center bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        {cart.length > 0 ? (
          <div>
            {console.log("Cart items", cart)}
            <ul>
              {cart.map((item, index) => (
                <li
                  key={item._id || index}
                  className="flex justify-between border-b-2 py-2"
                >
                  <span>{item.title}</span>
                  <span>${item.price} x {item.quantity}</span>
                </li>
              ))}
            </ul>
            <h2 className="text-xl flex justify-between font-semibold mt-4">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </h2>
            <button
              onClick={goToCheckout}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 mt-4 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : (
          <p className="text-gray-500">🛍️ Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
