import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic()

  const [product, setProduct] = useState({
    title: "",
    description: "",
    category: "",
    status: "active",
    basePrice: "",
    quantity: "", // Quantity for single product
    images: [],
    variants: [], // Array of variants
  });

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=977d2b4ec68efb0cae335aadb2dba480",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      return data.data.url;
    } catch (error) {
      toast.error("Image upload failed",error.message);
      return null;
    }
  };

  const handleImageUpload = async (e, variantIndex = null, optionIndex = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const uploadedImages = await Promise.all(files.map((file) => uploadImage(file)));
    const validImages = uploadedImages.filter(Boolean);

    if (variantIndex === null) {
      // Single product images
      setProduct((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
    } else if (optionIndex !== null) {
      // Variant option images
      const newVariants = [...product.variants];
      newVariants[variantIndex].options[optionIndex].images.push(...validImages);
      setProduct((prev) => ({ ...prev, variants: newVariants }));
    }

    setLoading(false);
  };

  const removeImage = (index, variantIndex = null, optionIndex = null) => {
    if (variantIndex === null) {
      setProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    } else if (optionIndex !== null) {
      const newVariants = [...product.variants];
      newVariants[variantIndex].options[optionIndex].images = newVariants[variantIndex].options[optionIndex].images.filter((_, i) => i !== index);
      setProduct({ ...product, variants: newVariants });
    }
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", options: [] } // Each variant has multiple options
      ]
    }));
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...product.variants];
    newVariants[index][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

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
    newVariants[variantIndex].options = newVariants[variantIndex].options.filter((_, i) => i !== optionIndex);
    setProduct({ ...product, variants: newVariants });
  };

  const updateOption = (variantIndex, optionIndex, field, value) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].options[optionIndex][field] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title.trim()) return toast.error("Title is required");
    if (product.images.length === 0) return toast.error("Upload at least one image");
    if (product.variants.length === 0 && (!product.basePrice || product.basePrice <= 0)) return toast.error("Price is required");

    try {
      setLoading(true);
      await axiosPublic.post("/food-menu", product);
      toast.success("Product uploaded successfully");

      setProduct({
        title: "",
        description: "",
        category: "",
        status: "active",
        basePrice: "",
        quantity: "",
        images: [],
        variants: [],
      });
    } catch (err) {
      toast.error("Something went wrong", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-black">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
            />
            <label className="block font-medium mt-4 mb-2">Description</label>
            <textarea
              rows="4"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Describe your food item"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>

          {/* IMAGES */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-3">Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            {loading && <p className="text-sm mt-2">Uploading...</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {product.images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} className="h-28 w-full object-cover rounded-lg border" alt="" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
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
              <button type="button" onClick={addVariant} className="text-sm underline">Add Variant</button>
            </div>

            {product.variants.map((variant, vIndex) => (
              <div key={vIndex} className="border p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    placeholder="Variant name (e.g., Color)"
                    className="border rounded-lg px-3 py-2 flex-1 mr-2"
                    value={variant.name}
                    onChange={(e) => updateVariant(vIndex, "name", e.target.value)}
                  />
                  <button type="button" onClick={() => removeVariant(vIndex)} className="px-3 py-1 border rounded">Remove</button>
                </div>

                {/* Variant Options */}
                {variant.options.map((option, oIndex) => (
                  <div key={oIndex} className="border p-3 rounded-lg mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <input
                        placeholder="Option name (e.g., Red)"
                        className="border rounded-lg px-3 py-2 flex-1 mr-2"
                        value={option.name}
                        onChange={(e) => updateOption(vIndex, oIndex, "name", e.target.value)}
                      />
                      <button type="button" onClick={() => removeOption(vIndex, oIndex)} className="px-2 py-1 border rounded">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Price"
                        className="border rounded-lg px-2 py-1"
                        value={option.price}
                        onChange={(e) => updateOption(vIndex, oIndex, "price", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="border rounded-lg px-2 py-1"
                        value={option.quantity}
                        onChange={(e) => updateOption(vIndex, oIndex, "quantity", e.target.value)}
                      />
                      <input
                        placeholder="SKU"
                        className="border rounded-lg px-2 py-1"
                        value={option.sku}
                        onChange={(e) => updateOption(vIndex, oIndex, "sku", e.target.value)}
                      />
                      <input
                        placeholder="Weight"
                        className="border rounded-lg px-2 py-1"
                        value={option.weight}
                        onChange={(e) => updateOption(vIndex, oIndex, "weight", e.target.value)}
                      />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="border rounded-lg px-2 py-1"
                        onChange={(e) => handleImageUpload(e, vIndex, oIndex)}
                      />
                    </div>

                    {/* Option Images */}
                    <div className="flex gap-2 mt-2">
                      {option.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} className="h-20 w-20 object-cover rounded" alt="" />
                          <button type="button" onClick={() => removeImage(i, vIndex, oIndex)} className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => addOption(vIndex)} className="text-sm underline mb-2">Add Option</button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-2">Status</label>
            <select className="w-full border rounded-lg px-4 py-2" value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <label className="block font-medium mb-2">Category</label>
            <input className="w-full border rounded-lg px-4 py-2" placeholder="Burgers" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </div>

          {product.variants.length === 0 && (
            <>
              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <label className="block font-medium mb-2">Price</label>
                <input type="number" className="w-full border rounded-lg px-4 py-2" placeholder="Price" value={product.basePrice} onChange={(e) => setProduct({ ...product, basePrice: e.target.value })} />
              </div>
              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <label className="block font-medium mb-2">Quantity</label>
                <input type="number" className="w-full border rounded-lg px-4 py-2" placeholder="Quantity" value={product.quantity} onChange={(e) => setProduct({ ...product, quantity: e.target.value })} />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-60">{loading ? "Saving..." : "Save Product"}</button>
        </div>
      </form>
    </div>
  );
}
