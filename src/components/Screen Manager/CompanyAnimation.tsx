import React from "react";

const CompanyAnimation = () => {
  const companies = [
    {
      name: "Mindspace",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda1ec5a5639f9be5f03_Mindpsace%20Logo.png",
    },
    {
      name: "Edge Workspaces",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda1a4f85e49b56b5a7d_Edge%20Workspaces%20Logo.png",
    },
    {
      name: "Servercorp",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda2e43f312bae97f92a_Servercorp%20Logo.png",
    },
    {
      name: "Talent Garden",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda15eaca916786fb924_Talent%20Garden%20Logo.png",
    },
    {
      name: "Elron Club",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda15cab36f3e4177372_elron%20club%20Logo.png",
    },
    {
      name: "Stuttgart Airport",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda1dac117e989491be3_Stuttgart%20Airport%20Logo.png",
    },
    {
      name: "David Lloyd Clubs",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda152273fbf1f713676_David%20Lloyd%20Clubs%20Logo.png",
    },
    {
      name: "Grand Hyatt",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda1aea7bfa65696932b_Grand%20Hyatt%20Logo.png",
    },
    {
      name: "Burger King",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda155110a3097eb0912_Burger%20King%20Logo.png",
    },
    {
      name: "Homes Place",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda17fa33582fe5af304_Homes%20Place%20Logo.png",
    },
    {
      name: "PWM",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0dda18f26437c39a67549_PWM%20Logo-1.png",
    },
    {
      name: "Orlen Petrol Station",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b0e2b817e8b72dc9e885c3_Orlen%20Petrol%20Station%20Logo.png",
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-12">
          Our location customers
        </h2>

        <div className="relative">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center mx-8 transition-all duration-150 hover:scale-110"
                style={{ minWidth: "150px", height: "80px" }}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-100"
                  loading="lazy"
                />
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
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 5s linear infinite;
          }
        `,
        }}
      />
    </section>
  );
};

export default CompanyAnimation;
