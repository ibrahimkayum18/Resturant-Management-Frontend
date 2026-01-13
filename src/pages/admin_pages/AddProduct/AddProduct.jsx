import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProduct() {
  /**
   * Controls global loading state
   * Used during image upload and form submission
   */
  const [loading, setLoading] = useState(false);

  /**
   * Main product state
   * Holds all product-related data before submission
   */
  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    status: "active",
    basePrice: "",
    images: [],
    variants: [],
  });

  /**
   * Uploads a single image file to imgbb
   * Returns hosted image URL if successful
   * Handles upload errors gracefully
   */
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=977d2b4ec68efb0cae335aadb2dba480",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.data.url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  /**
   * Handles multiple image selection from file input
   * Uploads images in parallel and stores URLs in state
   */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);

    const uploadedImages = await Promise.all(
      files.map((file) => uploadImage(file))
    );

    // Remove failed uploads
    const validImages = uploadedImages.filter(Boolean);

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));

    setLoading(false);
  };

  /**
   * Removes an uploaded image from the product state
   * Does not affect the hosted image on imgbb
   */
  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /**
   * Adds a new empty variant entry
   * Used for products with multiple sizes/options
   */
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "", quantity: "" }],
    }));
  };

  /**
   * Updates a specific field of a variant
   * Allows controlled inputs for variant data
   */
  const updateVariant = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][field] = value;

    setProduct({
      ...product,
      variants: updatedVariants,
    });
  };

  /**
   * Removes a variant from the product
   * Automatically reindexes remaining variants
   */
  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  /**
   * Handles form submission
   * Performs validation, sends data to backend,
   * shows success/error notifications, and resets form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!product.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (product.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (
      product.variants.length === 0 &&
      (!product.basePrice || product.basePrice <= 0)
    ) {
      toast.error("Price is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/food-menu", product);

      toast.success("Product uploaded successfully");

      // Reset form after successful submission
      setProduct({
        title: "",
        description: "",
        category: "",
        status: "active",
        basePrice: "",
        images: [],
        variants: [],
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-black">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* PRODUCT INFO */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Chicken Burger"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />

            <label className="block font-medium mt-4 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Describe your food item"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* IMAGES */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-3">Images</label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full"
            />

            {loading && (
              <p className="text-sm mt-2">Uploading...</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {product.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="h-28 w-full object-cover rounded-lg border"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VARIANTS */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm underline"
              >
                Add Variant
              </button>
            </div>

            {product.variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3"
              >
                <input
                  placeholder="Variant name"
                  className="border rounded-lg px-3 py-2"
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(index, "name", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  className="border rounded-lg px-3 py-2"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                />

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="border rounded-lg px-3 py-2 w-full"
                    value={variant.quantity}
                    onChange={(e) =>
                      updateVariant(index, "quantity", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="px-3 border rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-2">Status</label>
            <select
              className="w-full border rounded-lg px-4 py-2"
              value={product.status}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-2">Category</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Burgers"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />
          </div>

          {product.variants.length === 0 && (
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <label className="block font-medium mb-2">Price</label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Price"
                value={product.basePrice}
                onChange={(e) =>
                  setProduct({ ...product, basePrice: e.target.value })
                }
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
