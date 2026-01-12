const About = () => {
  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Bengal Spicy Food
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          Bringing the authentic taste of Bengal to your table with bold spices,
          traditional recipes, and unforgettable flavors.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Content */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bengal Spicy Food was born from a deep love for authentic Bengali
            cuisine. Our journey began with a simple mission: to preserve and
            share the rich culinary heritage of Bengal through carefully crafted
            dishes made with traditional spices and time-honored cooking
            methods.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every recipe we serve is inspired by home-style cooking, where
            flavor, freshness, and passion come together to create meals that
            feel both comforting and exciting.
          </p>
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What Makes Us Different
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>🌶 Authentic Bengali spices and flavors</li>
            <li>🍛 Traditional recipes passed through generations</li>
            <li>🥘 Fresh ingredients and hygienic preparation</li>
            <li>❤️ Passion for quality and customer satisfaction</li>
          </ul>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to deliver bold, authentic, and soulful Bengali food
            that connects people through taste. We aim to bring the warmth of
            Bengal’s kitchens to food lovers everywhere, ensuring every bite
            tells a story of tradition and care.
          </p>
        </div>
      </div>

      {/* Closing Section */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Taste the Tradition
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At Bengal Spicy Food, we believe great food brings people together.
          Thank you for being part of our journey — we look forward to serving
          you unforgettable flavors inspired by Bengal.
        </p>
      </div>
    </section>
  );
};

export default About;
