import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const totalPrice = location.state?.totalPrice || 0;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      alert("Stripe is not loaded. Please try again.");
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/order-confirmation",
      },
    });

    if (error) {
      alert("⚠️ Payment failed: " + error.message);
      setIsProcessing(false);
    } else {
      setPaymentSuccess(true);
      setTransactionId(paymentIntent.id);
      setPaymentDate(new Date().toLocaleString());

      setTimeout(() => {
        navigate("/order-confirmation");
      }, 3000);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-orange-300">
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-md text-center">
        {paymentSuccess ? (
          <div className="text-center">
            <div className="text-green-500 text-6xl">✔</div>
            <h2 className="text-xl font-bold text-green-500 mt-4">Payment Successful</h2>
            <p>Transaction ID: {transactionId}</p>
            <p>Date: {paymentDate}</p>
            <p className="text-gray-600">Paid to: XYZ Book Store</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">💳 Checkout</h1>
            <form onSubmit={handlePayment} className="space-y-4">
              <PaymentElement className="border p-3 rounded w-full" />
              <button className="bg-green-500 text-white px-6 py-3 mt-4 rounded w-full" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay ₹${totalPrice} via Card`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
