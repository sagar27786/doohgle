import React, {
  useState,
  useRef,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";

// Define the props for the component
interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  altBeforeText?: string;
  altAfterText?: string;
}

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  altBeforeText = "Before image",
  altAfterText = "After image",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle the slider movement
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Calculate position as a percentage from 0 to 100
    let newPosition = ((clientX - rect.left) / rect.width) * 100;

    // Constrain the position between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));

    setSliderPosition(newPosition);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  // Touch event handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="dark:bg-slate-900 bg-white">
      {/* CHANGE: Added flexbox classes to center the content vertically and horizontally */}
      <div className="py-20 dark:text-white flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight text-center">
          Ad Manager / Screen Manager
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 font-normal text-slate-600 dark:text-slate-400">
            Choose Your Role
          </span>
        </h2>

        <div
          ref={containerRef}
          // CHANGE: Removed redundant 'mx-auto' as the parent flex container now handles centering
          className={`
        mt-10 relative w-1/2 aspect-video overflow-hidden select-none
        ${isDragging ? "cursor-ew-resize" : "cursor-default"}
      `}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* After Image (bottom layer) */}
          <img
            src={afterImage}
            alt={altAfterText}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Before Image (top layer, clipped) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt={altBeforeText}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Slider Handle and Line */}
          <div
            className="absolute top-0 bottom-0 w-[4px] bg-white/80 cursor-ew-resize pointer-events-auto transform -translate-x-1/2"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* The circular handle */}
            <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full border-2 border-black/50 flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              {/* Arrows inside the handle */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 17L6 12L11 7"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 17L18 12L13 7"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;
