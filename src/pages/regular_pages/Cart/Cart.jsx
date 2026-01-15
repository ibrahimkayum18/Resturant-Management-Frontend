import { useContext } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../Routes/AuthProvider";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useCartItems from "../../../hooks/useCartItems";

const Cart = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { loading } = useContext(AuthContext);

  const [cartItems, , isLoading] = useCartItems();

  // 🔹 Price formatter
  const formatPrice = (price) => Number(price).toFixed(2);

  /* ================= MUTATIONS ================= */

  // Update quantity
  const updateQuantity = useMutation({
    mutationFn: ({ id, quantity }) =>
      axiosPublic.patch(`/cart/quantity/${id}`, { quantity }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myCartItems"],
      });
    },
  });

  // Remove item
  const removeItem = useMutation({
    mutationFn: (id) =>
      axiosPublic.delete(`/cart/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myCartItems"],
      });
    },
  });

  /* ================= HANDLERS ================= */

  const handleQuantity = (id, quantity) => {
    if (quantity < 1) return;
    updateQuantity.mutate({ id, quantity });
  };

  const handleRemove = (id) => {
    removeItem.mutate(id);
  };

  /* ================= PRICE CALC ================= */

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 120 : 0;
  const total = subtotal + shipping;

  /* ================= LOADING ================= */

  if (loading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold text-center mb-10">
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow text-center py-20">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
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
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      Unit Price: ৳{formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleQuantity(item._id, item.quantity - 1)
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
                            handleQuantity(item._id, item.quantity + 1)
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
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

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

              <Link to="/checkout">
                <button className="mt-6 w-full py-3 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
