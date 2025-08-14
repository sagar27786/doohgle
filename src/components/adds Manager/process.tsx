import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ProcessParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-500, 300]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="min-h-screen py-20 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-white via-blue-50/30 to-gray-50"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        {/* First Row - Left to Right */}
        <motion.div 
          className="flex space-x-12 mb-20 w-full"
          animate={{
            x: ["-100%", "0%"]
          }}
          transition={{
            x: {
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {[...firstRow, ...firstRow].map((product, index) => (
            <ProductCard
              key={`${product.title}-${index}`}
              product={product}
            />
          ))}
        </motion.div>

        {/* Second Row - Right to Left */}
        <motion.div 
          className="flex space-x-12 mb-20 w-full"
          animate={{
            x: ["0%", "-100%"]
          }}
          transition={{
            x: {
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {[...secondRow, ...secondRow].map((product, index) => (
            <ProductCard
              key={`${product.title}-${index}`}
              product={product}
            />
          ))}
        </motion.div>

        {/* Third Row - Left to Right */}
        <motion.div 
          className="flex space-x-12"
          animate={{
            x: ["-100%", "0%"]
          }}
          transition={{
            x: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }
          }}
        >
          {[...thirdRow, ...thirdRow].map((product, index) => (
            <ProductCard
              key={`${product.title}-${index}`}
              product={product}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
      >
        Next level <br />
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Customization
        </span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl text-base md:text-xl mt-8 text-gray-600 leading-relaxed"
      >
        We put in a lot of effort to give you a cutting-edge platform that makes 
        setting up and managing your digital out-of-home campaigns much simpler. 
        With these features, running your campaigns becomes a hassle-free experience.
      </motion.p>
    </div>
  );
};

export const ProductCard = ({
  product,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
}) => {
  const isVideo = /\.(mp4|webm)$/i.test(product.thumbnail);

  return (
    <motion.div
      whileHover={{
        y: -20,
        scale: 1.02,
      }}
      className="group/product h-80 w-[26rem] md:h-96 md:w-[30rem] relative shrink-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl h-full w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent z-10" />
        {isVideo ? (
          <video
            src={product.thumbnail}
            className="object-cover object-center absolute h-full w-full inset-0 rounded-2xl"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={product.thumbnail}
            height="600"
            width="600"
            className="object-cover object-center absolute h-full w-full inset-0 rounded-2xl"
            alt={product.title}
          />
        )}
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-60 bg-gradient-to-t from-blue-900/80 via-purple-900/40 to-transparent pointer-events-none transition-opacity duration-300 rounded-2xl" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h2 className="text-lg md:text-xl font-semibold opacity-0 group-hover/product:opacity-100 text-white transform translate-y-4 group-hover/product:translate-y-0 transition-all duration-300">
          {product.title}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/product:opacity-100 mt-2 transform translate-y-4 group-hover/product:translate-y-0 transition-all duration-300 delay-100 rounded-full" />
      </div>
    </motion.div>
  );
};

const ProcessShowcase: React.FC = () => {
  const products = [
    { 
      title: 'Campaign Dashboard', 
      link: '#', 
      thumbnail: 'https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f66204a5ca124ce0d40d_Campaigns-0.svg' 
    },
    { 
      title: 'Campaign Analytics', 
      link: '#', 
      thumbnail: 'https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f2414a1e73c4c3e4e518_Campaigns-1.svg' 
    },
    { 
      title: 'Campaign Reports', 
      link: '#', 
      thumbnail: 'https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f241eefd78d937ded7de_Campaigns-2.svg' 
    },
    { 
      title: 'Campaign Overview', 
      link: '#', 
      thumbnail: 'https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f24173ec3aa70ecd7292_Campaigns-3.svg' 
    },
    { 
      title: 'Geotargeting', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65671cfd9d57af8c52f49d80_Framen-Geotargeting.webm' 
    },
    { 
      title: 'Venue Selection', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65672decdbfe0c6c92a9e701_Framen-Venue-Selection.webm' 
    },
    { 
      title: 'Smart Scheduling', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65649cfbf8fe2b7c3057f66c_Framen-Ads-Manager-Scheduling.mp4' 
    },
    { 
      title: 'Multiple Creatives', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/656dae37e8d3682045015bc5_Framen-Multiple-Creatives.webm' 
    },
    { 
      title: 'QR Lead Tracking', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/656dc74d234dff136ed9f866_Framen-QR-Lead-Tracking.webm' 
    },
    { 
      title: 'Forecast Reports', 
      link: '#', 
      thumbnail: 'https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/656f26df1679a98b4061f8cb_Framen-Forecast-Report.webm' 
    },
  ];

  return <ProcessParallax products={products} />;
};

export default ProcessShowcase;
