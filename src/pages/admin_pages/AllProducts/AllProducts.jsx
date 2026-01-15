import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/food-menu");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await axios.delete(`http://localhost:5000/food-menu/${id}`);
    fetchProducts();
  };

  // const handleUpdateProduct = (id) => {
  //   window.location.href = `/dashboard/update-product/${id}`;
  // };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔴🟢 Status badge
  const StatusBadge = ({ status }) => {
    const isAvailable = status === "available";

    return (
      <div className="flex items-center gap-2 capitalize">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isAvailable ? "bg-green-700" : "bg-red-700"
          }`}
        />
        <span className="text-sm">{status || "N/A"}</span>
      </div>
    );
  };

  // 🔍 Filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) {
    return (
      <div className="p-6 text-center font-semibold">Loading products...</div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto text-slate-800">
      <h2 className="text-3xl font-bold mb-4 ">All Products</h2>

      {/* 🔍 SEARCH + FILTER BAR */}
      <div className="sticky top-0 z-20 bg-white mb-5">
        <div className="flex flex-wrap md:flex-nowrap gap-3 items-center p-3 border border-gray-300 rounded-xl shadow-sm">
          {/* Search */}
          <input
            type="text"
            placeholder="Search food by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none  "
          />

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[150px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t hover:bg-orange-50/40">
                <td className="px-4 py-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </td>

                <td className="px-4 py-3 font-semibold">{product.title}</td>

                <td className="px-4 py-3">{product.category}</td>

                <td className="px-4 py-3 font-medium">
                  ৳ {Number(product.basePrice).toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>

                <td className="px-4 py-3 text-center space-x-2">
                  <Link to={`/dashboard/update/${product._id}`}>
                    <button
                      // onClick={() => handleUpdateProduct(product._id)}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 cursor-pointer"
                    >
                      Update
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE LIST ================= */}
      <div className="md:hidden bg-white rounded-xl shadow divide-y">
        {filteredProducts.map((product) => (
          <div key={product._id} className="p-4 flex gap-4 items-center">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-16 h-16 rounded-lg object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{product.title}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="font-medium">
                ৳ {Number(product.basePrice).toFixed(2)}
              </p>
              <StatusBadge status={product.status} />
            </div>

            <div className="flex flex-col gap-2">
              <Link to={`/dashboard/update/${product._id}`}>
                <button className="bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600 cursor-pointer">
                  Update
                </button>
              </Link>

              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="text-red-600 text-sm font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="p-6 text-center text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
