import axios from "axios";
import { Link } from "react-router";

const ProductCard = ({item, loadingId, setLoadingId}) => {

    console.log(item.title)

  const handleAddToCart = async () => {
  try {
    setLoadingId(item._id);

    await axios.post("http://localhost:5000/cart", {
      productId: item._id,
      title: item.title,
      price: Number(item.basePrice),
      image: item.images?.[0],
      quantity: 1,
    });

    alert("Item added to cart ✅");
  } catch (error) {
    console.error(error);
    alert("Failed to add to cart ❌");
  } finally {
    setLoadingId(null);
  }
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
