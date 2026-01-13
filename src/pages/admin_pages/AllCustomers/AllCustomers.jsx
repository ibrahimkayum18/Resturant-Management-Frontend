import axios from "axios";
import { useEffect, useState } from "react";

/**
 * AllCustomers Component
 * Responsible for fetching, displaying, updating roles,
 * and deleting customers from the system
 */
const AllCustomers = () => {
  /**
   * State to store all customers
   */
  const [customers, setCustomers] = useState([]);

  /**
   * State to manage loading status
   */
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all customers from backend
   */
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

  /**
   * Delete a customer by ID
   */
  const handleDeleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };

  /**
   * Update customer role
   * @param {string} id
   * @param {string} role
   */
  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(`http://localhost:5000/users/role/${id}`, {
        role,
      });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  /**
   * Load customers when component mounts
   */
  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-black p-6">Loading customers...</div>;
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-semibold mb-6">All Customers</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Role</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Last Login</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{customer.name}</td>
                <td className="border px-4 py-2">{customer.email}</td>

                <td className="border px-4 py-2">
                  <select
                    value={customer.role}
                    onChange={(e) =>
                      handleRoleChange(customer._id, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                  </select>
                </td>

                <td className="border px-4 py-2 capitalize">
                  {customer?.activity?.status || "N/A"}
                </td>

                <td className="border px-4 py-2">
                  {customer?.activity?.lastLogin
                    ? new Date(
                        customer.activity.lastLogin
                      ).toLocaleString()
                    : "Never"}
                </td>

                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCustomers;
