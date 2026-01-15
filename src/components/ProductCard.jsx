
import { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../Routes/AuthProvider";
import toast from "react-hot-toast";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProductCard = ({item, loadingId, setLoadingId}) => {

  const {user} = use(AuthContext);
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient()

  const addToCartMutation = useMutation({
  mutationFn: (cartItem) =>
    axiosPublic.post("/cart", cartItem),

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
    <div
      key={item._id}
      className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
    >
      <Link to={`/food-menu/${item._id}`}>
      {/* Image */}
      <img
        src={item.images?.[0]}
        alt={item.title}
        className=" w-full object-cover"
      />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col h-full">
        <Link to={`/food-menu/${item._id}`}>
          <h2 className="text-xl text-black font-semibold mb-2">{item.title}</h2>
        </Link>
        

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            ${item.basePrice}
          </span>

          <button
            onClick={() => handleAddToCart(item)}
            disabled={loadingId === item._id}
            className="btn btn-primary"
          >
            {loadingId === item._id ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
