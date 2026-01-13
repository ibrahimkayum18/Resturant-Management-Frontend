import axios from "axios";
import { useEffect, useState } from "react";

/**
 * AllProducts Component
 * Displays all food products and provides options
 * to update or delete a product
 */
const AllProducts = () => {
  /**
   * State to store all products
   */
  const [products, setProducts] = useState([]);

  /**
   * State to manage loading
   */
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all products from backend
   */
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

  /**
   * Delete a product by ID
   * @param {string} id
   */
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/food-menu/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error.message);
    }
  };

  /**
   * Redirect to update product page
   * @param {string} id
   */
  const handleUpdateProduct = (id) => {
    // You can replace this with navigate() if using react-router
    window.location.href = `/dashboard/update-product/${id}`;
  };

  /**
   * Fetch products when component mounts
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-black">Loading products...</div>;
  }

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-semibold mb-6">All Products</h2>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Image</th>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="border px-4 py-2 font-medium">
                  {product.title}
                </td>

                <td className="border px-4 py-2">
                  {product.category}
                </td>

                <td className="border px-4 py-2">
                  ৳ {product.basePrice}
                </td>

                <td className="border px-4 py-2 capitalize">
                  {product.status}
                </td>

                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleUpdateProduct(product._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;
