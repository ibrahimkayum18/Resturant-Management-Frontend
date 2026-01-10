import { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "https://via.placeholder.com/1400x500?text=Banner+1",
    title: "New Collection",
    subtitle: "Discover the latest trends",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/1400x500?text=Banner+2",
    title: "Big Sale",
    subtitle: "Up to 50% Off",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/1400x500?text=Banner+3",
    title: "Premium Quality",
    subtitle: "Best products for you",
  },
];

const AutoSlideBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full lg:h-170 sm:h-87.5 md:h-112.5 overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6 md:px-16 text-white">
            <h2 className="text-2xl md:text-5xl font-bold">
              {banner.title}
            </h2>
            <p className="mt-2 text-sm md:text-xl">
              {banner.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AutoSlideBanner;
