import axios from "axios";
import { useEffect, useState } from "react";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 Status badge (same colors as before)
  const StatusBadge = ({ status }) => {
    const isActive = status === "active";

    return (
      <div className="flex items-center gap-2 capitalize">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isActive ? "bg-green-700" : "bg-red-700"
          }`}
        />
        <span className="text-sm text-black">
          {status || "N/A"}
        </span>
      </div>
    );
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setCustomers(res.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchCustomers();
  };

  const handleRoleChange = async (id, role) => {
    await axios.patch(`http://localhost:5000/users/role/${id}`, { role });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔎 Filter logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" || c.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || c?.activity?.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 text-center font-semibold text-black">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-black max-w-7xl mx-auto ">
      <h2 className="text-3xl font-bold mb-4">
        All Customers
      </h2>

      {/* 🔍 SEARCH + FILTER BAR */}
      <div className="sticky top-0 z-20 bg-gray-50 mb-5">
        <div className="flex flex-wrap md:flex-nowrap gap-3 items-center p-3 border border-gray-200 rounded-xl bg-white">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[140px]"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">
                  {customer.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {customer.email}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={customer.role}
                    onChange={(e) =>
                      handleRoleChange(customer._id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={customer?.activity?.status} />
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {customer?.activity?.lastLogin
                    ? new Date(
                        customer.activity.lastLogin
                      ).toLocaleString()
                    : "Never"}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE COMPACT LIST ================= */}
      <div className="md:hidden bg-white rounded-xl shadow divide-y divide-gray-200">
        {filteredCustomers.map((customer) => (
          <div
            key={customer._id}
            className="p-4 flex justify-between items-center gap-3"
          >
            <div className="min-w-0">
              <p className="font-semibold truncate">
                {customer.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {customer.email}
              </p>
              <StatusBadge status={customer?.activity?.status} />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={customer.role}
                onChange={(e) =>
                  handleRoleChange(customer._id, e.target.value)
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>

              <button
                onClick={() => handleDeleteCustomer(customer._id)}
                className="text-red-600 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCustomers;
