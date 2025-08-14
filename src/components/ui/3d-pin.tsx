"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <a
      className={cn(
        "relative group/pin z-50 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      href={href || "/"}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.15)] bg-gradient-to-br from-white/95 via-gray-50/90 to-violet-50/85 backdrop-blur-sm border border-violet-200/30 group-hover/pin:border-violet-300/50 group-hover/pin:shadow-[0_20px_40px_rgba(124,58,237,0.2)] transition-all duration-700 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </a>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-96 h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-7 flex-none inset-0">
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <a
            href={href}
            target={"_blank"}
            className="relative flex space-x-2 items-center z-10 rounded-full bg-gradient-to-r from-white/90 to-gray-100/90 backdrop-blur-sm py-1 px-6 ring-2 ring-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:ring-violet-300/70"
          >
            <span className="relative z-20 text-gray-800 text-sm font-bold inline-block py-0.5">
              {title}
            </span>

            <span className="absolute -bottom-0 left-[1.5rem] h-px w-[calc(100%-3rem)] bg-gradient-to-r from-violet-400/0 via-violet-500/90 to-violet-400/0 transition-opacity duration-500 group-hover/btn:opacity-60"></span>
          </a>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            {/* Enhanced ripple animations with light themes */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 0.8, 0.4, 0],
                scale: [0.5, 1.2, 1],
                z: 0,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 0,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-gradient-to-br from-violet-300/20 via-purple-200/15 to-blue-300/20 shadow-[0_8px_32px_rgba(124,58,237,0.2)] border border-violet-200/30"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 0.6, 0.3, 0],
                scale: [0.3, 1.4, 1],
                z: 0,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1.3,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-gradient-to-br from-pink-300/20 via-rose-200/15 to-orange-300/20 shadow-[0_8px_32px_rgba(236,72,153,0.2)] border border-pink-200/30"
            ></motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                opacity: [0, 0.7, 0.35, 0],
                scale: [0.4, 1.3, 1],
                z: 0,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2.6,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-gradient-to-br from-cyan-300/20 via-teal-200/15 to-emerald-300/20 shadow-[0_8px_32px_rgba(14,165,233,0.2)] border border-cyan-200/30"
            ></motion.div>
            
            {/* Additional smaller ripples for more dynamic effect */}
            <motion.div
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1.6, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute left-1/2 top-1/2 h-[8rem] w-[8rem] rounded-[50%] bg-gradient-to-r from-yellow-200/10 to-amber-200/10 border border-yellow-300/20"
            ></motion.div>
            <motion.div
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1.8, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: 1.8,
              }}
              className="absolute left-1/2 top-1/2 h-[6rem] w-[6rem] rounded-[50%] bg-gradient-to-r from-indigo-200/10 to-purple-200/10 border border-indigo-300/20"
            ></motion.div>
          </>
        </div>

        {/* Enhanced pin with light theme */}
        <>
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-white/20 via-violet-300/60 to-violet-500/80 translate-y-[14px] w-[2px] h-20 group-hover/pin:h-40 blur-[1px] shadow-lg" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-white/30 via-violet-400/70 to-violet-600/90 translate-y-[14px] w-px h-20 group-hover/pin:h-40" />
          <motion.div 
            className="absolute right-1/2 translate-x-[1px] bottom-1/2 bg-gradient-to-br from-violet-400 to-purple-500 translate-y-[14px] w-[6px] h-[6px] rounded-full z-40 blur-[2px] shadow-lg" 
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.div 
            className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-gradient-to-br from-white to-violet-300 translate-y-[14px] w-[3px] h-[3px] rounded-full z-40 shadow-md" 
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          
          {/* Glowing effect around pin */}
          <motion.div
            className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 translate-y-[14px] w-[12px] h-[12px] rounded-full z-30"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
            }}
          />
        </>
      </div>
    </motion.div>
  );
};
