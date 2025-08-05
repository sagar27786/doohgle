import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialCarousel = () => {
  const testimonials = [
    // Daisy Anderson-Perrin
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b111c070e32d538f415fc0_Daisy%20Anderson-Perrin.png",
      video:
        "https://www.youtube.com/embed/B5xgB-1vKxQ?rel=0&controls=1&autoplay=0&mute=0&start=0",
      name: "Daisy Anderson-Perrin",
      title: "Head of Ancillary Revenue International at WeWork",
      quote:
        "We have built a solid partnership with Framen over the years, they are incredibly professional and a pleasure to work with. The team is always on hand to support and cannot do enough to ensure our partnership thrives.",
    },
    // Amanda Hosie
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0ff29e08c0ab6e68d9e6a_Amanda%20Hosie.png",
      video:
        "https://www.youtube.com/embed/B5xgB-1vKxQ?rel=0&controls=1&autoplay=0&mute=0&start=0",
      name: "Amanda Hosie",
      title: "Marketing Director",
      quote:
        "The platform is incredibly intuitive and the results speak for themselves.",
    },
    // Natalia Bahancova
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6373ae0cf1749ff22ccefe78_natalia%20bahancovajpeg.jpeg",
      video:
        "https://www.youtube.com/embed/1LxPPbl57nk?rel=0&controls=1&autoplay=0&mute=0&start=0",
      name: "Natalia Bahancova",
      title: "Operations Manager",
      quote:
        "The customer support team is exceptional and always available when we need them.",
    },
    // Sabine Lichtenegger
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6373ae8f10fad0f13f6a6cbf_sabine%20lichtenegger.jpeg",
      video:
        "https://www.youtube.com/embed/_4i3oC5UyJw?rel=0&controls=1&autoplay=0&mute=0&start=0",
      name: "Sabine Lichtenegger",
      title: "Business Development",
      quote:
        "The analytics and reporting features have given us valuable insights into our audience.",
    },
    // Matthias Ernst
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6373aeffa9317e08510c9213_matthias%20ernst.jpeg",
      video:
        "https://www.youtube.com/embed/9rFmwJDpG_8?rel=0&controls=1&autoplay=0&mute=0&start=0",
      name: "Matthias Ernst",
      title: "CEO",
      quote:
        "Framen has been a game-changer for our digital advertising strategy.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Partners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how FRAMEN is transforming digital signage for businesses
            worldwide
          </p>
        </div>

        <div className="relative">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <img
              src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0f1e2d39479f43c7ab7c7_quote-icon.svg"
              alt="Quote"
              className="h-16 w-16 text-gray-400"
            />
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Left Side - Video Only */}
                      <div className="order-2 lg:order-1">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
                          <iframe
                            src={testimonial.video}
                            className="w-full h-96"
                            title={`Testimonial from ${testimonial.name}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>

                      {/* Right Side - Testimonial Text */}
                      <div className="order-1 lg:order-2 text-center lg:text-left">
                        <blockquote className="text-xl text-gray-700 leading-relaxed mb-8">
                          "{testimonial.quote}"
                        </blockquote>

                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {testimonial.name}
                            </h4>
                            <p className="text-gray-600">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevSlide}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-110 transform"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-110 transform"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-purple-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            .slide-in {
              animation: slideIn 0.7s ease-out forwards;
            }
          `,
        }}
      />
    </section>
  );
};

export default TestimonialCarousel;
