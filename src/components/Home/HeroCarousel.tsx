import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title:
        "Back to School, Back to Business - Let's Get Ready for Q4 with FRAMEN",
      buttonText: "Explore Opportunities",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec605ceeeff94d/684052915ba65247c394549b_Kopie%20von%20FRAMEN%20NEWS%20IMAGE%20SIZER%20-%20Creator%20(1)-p-1600.jpg",
      title: "Digital Out of Home Advertising in +32 Countries",
      buttonText: "Start your Campaign",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec605ceeeff94d/687e1babbdc4a3ce1f4e3267_Kopie%20von%20FRAMEN%20NEWS%20IMAGE%20SIZER%20-%20Creator.jpg",
      title: "Transform Your Digital Advertising Strategy",
      buttonText: "Get Started",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec605ceeeff94d/686bf4f1d49ce74649ffae72_Kopie%20von%20FRAMEN%20NEWS%20IMAGE%20SIZER%20-%20Creator%20(2)-p-800.jpg",
      title: "Reach Your Audience Where It Matters",
      buttonText: "Learn More",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative bg-gray-50 py-8">
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      >
        <ChevronLeft className="h-5 w-5 text-purple-600" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      >
        <ChevronRight className="h-5 w-5 text-purple-600" />
      </button>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Central Visual Element */}
          <div className="flex-1 max-w-lg">
            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-purple-200">
              <img
                src={slides[currentSlide].image}
                alt="Business content"
                className="w-full h-56 md:h-72 object-cover"
                style={{
                  border: "1px solid #e9d5ff",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {slides[currentSlide].title}
            </h1>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm">
              <ChevronRight className="h-4 w-4 mr-2" />
              {slides[currentSlide].buttonText}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-gray-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
