import { useLoaderData } from "react-router";
import { use, useState } from "react";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../Routes/AuthProvider";

const ProductPage = () => {

  const {user} = use(AuthContext)
  const product = useLoaderData();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Variant state (dynamic)
  const initialVariants = {};
  product.variants.forEach(v => {
    initialVariants[v.name] = v.options[0];
  });

  const [selectedVariants, setSelectedVariants] = useState(initialVariants);

  const handleVariantChange = (variantName, option) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const addToCartMutation = useMutation({
  mutationFn: (cartItem) =>
    axiosPublic.post("/cart", cartItem),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["myCartItems", user?.email],
    });

    toast.success("Item added to cart");
  },

  onError: () => {
    toast.error("Failed to add to cart");
  },
});

  const handleAddToCart = () => {
  setLoading(true);

  addToCartMutation.mutate(
    {
      productId: product._id,
      title: product.title,
      price: Number(product.basePrice),
      image: selectedImage,
      quantity,
      variants: selectedVariants,
      customerEmail: user.email,
    },
    {
      onSettled: () => setLoading(false),
    }
  );
};


  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-10 text-black">

        {/* LEFT: IMAGE SWATCH */}
        <div className="lg:w-1/2">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full rounded-xl object-cover mb-4"
          />

          {/* Swatch Navigation */}
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Swatch ${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg cursor-pointer border-2 object-cover ${
                  selectedImage === img
                    ? "border-gray-900"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="lg:w-1/2 flex flex-col gap-5">

          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-600 whitespace-pre-line">
            {product.description}
          </p>

          {/* PRICE */}
          <span className="text-2xl font-semibold text-green-600">
            ${Number(product.basePrice).toFixed(2)}
          </span>

          {/* VARIANTS */}
          {product.variants.length > 0 && (
            <div className="flex flex-col gap-4">
              {product.variants.map((variant, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <span className="font-medium">{variant.name}</span>
                  <div className="flex gap-2 flex-wrap">
                    {variant.options.map(option => (
                      <button
                        key={option}
                        onClick={() =>
                          handleVariantChange(variant.name, option)
                        }
                        className={`px-4 py-2 rounded border text-sm ${
                          selectedVariants[variant.name] === option
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QUANTITY */}
          <div className="flex flex-col gap-2 w-32">
            <span className="font-medium">Quantity</span>
            <input
              type="number"
              min="1"
              max={Number(product.quantity)}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded p-2"
            />
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 w-fit"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
