import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const FeaturedCollection = () => {
  const [foodmenus, setFoodMenus] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/food-menu")
      .then((res) => {
        setFoodMenus(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []);

  console.log(foodmenus);

  return (
    <div className="default-width py-10">
      <h1 className="text-3xl font-bold mb-8 text-black">Food Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {foodmenus.map((item) => (
          <ProductCard
            key={item._id}
            item={item}
            loadingId={loadingId}
            setLoadingId={setLoadingId}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollection;
