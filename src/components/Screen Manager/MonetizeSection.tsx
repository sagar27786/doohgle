import React from "react";

const MonetizeSection = () => {
  const connectionMethods = [
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b64f6480c184325a03e79d_Framen-smart-tv.jpg",
      title: "Smart TV",
      description:
        "The FRAMEN Screen Manager is available for Android TV and Fire OS App Markets. If you have screens running these OS just download the app and you are good to go.",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b65187bcfbf52a02f35d19_framen-tv-sticks.jpg",
      title: "Streaming Sticks",
      description:
        "No Smart TV? No problem. Using an Android, Fire OS or Google Chromecast streaming stick will allow you to download our app.",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6373dd0309bc31325e8397af_framen%20tv%20box.jpg",
      title: "FRAMEN TV Box",
      description:
        "FRAMEN also provides a Ready-to-Go content management solution. This is the best universal way to connect. Contact us to get details on technical requirements.",
    },
    {
      image:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6373ce6094061ea6126e94de_api.png",
      title: "Via API / CMS",
      description:
        "We offers different solutions to be connected to your existing CMS or Digital Signage system, via Lite URL, API or VAST Tag. Just add it to your screen's playlist and get ready to monetize. Simple as that.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Title and Description spanning full width */}
        <div className="mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Monetize any Screen you want
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            There is no need to buy new expensive TV screens or additional
            displays for your business. You can simply use your existing
            equipment and connect them to FRAMEN.
          </p>
        </div>

        {/* Bottom Section - Connection Methods */}
        <div className="grid grid-cols-4 gap-6">
          {connectionMethods.map((method, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up bg-white p-4"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img
                src={method.image}
                alt={method.title}
                className="w-full h-auto rounded-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {method.title}
              </h4>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.8s ease-out forwards;
            }
          `,
        }}
      />
    </section>
  );
};

export default MonetizeSection;
