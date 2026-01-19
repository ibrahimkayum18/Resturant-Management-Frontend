import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMemo, useState, use } from "react";
import { AuthContext } from "../../../Routes/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const CheckoutForm = ({ clientSecret, cartProducts = [] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = use(AuthContext);
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [shipping, setShipping] = useState({
    name: user?.displayName || "",
    phone: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const total = useMemo(() => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [cartProducts]);

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
          billing_details: {
            email: user?.email,
            name: shipping.name,
          },
        },
      },
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const orderData = {
        customerEmail: user.email,
        customerName: user.displayName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,

        paymentMethod: "card",
        transactionId: paymentIntent.id,

        items: cartProducts.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        subtotal: total,
        deliveryFee: 0,
        total: total,
      };

      try {
        const res = await axiosPublic.post("/checkout", orderData);

        if (res.data.success) {
          setSuccess(true);
          console.log("Order saved:", res.data.orderId);
        }
      } catch (err) {
        console.error("Order save failed:", err);
        setError("Payment succeeded but order save failed.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-semibold">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-8">
        {/* ORDER SUMMARY */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 h-fit sticky top-8 order-1 lg:order-2">
          <h2 className="font-medium mb-4">Order summary</h2>

          <div className="space-y-3 text-sm">
            {cartProducts.map((item) => (
              <div key={item._id} className="flex justify-between gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="h-14 w-14 rounded-md object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>৳ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>৳ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* CHECKOUT FORM */}
        <form onSubmit={handleSubmit} className="space-y-8 order-2 lg:order-1">
          {/* CONTACT */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-medium mb-4">Contact information</h2>
            <input
              value={user?.email || ""}
              readOnly
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
            />
          </div>

          {/* SHIPPING */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-medium mb-4">Shipping address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Full name"
                value={shipping.name}
                onChange={(e) =>
                  setShipping({ ...shipping, name: e.target.value })
                }
                className="border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                placeholder="Phone"
                onChange={(e) =>
                  setShipping({ ...shipping, phone: e.target.value })
                }
                className="border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                placeholder="City"
                onChange={(e) =>
                  setShipping({ ...shipping, city: e.target.value })
                }
                className="border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                placeholder="Postal code"
                onChange={(e) =>
                  setShipping({ ...shipping, postalCode: e.target.value })
                }
                className="border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                placeholder="Address"
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
                className="border border-gray-300 rounded-md px-4 py-2 sm:col-span-2"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-medium mb-4">Payment</h2>

            <div className="border border-gray-300 rounded-md p-4">
              <CardElement />
            </div>

            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

            {success && (
              <p className="text-sm text-green-600 mt-3">
                Payment successful 🎉
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!stripe || loading || cartProducts.length === 0}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ৳ ${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
