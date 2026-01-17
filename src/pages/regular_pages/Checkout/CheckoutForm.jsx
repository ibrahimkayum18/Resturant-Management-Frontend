import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ clientSecret, cartProducts = [], total = 0 }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const card = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
      }
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setSuccess(true);
      console.log("PaymentIntent:", paymentIntent);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-8">
        
        {/* ================= LEFT ================= */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <h1 className="text-2xl font-semibold">Checkout</h1>

          {/* CONTACT */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Contact information</h2>
            <input
              readOnly
              placeholder="customer@email.com"
              className="w-full border rounded-md px-4 py-2 bg-gray-100"
            />
          </div>

          {/* SHIPPING */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Shipping address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="border rounded-md px-4 py-2" placeholder="Full name" />
              <input className="border rounded-md px-4 py-2" placeholder="Phone" />
              <input className="border rounded-md px-4 py-2" placeholder="City" />
              <input className="border rounded-md px-4 py-2" placeholder="Postal code" />
              <input
                className="border rounded-md px-4 py-2 sm:col-span-2"
                placeholder="Address"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Payment</h2>

            <div className="border rounded-md p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#000",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                    },
                    invalid: {
                      color: "#dc2626",
                    },
                  },
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 mt-3">
                Payment successful 🎉
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ৳ ${total}`}
          </button>
        </form>

        {/* ================= RIGHT ================= */}
        <div className="bg-white border rounded-lg p-5 h-fit sticky top-8">
          <h2 className="font-medium mb-4">Order summary</h2>

          <div className="space-y-3 text-sm">
            {cartProducts.map((item) => (
              <div key={item._id} className="flex justify-between gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="h-14 w-14 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p>৳ {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>৳ {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
