import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTxn, setSearchTxn] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortField, setSortField] = useState("total"); // total or date
  const [sortOrder, setSortOrder] = useState("desc"); // asc or desc

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (searchTxn) {
      data = data.filter((o) =>
        (o.transactionId || "")
          .toLowerCase()
          .includes(searchTxn.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((o) => o.orderStatus === statusFilter);
    }

    if (paymentFilter) {
      data = data.filter((o) => o.paymentStatus === paymentFilter);
    }

    data.sort((a, b) => {
      if (sortField === "total") {
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
      } else if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return data;
  }, [orders, searchTxn, statusFilter, paymentFilter, sortField, sortOrder]);

  const exportToCSV = () => {
    if (!filteredOrders.length) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Order ID",
      "Transaction ID",
      "Customer Name",
      "Customer Email",
      "Total",
      "Payment Status",
      "Order Status",
      "Order Date",
    ];

    const rows = filteredOrders.map((o) => [
      o._id,
      o.transactionId || "",
      o.customerName,
      o.customerEmail,
      o.total.toFixed(2),
      o.paymentStatus,
      o.orderStatus,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "orders.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/orders/${id}`, {
        orderStatus: status,
      });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);
      toast.success("Order deleted");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-4 sm:p-6 text-black max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold">Orders</h2>
        <button
          onClick={exportToCSV}
          className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base hover:bg-gray-700 transition cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search Transaction ID"
            value={searchTxn}
            onChange={(e) => setSearchTxn(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base w-full"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancel">Cancel</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base w-full"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <div className="flex gap-2 w-full">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base flex-1"
            >
              <option value="total">Sort by Total</option>
              <option value="date">Sort by Date</option>
            </select>
            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE for large screens */}
      <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left">Customer</th>
              <th className="px-3 sm:px-4 py-2 text-left">Contact</th>
              <th className="px-3 sm:px-4 py-2 text-left">Total</th>
              <th className="px-3 sm:px-4 py-2 text-left">Payment</th>
              <th className="px-3 sm:px-4 py-2 text-left">Status</th>
              <th className="px-3 sm:px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-3 sm:px-4 py-2">
                  <p className="font-medium truncate">{order.customerName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {order.customerEmail}
                  </p>
                </td>
                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                  <p>{order.phone}</p>
                  <p className="text-gray-500 truncate">{order.city}</p>
                </td>
                <td className="px-3 sm:px-4 py-2 font-medium">
                  ৳ {Number(order.total).toFixed(2)}
                </td>
                <td className="px-3 sm:px-4 py-2 capitalize">
                  <p>{order.paymentMethod}</p>
                  <span
                    className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </td>
                <td className="px-3 sm:px-4 py-2 text-center space-x-1 sm:space-x-3">
                  <Link
                    to={`/dashboard/all_orders/${order._id}`}
                    className="text-blue-600 hover:underline text-xs sm:text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-600 hover:underline text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <p className="font-medium">{order.customerName}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{order.customerEmail}</p>
            <p className="text-xs text-gray-500 mb-1">{order.phone}</p>
            <p className="text-xs text-gray-500 mb-1">{order.city}</p>
            <p className="font-medium mb-1">৳ {Number(order.total).toFixed(2)}</p>
            <div className="flex justify-between mt-2">
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
                className="border border-gray-300 rounded-md px-2 py-1 text-xs w-1/2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancel">Cancel</option>
              </select>
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/all_orders/${order._id}`}
                  className="text-blue-600 hover:underline text-xs"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="py-8 text-center text-gray-500 text-sm sm:text-base">
          No orders found
        </p>
      )}
    </div>
  );
};

export default Orders;
