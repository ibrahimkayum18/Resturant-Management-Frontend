import { Link } from "react-router";
import { use } from "react";
import { AuthContext } from "../Routes/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProductCard = ({ item, loadingId, setLoadingId }) => {
  const { user } = use(AuthContext);
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: (cartItem) => axiosPublic.post("/cart", cartItem),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myCartItems", user.email],
      });
      toast.success("Item added to cart ✅");
    },

    onError: () => {
      toast.error("Failed to add to cart ❌");
    },

    onSettled: () => {
      setLoadingId(null);
    },
  });

  const handleAddToCart = () => {
    setLoadingId(item._id);

    addToCartMutation.mutate({
      productId: item._id,
      title: item.title,
      price: Number(item.basePrice),
      image: item.images?.[0],
      quantity: 1,
      customerEmail: user.email,
      customerName: user.displayName,
      createdAt: new Date(),
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* ---------- Image ---------- */}
      <Link to={`/food-menu/${item._id}`} className="relative block">
        <img
          src={item.images?.[0]}
          alt={item.title}
          className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
          {item.category}
        </span>
      </Link>

      {/* ---------- Content ---------- */}
      <div className="p-5 flex flex-col gap-4">
        <Link to={`/food-menu/${item._id}`}>
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:underline">
            {item.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>

        {/* ---------- Footer ---------- */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-xl font-bold text-green-600">
              ${item.basePrice}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={loadingId === item._id}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all
              ${
                loadingId === item._id
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {loadingId === item._id ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
