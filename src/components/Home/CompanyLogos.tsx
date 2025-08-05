import React from "react";

const CompanyLogos = () => {
  const companies = [
    {
      name: "AMD",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e458c70e8d765dc3ec_Client-AMD.png",
    },
    {
      name: "Bosch",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba707a7773be8149f6a1b_Client-Bosch.png",
    },
    {
      name: "Uber",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba707b8baa404a8907797_Client-Uber.png",
    },
    {
      name: "eBay",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076e3994a2509f8bd6_Client-ebay.png",
    },
    {
      name: "Lufthansa",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076a090db4dcc19910_Client-lufthansa.png",
    },
    {
      name: "Porsche",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4517c29fc66589736_Client-Porsche.png",
    },
    {
      name: "Personio",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4c81aee2b62b83ea6_Client-Personio.png",
    },
    {
      name: "Vodafone",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4b3664fdd17b98ef3_Client-Vodafone.png",
    },
    {
      name: "Sixt",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4f5b551303452e5e4_Client-Sixt.png",
    },
    {
      name: "RedBull",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d9d0bc4af3378617_Client-RedBull.png",
    },
    {
      name: "Tommy Hilfiger",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d8236631fc81cd7e_Client-Tommy-Hilfiger.png",
    },
    {
      name: "Babbel",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4f74e6a1c57ff7388_Client-Babbel.png",
    },
    {
      name: "Seiko",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4515b1846176cde22_Client-Seiko.png",
    },
    {
      name: "Perrier",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4892770c6295ea195_Client-Perriere.png",
    },
  ];

  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of companies that trust our platform
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex space-x-24 items-center w-max"
            style={{
              animation: "scroll 13s linear infinite",
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes scroll {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-70%);
              }
            }
          `,
        }}
      />
    </div>
  );
};

export default CompanyLogos;
