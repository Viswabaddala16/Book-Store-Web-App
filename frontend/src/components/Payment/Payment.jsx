import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../CheckoutForm/checkoutForm";

const stripePromise = loadStripe("pk_test_51QkPsQFNPDaRgMWYaVaFkuGKmt0wKq7e3vTidm2mF86NlRflGvsWmqW75FjGHouQDz6jlhRFWLlyvEa9elixXzWJ00YZgniDgp");

const Payment = ({ selectedBooks, totalPrice }) => {
  return (
    <div className="payment-container">
      <h2>Payment Section</h2>
      <div>
        <h3>Selected Books:</h3>
        <ul>
          {selectedBooks.map((book) => (
            <li key={book._id}>
              {book.title} - ${book.price}
            </li>
          ))}
        </ul>
        <h4>Total: ${totalPrice}</h4>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm totalPrice={totalPrice} />
      </Elements>
    </div>
  );
};

export default Payment;