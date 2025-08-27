{
  availableScreens.map((screen, index) => {
    const cardColors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
    ];
    const colorClass = cardColors[index % cardColors.length];

    return (
      <motion.div
        key={screen.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => toggleScreenSelection(screen)}
        className={`border rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg h-[420px] w-full cursor-pointer transform hover:scale-[1.02] ${
          isScreenSelected(screen.id)
            ? "ring-4 ring-blue-400 bg-blue-50 shadow-xl scale-[1.02]"
            : "hover:shadow-xl bg-white hover:ring-2 hover:ring-gray-300"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="relative flex-shrink-0">
            <div
              className={`h-48 bg-gradient-to-br ${colorClass} flex items-center justify-center overflow-hidden relative`}
            >
              {screen.imageUrl ? (
                <img
                  src={screen.imageUrl}
                  alt={screen.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white">
                  <Monitor className="h-16 w-16 mx-auto mb-2 drop-shadow-lg" />
                  <p className="text-sm font-medium drop-shadow">
                    Premium Display
                  </p>
                </div>
              )}

              {/* Selection Overlay */}
              {isScreenSelected(screen.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-blue-900 bg-opacity-20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="h-8 w-8 text-blue-600" />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <motion.span
                className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-md"
                animate={{ scale: isScreenSelected(screen.id) ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Available
              </motion.span>
            </div>

            {/* Selection Badge */}
            {isScreenSelected(screen.id) && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                  SELECTED
                </span>
              </motion.div>
            )}

            {/* Location Multiplier Badge */}
            {screen.pricing.locationMultiplier > 1.0 && (
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                  {screen.pricing.locationMultiplier}x
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900 mb-1 text-lg leading-tight">
                {screen.name}
              </h3>
              <p className="text-gray-600 text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {screen.location}
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Pricing
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{screen.pricing.baseHourly}/hr
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Location: {screen.pricing.locationMultiplier}x</span>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    Morning: {screen.pricing.timeSlotMultipliers.morning}x
                  </div>
                  <div>
                    Evening: {screen.pricing.timeSlotMultipliers.evening}x
                  </div>
                  <div>
                    Peak: {screen.pricing.timeSlotMultipliers.peakHours}x
                  </div>
                  <div>Night: {screen.pricing.timeSlotMultipliers.night}x</div>
                </div>
              </div>
            </div>

            {/* Screen Details */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <div className="text-gray-500">Size</div>
                <div className="font-medium">{screen.size}</div>
              </div>
              <div>
                <div className="text-gray-500">Daily Traffic</div>
                <div className="font-medium">
                  {screen.traffic.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Resolution</div>
                <div className="font-medium">{screen.resolution}</div>
              </div>
              <div>
                <div className="text-gray-500">View Time</div>
                <div className="font-medium">{screen.averageViewTime}s</div>
              </div>
            </div>
          </div>

          {/* View Details Button Only */}
          <div className="px-4 pb-4 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card selection when clicking details
                setScreenInView(screen);
              }}
              className="w-full px-4 py-3 text-sm text-blue-600 hover:text-white hover:bg-blue-600 font-medium rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-600 bg-blue-50 hover:shadow-md"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  });
}
