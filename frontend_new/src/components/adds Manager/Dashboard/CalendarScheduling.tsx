import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarSchedulingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleData {
  date: Date;
  hours: number[];
  formattedDate: string;
  formattedHours: string;
}

const CalendarScheduling: React.FC<CalendarSchedulingProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: 15,
      y: 100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateX: -15,
      y: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateY: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const calendarVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
      },
    },
  };

  const hourGridVariants = {
    hidden: { opacity: 0, height: 0, rotateX: -20 },
    visible: {
      opacity: 1,
      height: "auto",
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        staggerChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      rotateX: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const confirmationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      rotateY: 90,
      z: -200,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      rotateY: -90,
      z: 200,
      transition: {
        duration: 0.4,
      },
    },
  };

  const generateCalendarDays = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, []);

  const calendarDays = generateCalendarDays(currentMonth);

  const goToPrevMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const isDateSelected = useCallback(
    (date: Date) => {
      if (!selectedDate) return false;
      return date.toDateString() === selectedDate.toDateString();
    },
    [selectedDate]
  );

  const isDateInCurrentMonth = useCallback(
    (date: Date) => {
      return date.getMonth() === currentMonth.getMonth();
    },
    [currentMonth]
  );

  const isDateToday = useCallback((date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isPastDate = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (!isDateInCurrentMonth(date) || isPastDate(date)) return;
      setSelectedDate(date);
      setSelectedHours([]);
    },
    [isDateInCurrentMonth, isPastDate]
  );

  const toggleHourSelection = useCallback((hour: number) => {
    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((h) => h !== hour);
      } else {
        return [...prev, hour].sort((a, b) => a - b);
      }
    });
  }, []);

  const isHourSelected = useCallback(
    (hour: number) => {
      return selectedHours.includes(hour);
    },
    [selectedHours]
  );

  const selectHourRange = useCallback((startHour: number, endHour: number) => {
    const range = [];
    for (let i = startHour; i <= endHour; i++) {
      range.push(i);
    }
    setSelectedHours(range);
  }, []);

  const formatTime = useCallback((hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  }, []);

  const formatSelectedHours = useCallback(() => {
    if (selectedHours.length === 0) return "No hours selected";
    if (selectedHours.length === 1) return `${formatTime(selectedHours[0])}`;

    const sorted = [...selectedHours].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        if (start === end) {
          ranges.push(formatTime(start));
        } else {
          ranges.push(`${formatTime(start)}-${formatTime(end)}`);
        }
        start = sorted[i];
        end = sorted[i];
      }
    }

    if (start === end) {
      ranges.push(formatTime(start));
    } else {
      ranges.push(`${formatTime(start)}-${formatTime(end)}`);
    }

    return ranges.join(", ");
  }, [selectedHours, formatTime]);

  const handleScheduleCampaign = useCallback(() => {
    if (!selectedDate || selectedHours.length === 0) return;

    const data: ScheduleData = {
      date: selectedDate,
      hours: selectedHours,
      formattedDate: selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      formattedHours: formatSelectedHours(),
    };

    setScheduleData(data);
    setShowConfirmation(true);
  }, [selectedDate, selectedHours, formatSelectedHours]);

  const handleConfirm = useCallback(async () => {
    setIsConfirming(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would actually save the schedule
    console.log("Campaign scheduled:", scheduleData);

    setIsConfirming(false);
    setShowConfirmation(false);
    onClose();
  }, [scheduleData, onClose]);

  const handleBack = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/20"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {!showConfirmation ? (
            <div className="p-8 overflow-y-auto max-h-[95vh]">
              {/* Animated Header */}
              <motion.div
                className="flex items-center justify-between mb-8"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center"
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Schedule Campaign
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Select date and time slots for your campaign
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-all duration-200"
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                    backgroundColor: "#fef2f2",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div className="mb-8" variants={itemVariants}>
                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      !selectedDate
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        !selectedDate
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {!selectedDate ? "1" : "✓"}
                    </div>
                    <span className="font-medium">Select Date</span>
                  </div>

                  <motion.div
                    className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: selectedDate ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>

                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedHours.length === 0
                        ? "bg-gray-100 text-gray-400"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedHours.length === 0
                          ? "bg-gray-300 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {selectedHours.length === 0 ? "2" : "✓"}
                    </div>
                    <span className="font-medium">Select Hours</span>
                  </div>
                </div>
              </motion.div>

              {/* Calendar Section */}
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 mb-8 shadow-lg border border-gray-100/50"
                variants={calendarVariants}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.button
                    onClick={goToPrevMonth}
                    className="p-3 hover:bg-white/80 rounded-2xl transition-all duration-200 group shadow-md backdrop-blur-sm"
                    whileHover={{
                      scale: 1.1,
                      rotateY: -15,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-gray-600 group-hover:text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: -2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </motion.svg>
                  </motion.button>

                  <motion.h3
                    className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                    key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
                    initial={{ opacity: 0, y: -20, rotateX: 20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </motion.h3>

                  <motion.button
                    onClick={goToNextMonth}
                    className="p-3 hover:bg-white/80 rounded-2xl transition-all duration-200 group shadow-md backdrop-blur-sm"
                    whileHover={{
                      scale: 1.1,
                      rotateY: 15,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-gray-600 group-hover:text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </motion.button>
                </div>

                {/* Day Names */}
                <motion.div
                  className="grid grid-cols-7 gap-3 mb-6"
                  variants={itemVariants}
                >
                  {dayNames.map((day, index) => (
                    <motion.div
                      key={day}
                      className="text-center text-sm font-bold text-gray-700 py-4 bg-white/60 rounded-xl backdrop-blur-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {day}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Calendar Grid */}
                <motion.div
                  className="grid grid-cols-7 gap-3"
                  variants={itemVariants}
                >
                  {calendarDays.map((date, index) => {
                    const isSelected = isDateSelected(date);
                    const isCurrentMonth = isDateInCurrentMonth(date);
                    const isToday = isDateToday(date);
                    const isPast = isPastDate(date);
                    const isDisabled = !isCurrentMonth || isPast;

                    return (
                      <motion.button
                        key={`${date.getTime()}-${index}`}
                        onClick={() => handleDateSelect(date)}
                        disabled={isDisabled}
                        className={`
                          aspect-square p-3 text-sm rounded-2xl font-bold transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-2xl transform scale-110 z-10"
                              : isToday && !isPast
                              ? "bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 ring-2 ring-purple-400 shadow-lg"
                              : isCurrentMonth && !isPast
                              ? "bg-white/80 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 text-gray-700 shadow-md hover:shadow-xl hover:scale-105 border border-gray-200/50"
                              : "bg-gray-100/50 text-gray-300 cursor-not-allowed"
                          }
                        `}
                        initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{
                          delay: index * 0.01,
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        whileHover={
                          !isDisabled
                            ? {
                                scale: 1.1,
                                rotateY: [0, 5, -5, 0],
                                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                              }
                            : {}
                        }
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                          />
                        )}
                        <span className="relative z-10">{date.getDate()}</span>
                        {isToday && !isPast && (
                          <motion.div
                            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Hour Selection */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    variants={hourGridVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-8"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl border border-purple-100/50">
                      <motion.div
                        className="flex items-center justify-between mb-8"
                        variants={itemVariants}
                      >
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Select Time Slots
                          </h3>
                          <p className="text-purple-600 font-medium">
                            {selectedDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            onClick={() => selectHourRange(9, 17)}
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-200 font-semibold shadow-md"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 8px 25px rgba(168, 85, 247, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Business Hours
                          </motion.button>
                          <motion.button
                            onClick={() => selectHourRange(0, 23)}
                            className="px-6 py-3 bg-white text-blue-600 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 font-semibold shadow-md"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            All Day
                          </motion.button>
                          <motion.button
                            onClick={() => setSelectedHours([])}
                            className="px-6 py-3 bg-white text-gray-600 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-md"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 8px 25px rgba(107, 114, 128, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Clear All
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Hour Grid */}
                      <motion.div
                        className="grid grid-cols-12 gap-3 mb-6"
                        variants={itemVariants}
                      >
                        {hours.map((hour, index) => (
                          <motion.button
                            key={hour}
                            onClick={() => toggleHourSelection(hour)}
                            className={`
                              aspect-square rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden backdrop-blur-sm
                              ${
                                isHourSelected(hour)
                                  ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-2xl scale-110 z-10"
                                  : "bg-white/90 text-gray-700 hover:bg-gradient-to-br hover:from-purple-100 hover:to-blue-100 hover:text-purple-700 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200/50"
                              }
                            `}
                            initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
                            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                            transition={{
                              delay: index * 0.02,
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                            whileHover={{
                              scale: 1.15,
                              rotateZ: [0, -5, 5, 0],
                              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              transformStyle: "preserve-3d",
                            }}
                          >
                            {isHourSelected(hour) && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                              />
                            )}
                            <span className="relative z-10">
                              {hour.toString().padStart(2, "0")}
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>

                      {/* Selected Hours Summary */}
                      {selectedHours.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 shadow-xl"
                          whileHover={{
                            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.1)",
                          }}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.div
                              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </motion.div>
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                Selected Time Slots
                              </span>
                              <p className="text-sm text-gray-600">
                                {selectedHours.length} hour
                                {selectedHours.length !== 1 ? "s" : ""} selected
                              </p>
                            </div>
                          </div>
                          <p className="text-purple-700 font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {formatSelectedHours()}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <motion.div
                className="flex items-center justify-end space-x-6"
                variants={itemVariants}
              >
                <motion.button
                  onClick={onClose}
                  className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold text-lg transition-all duration-200"
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleScheduleCampaign}
                  disabled={!selectedDate || selectedHours.length === 0}
                  className={`
                    relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden
                    ${
                      selectedDate && selectedHours.length > 0
                        ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-2xl hover:shadow-3xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `}
                  whileHover={
                    selectedDate && selectedHours.length > 0
                      ? {
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)",
                          y: -2,
                        }
                      : {}
                  }
                  whileTap={
                    selectedDate && selectedHours.length > 0
                      ? { scale: 0.95 }
                      : {}
                  }
                >
                  {selectedDate && selectedHours.length > 0 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Continue to Review</span>
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </span>
                </motion.button>
              </motion.div>
            </div>
          ) : (
            /* Confirmation Screen */
            <motion.div
              variants={confirmationVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-8 h-full flex flex-col justify-center"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Review Your Schedule
                </h2>
                <p className="text-gray-600 text-lg">
                  Please confirm the details below before scheduling your
                  campaign
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 mb-8 shadow-xl border border-gray-100/50"
                variants={itemVariants}
                whileHover={{
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  y: -5,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Campaign Date
                        </h3>
                        <p className="text-purple-600 font-semibold text-lg">
                          {scheduleData?.formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Time Slots
                        </h3>
                        <p className="text-green-600 font-semibold text-lg">
                          {scheduleData?.formattedHours}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-3xl font-bold text-purple-600">
                        {scheduleData?.hours.length}h
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center space-x-6"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleBack}
                  className="px-8 py-4 bg-white text-gray-600 hover:text-gray-800 font-semibold text-lg rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    x: -10,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Back to Edit
                </motion.button>

                <motion.button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className={`
                    relative px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden shadow-2xl
                    ${
                      isConfirming
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 hover:from-green-600 hover:via-blue-600 hover:to-purple-700"
                    }
                    text-white
                  `}
                  whileHover={
                    !isConfirming
                      ? {
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                          y: -3,
                        }
                      : {}
                  }
                  whileTap={!isConfirming ? { scale: 0.95 } : {}}
                >
                  {!isConfirming && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center space-x-3">
                    {isConfirming ? (
                      <>
                        <motion.div
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Schedule</span>
                        <motion.svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          whileHover={{ scale: 1.2 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalendarScheduling;
