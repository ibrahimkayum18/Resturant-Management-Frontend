
import { useState } from "react";
import ProductCard from "./ProductCard";
import useAllProducts from "../hooks/useAllProducts";

const FeaturedCollection = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [allProducts] = useAllProducts()



  return (
    <div className="default-width py-10">
      <h1 className="text-3xl font-bold mb-8 text-black">Food Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProducts.map((item) => (
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
