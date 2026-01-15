import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER STATES ================= */
  const [searchTxn, setSearchTxn] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FETCH ORDERS ================= */
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

  /* ================= FILTER + SORT ================= */
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

    if (fromDate) {
      data = data.filter(
        (o) => new Date(o.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      data = data.filter(
        (o) => new Date(o.createdAt) <= new Date(toDate)
      );
    }

    data.sort((a, b) =>
      sortOrder === "asc" ? a.total - b.total : b.total - a.total
    );

    return data;
  }, [orders, searchTxn, statusFilter, sortOrder, fromDate, toDate]);

  /* ================= EXPORT CSV ================= */
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

  /* ================= UPDATE STATUS ================= */
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

  /* ================= DELETE ================= */
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
    <div className="p-6 text-black">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 className="text-2xl font-semibold">Orders</h2>

        <button
          onClick={exportToCSV}
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search Transaction ID"
            value={searchTxn}
            onChange={(e) => setSearchTxn(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancel">Cancel</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <button
            onClick={() =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            Sort Total {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {order.customerEmail}
                  </p>
                </td>

                <td className="px-4 py-3 text-xs">
                  <p>{order.phone}</p>
                  <p className="text-gray-500">{order.city}</p>
                </td>

                <td className="px-4 py-3 font-medium">
                  ৳ {Number(order.total).toFixed(2)}
                </td>

                <td className="px-4 py-3 capitalize">
                  <p>{order.paymentMethod}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </td>

                <td className="px-4 py-3 text-center space-x-3">
                  <Link
                    to={`/dashboard/all_orders/${order._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
