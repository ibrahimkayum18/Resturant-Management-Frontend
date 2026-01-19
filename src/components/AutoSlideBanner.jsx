import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    desktopImage: "https://cdn.shopify.com/s/files/1/0778/1797/0918/files/Untitled_design_98.png?v=1766597248",
    mobileImage: "https://cdn.shopify.com/s/files/1/0778/1797/0918/files/Untitled_design_98.png?v=1766597248",
    title: "Grow Your Business",
    subtitle: "Modern solutions for modern brands",
  },
  {
    id: 2,
    desktopImage: "https://cdn.shopify.com/s/files/1/0778/1797/0918/files/Untitled_design_99.png?v=1766598107",
    mobileImage: "https://cdn.shopify.com/s/files/1/0778/1797/0918/files/Untitled_design_99.png?v=1766598107",
    title: "Smart Digital Experience",
    subtitle: "Designed for performance and conversion",
  }
];

const AutoSlideBanner = () => {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-[70vh] md:h-[85vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Desktop Image */}
              <img
                src={slide.desktopImage}
                alt={slide.title}
                className="hidden md:block w-full h-full object-cover"
              />

              {/* Mobile Image */}
              <img
                src={slide.mobileImage}
                alt={slide.title}
                className="block md:hidden w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg opacity-90">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AutoSlideBanner;
