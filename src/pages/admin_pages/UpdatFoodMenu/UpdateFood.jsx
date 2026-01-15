import axios from "axios";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

const UpdateFood = () => {
  const loadedProduct = useLoaderData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Normalize variants & options (important)
  const normalizedVariants =
    loadedProduct?.variants?.map((v) => ({
      ...v,
      options: v.options || [],
    })) || [];

  const [product, setProduct] = useState({
    title: loadedProduct?.title || "",
    description: loadedProduct?.description || "",
    category: loadedProduct?.category || "",
    status: loadedProduct?.status || "active",
    basePrice: loadedProduct?.basePrice || "",
    quantity: loadedProduct?.quantity || "",
    images: loadedProduct?.images || [],
    variants: normalizedVariants,
  });

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=977d2b4ec68efb0cae335aadb2dba480",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      return data?.data?.url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleImageUpload = async (e, vIndex = null, oIndex = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const uploaded = await Promise.all(files.map(uploadImage));
    const validImages = uploaded.filter(Boolean);

    if (vIndex === null) {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...validImages],
      }));
    } else {
      const newVariants = [...product.variants];
      newVariants[vIndex].options[oIndex].images.push(...validImages);
      setProduct({ ...product, variants: newVariants });
    }

    setLoading(false);
  };

  const removeImage = (index, vIndex = null, oIndex = null) => {
    if (vIndex === null) {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      const newVariants = [...product.variants];
      newVariants[vIndex].options[oIndex].images =
        newVariants[vIndex].options[oIndex].images.filter(
          (_, i) => i !== index
        );
      setProduct({ ...product, variants: newVariants });
    }
  };

  /* ================= VARIANTS ================= */
  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", options: [] }],
    }));
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  /* ================= OPTIONS ================= */
  const addOption = (variantIndex) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].options.push({
      name: "",
      price: "",
      quantity: "",
      sku: "",
      weight: "",
      images: [],
    });
    setProduct({ ...product, variants: newVariants });
  };

  const removeOption = (variantIndex, optionIndex) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].options =
      newVariants[variantIndex].options.filter(
        (_, i) => i !== optionIndex
      );
    setProduct({ ...product, variants: newVariants });
  };

  const updateOption = (variantIndex, optionIndex, field, value) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].options[optionIndex][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title.trim()) return toast.error("Title is required");
    if (product.images.length === 0)
      return toast.error("Upload at least one image");

    try {
      setLoading(true);
      await axios.patch(
        `http://localhost:5000/update/${loadedProduct._id}`,
        product
      );
      toast.success("Product updated successfully");
      navigate(-1);
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-black">
      <h1 className="text-2xl font-semibold mb-6">Update Product</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* INFO */}
          <div className="bg-white rounded-xl shadow p-6">
            <label className="block font-medium mb-2">Title</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
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
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          {/* IMAGES */}
          <div className="bg-white rounded-xl shadow p-6">
            <input type="file" multiple onChange={handleImageUpload} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    className="h-28 w-full object-cover rounded-lg"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VARIANTS */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Variants</h2>
              <button type="button" onClick={addVariant} className="underline">
                Add Variant
              </button>
            </div>

            {product.variants.map((variant, vIndex) => (
              <div key={vIndex} className="border p-4 rounded mb-4">
                <div className="flex gap-2 mb-3">
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    placeholder="Variant name"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(vIndex, "name", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(vIndex)}
                    className="border px-3 rounded text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {variant.options.map((option, oIndex) => (
                  <div key={oIndex} className="border p-3 rounded mb-3">
                    <div className="flex justify-between mb-2">
                      <input
                        className="border rounded px-3 py-2 flex-1 mr-2"
                        placeholder="Option name"
                        value={option.name}
                        onChange={(e) =>
                          updateOption(vIndex, oIndex, "name", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(vIndex, oIndex)}
                        className="text-red-600 border px-3 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(vIndex)}
                  className="underline text-sm"
                >
                  Add Option
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <label>Status</label>
            <select
              className="w-full border rounded px-4 py-2"
              value={product.status}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <label>Category</label>
            <input
              className="w-full border rounded px-4 py-2"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFood;
