import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm/CheckoutForm";

const stripePromise = loadStripe("pk_test_51QkPsQFNPDaRgMWYaVaFkuGKmt0wKq7e3vTidm2mF86NlRflGvsWmqW75FjGHouQDz6jlhRFWLlyvEa9elixXzWJ00YZgniDgp");

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch CSRF token first
    axios.get("https://book-store-web-app-backend.onrender.com/api/get-csrf-token", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  useEffect(() => {
    if (csrfToken) {
      axios.post(
        "http://localhost:5555/api/create-payment-intent",
        { amount: 5000, csrfToken },
        { withCredentials: true } // Ensures session is included
      )
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => console.error("Error fetching clientSecret:", error));
    }
  }, [csrfToken]);

  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment options...</p>
      )}
    </div>
  );
};

export default CheckoutPage;
