import { use, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../../Routes/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  const { user } = use(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    email: user?.email || "",
    name: user?.displayName || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/cart?email=${user.email}`)
        .then((res) => setCartProducts(res.data))
        .catch(() => toast.error("Failed to load cart"));
    }
  }, [user]);

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () =>
      cartProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cartProducts]
  );

  const shipping = subtotal ? 60 : 0;
  const total = subtotal + shipping;
  const price = (n) => Number(n).toFixed(2);

  /* ================= SUBMIT ================= */
  const handleCheckout = async () => {
    if (!form.phone || !form.address || !form.city) {
      return toast.error("Please complete shipping details");
    }

    if (
      !form.cardNumber ||
      !form.expiry ||
      !form.cvv ||
      !form.cardName
    ) {
      return toast.error("Enter valid card details");
    }

    try {
      setProcessing(true);

      const order = {
        customerEmail: form.email,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        paymentMethod: "card",
        items: cartProducts,
        subtotal,
        shipping,
        total,
      };

      await axios.post("http://localhost:5000/checkout", order);

      toast.success("Order placed successfully");
      setCartProducts([]);
    } catch {
      toast.error("Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-8">
        {/* ================= LEFT ================= */}
        <div className="space-y-8">
          <h1 className="text-2xl font-semibold">Checkout</h1>

          {/* CONTACT */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Contact information</h2>
            <input
              value={form.email}
              readOnly
              className="w-full border rounded-md px-4 py-2 bg-gray-100"
            />
          </div>

          {/* SHIPPING */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Shipping address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Full name"
                className="border rounded-md px-4 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="border rounded-md px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
              <input
                placeholder="City"
                className="border rounded-md px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
              <input
                placeholder="Postal code"
                className="border rounded-md px-4 py-2"
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
              <input
                placeholder="Address"
                className="border rounded-md px-4 py-2 sm:col-span-2"
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-medium mb-4">Payment</h2>

            <div className="border rounded-md p-4 space-y-4">
              <input
                placeholder="Card number"
                className="border rounded-md px-4 py-2 w-full"
                onChange={(e) =>
                  setForm({ ...form, cardNumber: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="MM / YY"
                  className="border rounded-md px-4 py-2"
                  onChange={(e) =>
                    setForm({ ...form, expiry: e.target.value })
                  }
                />
                <input
                  placeholder="CVV"
                  className="border rounded-md px-4 py-2"
                  onChange={(e) =>
                    setForm({ ...form, cvv: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Name on card"
                className="border rounded-md px-4 py-2 w-full"
                onChange={(e) =>
                  setForm({ ...form, cardName: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50"
          >
            {processing ? "Processing..." : `Pay ৳ ${price(total)}`}
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white border rounded-lg p-5 h-fit sticky top-8">
          <h2 className="font-medium mb-4">Order summary</h2>

          <div className="space-y-3 text-sm">
            {cartProducts.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start gap-3"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-14 w-14 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p>৳ {price(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {price(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>৳ {price(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>৳ {price(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
