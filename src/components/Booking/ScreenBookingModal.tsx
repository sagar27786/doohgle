import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Monitor,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
} from "lucide-react";

interface Screen {
  id: number;
  name: string;
  location_name: string;
  city: string;
  state: string;
  screen_type: string;
  cost_per_10_seconds: number;
  daily_footfall: number;
  screen_size_width?: number;
  screen_size_height?: number;
}

interface BookingData {
  screen_id: number;
  start_date: string;
  end_date: string;
  campaign_id?: number;
  total_amount: number;
  booking_hours: number[];
  content_url?: string;
  notes?: string;
}

interface ScreenBookingModalProps {
  screen: Screen | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: any) => void;
}

const ScreenBookingModal: React.FC<ScreenBookingModalProps> = ({
  screen,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    screen_id: 0,
    start_date: "",
    end_date: "",
    total_amount: 0,
    booking_hours: [],
  });
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [errors, setErrors] = useState<any>({});

  // Time slots (24-hour format)
  const timeSlots = [
    { hour: 6, label: "6:00 AM" },
    { hour: 7, label: "7:00 AM" },
    { hour: 8, label: "8:00 AM" },
    { hour: 9, label: "9:00 AM" },
    { hour: 10, label: "10:00 AM" },
    { hour: 11, label: "11:00 AM" },
    { hour: 12, label: "12:00 PM" },
    { hour: 13, label: "1:00 PM" },
    { hour: 14, label: "2:00 PM" },
    { hour: 15, label: "3:00 PM" },
    { hour: 16, label: "4:00 PM" },
    { hour: 17, label: "5:00 PM" },
    { hour: 18, label: "6:00 PM" },
    { hour: 19, label: "7:00 PM" },
    { hour: 20, label: "8:00 PM" },
    { hour: 21, label: "9:00 PM" },
    { hour: 22, label: "10:00 PM" },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && screen) {
      setBookingData((prev) => ({
        ...prev,
        screen_id: screen.id,
      }));
      setStep(1);
      setErrors({});
      setAvailability(null);
      setSelectedHours([]);
    }
  }, [isOpen, screen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (!isOpen || !screen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Book Screen: {screen.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                {screen.location_name}, {screen.city}, {screen.state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Screen Info */}
          <div className="p-6">
            <div className="modern-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Screen Type
                    </p>
                    <p className="font-medium">{screen.screen_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rate per Hour
                    </p>
                    <p className="font-medium">
                      {formatCurrency(screen.cost_per_10_seconds * 360)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Footfall
                    </p>
                    <p className="font-medium">
                      {screen.daily_footfall.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="mt-6 modern-card bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                <Calendar className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Booking System Coming Soon!</h3>
                  <p className="text-sm mt-1">
                    Complete booking functionality with availability checking,
                    payment processing, and campaign integration will be
                    available soon.
                  </p>
                  <div className="mt-3 text-sm">
                    <p>
                      <strong>Features:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Real-time availability checking</li>
                      <li>Flexible time slot selection</li>
                      <li>Automated conflict detection</li>
                      <li>Campaign integration</li>
                      <li>Booking confirmation & tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6">
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScreenBookingModal;
