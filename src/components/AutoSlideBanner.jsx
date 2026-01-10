const banners = [
  {
    id: "slide1",
    desktopImage:
      "https://i.ibb.co.com/ym3Hq2kH/Yellow-Orange-and-Red-Gradient-Brush-Stroke-Vegetable-Illustrative-Discount-Pepperoni-Pizza-Facebooo.png",
    mobileImage:
      "https://via.placeholder.com/600x800?text=Mobile+Banner+1",
    // title: "New Collection",
    // subtitle: "Discover the latest trends",
  },
];

const BannerCarousel = () => {
  return (
    <div className="carousel w-full lg:h-[800px] sm:h-[350px] md:h-[450px] lg:h-[520px]">
      {banners.map((banner) => (
        <div
          key={banner.id}
          id={banner.id}
          className="carousel-item relative w-full"
        >
          {/* Desktop Image */}
          <img
            src={banner.desktopImage}
            className="hidden md:block w-full h-full object-cover"
            alt={banner.title}
          />

          {/* Mobile Image (fallback handled) */}
          <img
            src={banner.mobileImage || banner.desktopImage}
            className="block md:hidden w-full h-full object-cover"
            alt={banner.title}
          />

          {/* Overlay */}
          <div className="absolute inset-0  flex flex-col justify-center px-6 md:px-16 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              {banner.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-xl">
              {banner.subtitle}
            </p>
          </div>

          {/* Controls */}
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
            <a href={`#${banner.prev}`} className="btn btn-circle">
              ❮
            </a>
            <a href={`#${banner.next}`} className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerCarousel;
