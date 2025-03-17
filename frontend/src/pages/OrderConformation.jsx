import { useSearchParams, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("redirect_status");
  const navigate = useNavigate();

  // Mock transaction details (Replace with real data from backend)
  const transactionDetails = {
    companyName: "Book Haven Store",
    paidTo: "John Doe",
    amount: "$49.99",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    transactionId: "TXN1234567890"
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        {paymentStatus === "succeeded" ? (
          <>
            <h1 className="text-green-600 text-2xl font-bold">✅ Payment Successful!</h1>
            <p className="text-gray-700 mt-2">
              Thank you for your order at <b>{transactionDetails.companyName}</b>.
            </p>

            {/* Transaction Details */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left shadow-sm">
              <p><b>Paid To:</b> {transactionDetails.paidTo}</p>
              <p><b>Amount:</b> {transactionDetails.amount}</p>
              <p><b>Date:</b> {transactionDetails.date}</p>
              <p><b>Time:</b> {transactionDetails.time}</p>
              <p><b>Transaction ID:</b> {transactionDetails.transactionId}</p>
            </div>

            {/* Success Icon */}
            <div className="text-5xl mt-4">💳</div>
          </>
        ) : (
          <>
            <h1 className="text-red-600 text-2xl font-bold">❌ Payment Failed</h1>
            <p className="text-gray-700 mt-2">Please try again or use a different payment method.</p>
          </>
        )}

        {/* Main Menu Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-300"
        >
          🏠 Main Menu
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
