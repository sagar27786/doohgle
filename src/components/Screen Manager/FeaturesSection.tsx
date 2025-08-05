import React from "react";
import {
  GalleryVertical as Gallery,
  PanelTop as Channels,
  Users,
  MapPin,
  DollarSign,
  BarChart3,
  Shield,
  UserCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Gallery className="h-8 w-8 text-purple-600" />,
      title: "Handle your Creatives",
      subtitle: "GALLERY",
      description:
        "The gallery provides a snapshot of all the ads you're ready to display to your audience. With ease, you can upload multiple images or videos simultaneously, integrate engaging HTML ads, or design your advertisements from the ground up using our ad creation studio.",
      videoUrl:
        "https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65b658156ab2d2a7c55c8308_gallery-bb-hotels.webm",
      aspectRatio: "aspect-video",
    },
    {
      icon: <Channels className="h-8 w-8 text-purple-600" />,
      title: "Access Global Channels",
      subtitle: "CHANNELS",
      description:
        "Subscribing to channels is simple – a single click connects you to a diverse array of content in various languages. Our selection ranges from news and sports to fashion, politics, food & nutrition, and start-up insights from across the globe. Choose content that resonates with your audience or complements your space perfectly.",
      videoUrl:
        "https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65af957f83e334657533b191_FRAMEN-ScreenManager-Channels.webm",
      aspectRatio: "aspect-video",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Content Creators",
      subtitle: "CREATORS",
      description:
        "Engage your community on eye level and tap into the ever growing thought leadership of influencers. Offer your audience the exact creator content that is relevant to them!",
      imageUrl:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b77f089a8a9e6ab00b9605_content-creator.png",
      aspectRatio: "aspect-video",
    },
    {
      icon: <MapPin className="h-8 w-8 text-purple-600" />,
      title: "Register your screens",
      subtitle: "PLAYERS",
      description:
        "Include all your screens, TVs, and displays into our system to showcase various content and advertisements. Organize them by their physical location for improved management and oversight.",
      additionalText:
        "Additionally, for each device, you have the flexibility to decide whether to enable or disable advertisements, set the frequency of ad displays, and choose which channels to subscribe to. These customizable options ensure that your content delivery meets the specific preferences and needs of your audience.",
      customContent: (
        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="text-center">
            <img
              src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65afdc32f654afa1230c5c64_Creatives-Approved.png"
              alt="Creatives Approved"
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm font-semibold text-green-600">Approved</p>
          </div>
          <div className="text-center">
            <img
              src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65afdc327d8b94b1802dbbd2_Creatives-Pending.png"
              alt="Creatives Pending"
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm font-semibold text-yellow-600">Pending</p>
          </div>
          <div className="text-center">
            <img
              src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65afdc31fb253ba27954991b_Creatives-Rejected.png"
              alt="Creatives Rejected"
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            />
            <p className="text-sm font-semibold text-red-600">Rejected</p>
          </div>
        </div>
      ),
      aspectRatio: "aspect-video",
    },
    {
      icon: <MapPin className="h-8 w-8 text-purple-600" />,
      title: "Venue Locations",
      subtitle: "LOCATIONS",
      description:
        "You have the ability to include a variety of venues or screen locations in our system by address, and even categorize them by type of business if necessary. Just input your opening hours and the average daily visitor count, then add your screens to each specific location.",
      additionalText:
        "After FRAMEN reviews your setup, you'll be all set to start making money by showing advertisements alongside your own content, or you can opt to display only your own materials if that's your preference.",
      videoUrl:
        "https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65afcfaf8b95b86235f1d840_FRAMEN-ScreenManager-Locations.webm",
      aspectRatio: "aspect-video",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Ad Approval Process",
      subtitle: "EARN MONEY",
      description:
        "When you decide to show ads on your displays, advertisers can start booking your screens for their campaigns. You always have the choice to approve or reject specific ads that might not be suitable for your venue or audience.",
      additionalText:
        'Rest assured, our internal team reviews all advertiser campaigns for quality before they go live on your screens. Additionally, we offer an "instant approval" option if you prefer a more streamlined process.',
      customContent: (
        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="text-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            >
              <source
                src="https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65b795d0881f4d6692908d0c_pending.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p className="text-sm font-semibold text-yellow-600">Pending</p>
          </div>
          <div className="text-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            >
              <source
                src="https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65b795d0881f4d6692908d0c_pending.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p className="text-sm font-semibold text-green-600">Approved</p>
          </div>
          <div className="text-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg shadow-lg mb-4"
            >
              <source
                src="https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65b79e9eb5ac32be1a1ded85_rejected-pk.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p className="text-sm font-semibold text-red-600">Rejected</p>
          </div>
        </div>
      ),
      aspectRatio: "aspect-video",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Ad Reports",
      subtitle: "REPORTS",
      description:
        "The reports tab provides a summary of advertising data for each connected screen or display. It details all the ads that have been shown, the total number of ad spots played, and the overall impressions made.",
      customContent: (
        <div className="w-full h-full flex items-center justify-center p-12">
          <div
            className="w-full max-w-3xl space-y-8"
            style={{ transform: "scale(0.6)", transformOrigin: "center" }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6">
                Main Office - Office #1
              </h4>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    First play:{" "}
                    <span className="font-medium">Dez 02, 2023</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Last play: <span className="font-medium">Jan 23, 2024</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Cities:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      London
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Venues:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      Coworking
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Creatives total</p>
                  <p className="text-xl font-bold text-gray-900">8</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Spots total</p>
                  <p className="text-xl font-bold text-gray-900">468</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Impressions total</p>
                  <p className="text-xl font-bold text-gray-900">13,452</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6">
                Lounge Area - Office #1
              </h4>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    First play:{" "}
                    <span className="font-medium">Jan 05, 2024</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Last play: <span className="font-medium">Jan 10, 2023</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Cities:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      London
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Venues:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      Coworking
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Creatives total</p>
                  <p className="text-xl font-bold text-gray-900">4</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Spots total</p>
                  <p className="text-xl font-bold text-gray-900">216</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Impressions total</p>
                  <p className="text-xl font-bold text-gray-900">632</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-6">
                Welcome Tablet - Reception
              </h4>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    First play:{" "}
                    <span className="font-medium">Aug 10, 2023</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Last play: <span className="font-medium">Sep 10, 2023</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Cities:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      London
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Venues:{" "}
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                      Coworking
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Creatives total</p>
                  <p className="text-xl font-bold text-gray-900">18</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Spots total</p>
                  <p className="text-xl font-bold text-gray-900">1,659</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Impressions total</p>
                  <p className="text-xl font-bold text-gray-900">12,072</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      aspectRatio: "aspect-video",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      title: "Earning Overview",
      subtitle: "EARNINGS",
      description:
        "The earnings dashboard presents a comprehensive look at your total income and monthly earnings, which you can conveniently download as a PDF report.",
      customContent: (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="relative w-full max-w-4xl">
            <div
              className="bg-white rounded-xl shadow-2xl p-8 animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900">
                  Earnings Overview
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">
                    Live
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65b658db3dc80ee41a20dbfd_framen-earning-overview.png"
                  alt="Framen Earning Overview Dashboard"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  style={{ maxHeight: "400px" }}
                />

                {/* Enhanced floating elements with more animations */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-500 rounded-full animate-ping shadow-lg"></div>
                <div
                  className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-ping shadow-lg"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shadow-lg"
                  style={{ animationDelay: "2s" }}
                ></div>

                {/* Additional animated elements */}
                <div
                  className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Animated border effect */}
                <div className="absolute inset-0 border-2 border-purple-300 rounded-lg animate-pulse opacity-30"></div>

                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-lg animate-pulse"></div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div
                  className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-xl font-bold text-gray-900">€12,450</p>
                </div>
                <div
                  className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-xl font-bold text-gray-900">€2,450</p>
                </div>
                <div
                  className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <p className="text-sm text-gray-600">Active Screens</p>
                  <p className="text-xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      aspectRatio: "aspect-video",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-purple-600" />,
      title: "My Team",
      subtitle: "ACCOUNT",
      description:
        "Collaborate with your team on all your locations and content that should be displayed. You can easily bring them on board by inviting them through email. If necessary, use User Roles to limit their access according to their responsibilities.",
      customContent: (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
            <div
              className="text-center opacity-0 animate-fade-in-left"
              style={{
                animationDelay: "0s",
                animation: "fadeInLeft 0.8s ease-out forwards",
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656df2b56d2d270e27b97656_Member-1.svg"
                alt="Team Member 1"
                className="w-full h-auto rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <p className="text-sm font-semibold text-purple-600">Team Lead</p>
            </div>
            <div
              className="text-center opacity-0 animate-fade-in-left"
              style={{
                animationDelay: "0.3s",
                animation: "fadeInLeft 0.8s ease-out 0.3s forwards",
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656df2b509b2ef101a8dc144_Member-2.svg"
                alt="Team Member 2"
                className="w-full h-auto rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <p className="text-sm font-semibold text-purple-600">
                Content Manager
              </p>
            </div>
            <div
              className="text-center opacity-0 animate-fade-in-left"
              style={{
                animationDelay: "0.6s",
                animation: "fadeInLeft 0.8s ease-out 0.6s forwards",
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656df2b5e0d5c4a1d3b405d0_Member-3.svg"
                alt="Team Member 3"
                className="w-full h-auto rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <p className="text-sm font-semibold text-purple-600">
                Analytics Specialist
              </p>
            </div>
          </div>
        </div>
      ),
      aspectRatio: "aspect-video",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the comprehensive tools and features that make FRAMEN the
            perfect solution for your digital signage needs.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div
                className={`space-y-6 ${
                  index % 2 === 1 ? "lg:col-start-2" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                    {feature.subtitle}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                {feature.additionalText && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.additionalText}
                  </p>
                )}
              </div>

              <div
                className={`relative ${
                  index % 2 === 1 ? "lg:col-start-1" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100 ${feature.aspectRatio}`}
                >
                  {feature.customContent ? (
                    feature.customContent
                  ) : feature.videoUrl ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      <source src={feature.videoUrl} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  ) : feature.imageUrl ? (
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                      <div className="text-center">
                        {feature.icon}
                        <p className="mt-4 text-gray-600 font-medium">
                          {feature.title}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
