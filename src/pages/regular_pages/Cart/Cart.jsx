import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Routes/AuthProvider";

const Cart = () => {
  const { user, loading } = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);

  // 🔹 Price formatter (2 decimal places)
  const formatPrice = (price) => Number(price).toFixed(2);

  // 🔹 Fetch cart products
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/cart?email=${user.email}`)
        .then((res) => setCartProducts(res.data))
        .catch((err) => console.error(err.message));
    }
  }, [user]);

  // 🔹 Update quantity
  const handleQuantity = (id, quantity) => {
    if (quantity < 1) return;

    axios.patch(`http://localhost:5000/cart/quantity/${id}`, { quantity });

    setCartProducts((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // 🔹 Remove item
  const handleRemove = (id) => {
    axios.delete(`http://localhost:5000/cart/${id}`);
    setCartProducts((prev) => prev.filter((i) => i._id !== id));
  };

  // 🔹 Price calculations
  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 120 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold text-center mb-10">
          Shopping Cart
        </h2>

        {cartProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow text-center py-20">
            <p className="text-gray-500 text-lg">
              Your cart is empty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-28 h-28 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Unit Price: ৳{formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleQuantity(
                              item._id,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          −
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantity(
                              item._id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="font-bold text-lg self-center">
                    ৳{formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow sticky top-24 h-fit">
              <h3 className="text-xl font-bold mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳{formatPrice(shipping)}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold text-black">
                  <span>Total</span>
                  <span>৳{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => alert("Proceeding to checkout")}
                className="mt-6 w-full py-3 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
