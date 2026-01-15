import { useLoaderData } from "react-router";
import { useState } from "react";
import axios from "axios";

const OrderDetails = () => {
  const loadedOrder = useLoaderData();
  const [order, setOrder] = useState(loadedOrder);
  const [saving, setSaving] = useState(false);

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = (itemId, type) => {
    const items = order.items.map((item) => {
      if (item._id === itemId) {
        const qty =
          type === "inc"
            ? item.quantity + 1
            : Math.max(1, item.quantity - 1);
        return { ...item, quantity: qty };
      }
      return item;
    });

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    setOrder({
      ...order,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(
        (subtotal + (order.deliveryFee || 0)).toFixed(2)
      ),
    });
  };

  /* ================= SAVE CHANGES ================= */
  const saveOrder = async () => {
    try {
      setSaving(true);
      await axios.patch(
        `http://localhost:5000/orders/${order._id}`,
        {
          items: order.items,
          orderStatus: order.orderStatus,
          subtotal: order.subtotal,
          total: order.total,
        }
      );
      alert("Order updated successfully");
    } catch {
      alert("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-black">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Order Details
        </h2>
        <p className="text-sm text-gray-500">
          Order ID: {order._id}
        </p>
      </div>

      {/* ================= CUSTOMER + ORDER INFO ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* CUSTOMER */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Customer Info</h3>

          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {order.customerName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {order.customerEmail}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {order.phone}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {order.address}, {order.city}
            </p>
          </div>
        </div>

        {/* ORDER META */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold mb-3">Order Info</h3>

          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Order Date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {order.paymentMethod}
            </p>

            <p>
              <span className="font-medium">Transaction ID:</span>{" "}
              {order.transactionId || "N/A"}
            </p>

            <p className="flex items-center gap-2">
              <span className="font-medium">Payment Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <span className="font-medium">Order Status:</span>
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  setOrder({
                    ...order,
                    orderStatus: e.target.value,
                  })
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold">
            Order Items ({order.items.length})
          </h3>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3 flex gap-3 items-center">
                    <img
                      src={item.image}
                      className="w-12 h-12 rounded object-cover"
                      alt=""
                    />
                    <span className="font-medium">
                      {item.title}
                    </span>
                  </td>

                  <td className="px-4 py-3">${item.price}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, "dec")
                        }
                        className="px-2 border rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, "inc")
                        }
                        className="px-2 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST */}
        <div className="md:hidden divide-y">
          {order.items.map((item) => (
            <div key={item._id} className="p-4 flex gap-4">
              <img
                src={item.image}
                className="w-16 h-16 rounded object-cover"
                alt=""
              />

              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  ${item.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, "dec")
                    }
                    className="px-2 border rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id, "inc")
                    }
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold mt-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TOTAL ================= */}
      <div className="mt-6 flex justify-end">
        <div className="w-full sm:w-80 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>${order.subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Delivery Fee</span>
            <span>
              {order.deliveryFee ? `$${order.deliveryFee}` : "Free"}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.total}</span>
          </div>

          <button
            onClick={saveOrder}
            disabled={saving}
            className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
