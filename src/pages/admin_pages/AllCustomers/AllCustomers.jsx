import { useEffect, useState, useMemo } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // UI states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= STATUS BADGE ================= */
  const StatusBadge = ({ status }) => {
    const isActive = status === "active";
    return (
      <div className="flex items-center gap-2 capitalize">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isActive ? "bg-green-700" : "bg-red-700"
          }`}
        />
        <span className="text-sm">{status || "N/A"}</span>
      </div>
    );
  };

  /* ================= FETCH ================= */
  const fetchCustomers = async () => {
    try {
      const res = await axiosPublic.get("/users");
      setCustomers(res.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* ================= ACTIONS ================= */
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await axiosPublic.delete(`/users/${id}`);
    fetchCustomers();
  };

  const handleRoleChange = async (id, role) => {
    await axiosPublic.patch(`/users/role/${id}`, { role });
    fetchCustomers();
  };

  /* ================= FILTER LOGIC ================= */
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || c.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || c?.activity?.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [customers, search, roleFilter, statusFilter]);

  /* ================= EXPORT CSV ================= */
  const exportToCSV = () => {
    if (!filteredCustomers.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Role",
      "Status",
      "Last Login",
    ];

    const rows = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.role,
      c?.activity?.status || "N/A",
      c?.activity?.lastLogin
        ? new Date(c.activity.lastLogin).toLocaleString()
        : "Never",
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "customers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 text-center font-semibold">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          All Customers
        </h2>

        <button
          onClick={exportToCSV}
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-20 bg-white mb-5">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center p-3 border border-gray-200 rounded-xl">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
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
            {filteredCustomers.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={c.role}
                    onChange={(e) =>
                      handleRoleChange(c._id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c?.activity?.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {c?.activity?.lastLogin
                    ? new Date(c.activity.lastLogin).toLocaleString()
                    : "Never"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteCustomer(c._id)}
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

      {/* MOBILE LIST */}
      <div className="md:hidden bg-white rounded-xl shadow divide-y">
        {filteredCustomers.map((c) => (
          <div key={c._id} className="p-4 flex justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-xs text-gray-500 truncate">{c.email}</p>
              <StatusBadge status={c?.activity?.status} />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={c.role}
                onChange={(e) => handleRoleChange(c._id, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>

              <button
                onClick={() => handleDeleteCustomer(c._id)}
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
