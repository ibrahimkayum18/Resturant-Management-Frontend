import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import useAllProducts from "../hooks/useAllProducts";

const ITEMS_PER_PAGE = 4;

const FeaturedCollection = () => {
  const [loadingId, setLoadingId] = useState(null);

  // ✅ SAFE DEFAULT
  const [allProducts = []] = useAllProducts();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");

  /* -------------------- Categories -------------------- */
  const categories = useMemo(() => {
    const unique = new Set(allProducts.map(p => p.category));
    return ["All", ...unique];
  }, [allProducts]);

  /* -------------------- Filter -------------------- */
  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter(p => p.category === activeCategory);

  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="default-width py-14">
      {/* ---------- Header ---------- */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Featured Food Menu
        </h1>
        <p className="text-gray-500 mt-2">
          Hand-picked dishes crafted with quality ingredients
        </p>
      </div>

      {/* ---------- Navigation Tabs ---------- */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all
              ${
                activeCategory === category
                  ? "bg-black text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ---------- Product Grid ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {paginatedProducts.map(item => (
          <ProductCard
            key={item._id}
            item={item}
            loadingId={loadingId}
            setLoadingId={setLoadingId}
          />
        ))}
      </div>

      {/* ---------- Pagination ---------- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-14">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition
                ${
                  currentPage === num + 1
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedCollection;
