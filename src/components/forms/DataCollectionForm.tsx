import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Building, MessageSquare, Send, CheckCircle, X } from 'lucide-react';

// Simple utility function for combining class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  formType: string;
  cardTitle: string;
}

const DataCollectionForm: React.FC<{ formType: string; cardTitle?: string }> = ({ formType, cardTitle }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    formType,
    cardTitle: cardTitle || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const formConfig = {
    'learn-more': {
      title: 'Learn More About Our Platform',
      subtitle: 'Get detailed information and personalized recommendations',
      gradient: 'from-blue-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50'
    },
    'helpdesk': {
      title: 'Access Our Helpdesk Center',
      subtitle: 'Get technical support and product documentation',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    'publisher': {
      title: 'Become a Publisher',
      subtitle: 'Join our global network and start monetizing your content',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    'content-creator': {
      title: 'Content Creator Program',
      subtitle: 'Unlock exclusive tools and grow your audience',
      gradient: 'from-pink-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-red-50'
    }
  };

  const config = formConfig[formType as keyof typeof formConfig] || formConfig['learn-more'];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would send the data to your backend
      console.log('Form submitted:', formData);
      
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          formType,
          cardTitle: cardTitle || ''
        });
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your information has been submitted successfully. Our team will get back to you shortly.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.close()}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300"
          >
            Close
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen py-12 px-4", config.bgColor)}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className={`w-16 h-1 bg-gradient-to-r ${config.gradient} rounded-full mx-auto mb-6`}
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {config.subtitle}
          </p>
          
          {cardTitle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 inline-block px-4 py-2 bg-white/80 rounded-full text-sm text-gray-700 shadow-sm"
            >
              Interested in: <span className="font-semibold">{cardTitle}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div variants={inputVariants} whileFocus="focus">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
                  errors.firstName ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                )}
                placeholder="Enter your first name"
              />
              <AnimatePresence>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={inputVariants} whileFocus="focus">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
                  errors.lastName ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                )}
                placeholder="Enter your last name"
              />
              <AnimatePresence>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div variants={inputVariants} whileFocus="focus" className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
                errors.email ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              )}
              placeholder="Enter your email address"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phone and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div variants={inputVariants} whileFocus="focus">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
                  errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                )}
                placeholder="Enter your phone number"
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={inputVariants} whileFocus="focus">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building size={16} className="inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300",
                  errors.company ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                )}
                placeholder="Enter your company name"
              />
              <AnimatePresence>
                {errors.company && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.company}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Message Field */}
          <motion.div variants={inputVariants} whileFocus="focus" className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare size={16} className="inline mr-2" />
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none",
                errors.message ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              )}
              placeholder="Tell us more about your requirements..."
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={cn(
              `w-full py-4 px-8 bg-gradient-to-r ${config.gradient} text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center`,
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
            )}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Submitting...
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Send size={20} className="mr-2" />
                  Submit Request
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default DataCollectionForm;
