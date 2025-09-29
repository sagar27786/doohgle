import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  Upload,
  FileText,
  MessageSquare,
  Camera,
  Video,
  Send,
  CheckCircle,
  Clock,
  Star,
  ThumbsDown,
  Zap
} from 'lucide-react';

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    campaign_name: string;
    screens: Array<{
      id: number;
      name: string;
      city: string;
    }>;
    status: string;
  };
  onSubmit: (complaintData: ComplaintData) => void;
}

export interface ComplaintData {
  booking_id: string;
  complaint_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  proofs: File[];
  suggestions: string;
  relaxations_needed: string;
  affected_screens: number[];
  contact_preference: 'email' | 'phone' | 'both';
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ComplaintData>({
    booking_id: booking.id,
    complaint_type: '',
    priority: 'medium',
    subject: '',
    description: '',
    proofs: [],
    suggestions: '',
    relaxations_needed: '',
    affected_screens: [],
    contact_preference: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const complaintTypes = [
    { value: 'screen_not_working', label: '📺 Screen Not Working', icon: <AlertTriangle className="w-4 h-4" /> },
    { value: 'poor_display_quality', label: '🖼️ Poor Display Quality', icon: <Star className="w-4 h-4" /> },
    { value: 'content_not_shown', label: '❌ Content Not Displayed', icon: <FileText className="w-4 h-4" /> },
    { value: 'incorrect_timing', label: '⏰ Incorrect Display Timing', icon: <Clock className="w-4 h-4" /> },
    { value: 'technical_issues', label: '⚡ Technical Issues', icon: <Zap className="w-4 h-4" /> },
    { value: 'billing_dispute', label: '💰 Billing Dispute', icon: <ThumbsDown className="w-4 h-4" /> },
    { value: 'location_access', label: '🚪 Location Access Issues', icon: <AlertTriangle className="w-4 h-4" /> },
    { value: 'other', label: '📝 Other Issues', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      proofs: [...prev.proofs, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      proofs: prev.proofs.filter((_, i) => i !== index)
    }));
  };

  const toggleScreenSelection = (screenId: number) => {
    setFormData(prev => ({
      ...prev,
      affected_screens: prev.affected_screens.includes(screenId)
        ? prev.affected_screens.filter(id => id !== screenId)
        : [...prev.affected_screens, screenId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(formData);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
        setFormData({
          booking_id: booking.id,
          complaint_type: '',
          priority: 'medium',
          subject: '',
          description: '',
          proofs: [],
          suggestions: '',
          relaxations_needed: '',
          affected_screens: [],
          contact_preference: 'email'
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">File a Complaint</h2>
                <p className="text-red-100">
                  Campaign: <span className="font-semibold">{booking.campaign_name}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Your complaint has been registered. Our support team will review it and get back to you soon.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-green-700">
                    <strong>Complaint ID:</strong> CMP-{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Expected Response:</strong> Within 24-48 hours
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Complaint Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What is your complaint about? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {complaintTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, complaint_type: type.value }))}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          formData.complaint_type === type.value
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2">
                          {type.icon}
                          <span className="text-xs font-medium">{type.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level *
                  </label>
                  <div className="flex space-x-3">
                    {priorityLevels.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.priority === priority.value
                            ? priority.color + ' ring-2 ring-offset-2 ring-current'
                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Affected Screens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Which screens are affected? (Optional)
                  </label>
                  <div className="space-y-2">
                    {booking.screens.map((screen) => (
                      <label key={screen.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.affected_screens.includes(screen.id)}
                          onChange={() => toggleScreenSelection(screen.id)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{screen.name}</p>
                          <p className="text-sm text-gray-500">{screen.city}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Brief summary of your complaint"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Please provide detailed information about the issue you're experiencing..."
                  />
                </div>

                {/* Proofs/Evidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Proofs/Evidence (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <div className="flex justify-center space-x-2 mb-3">
                        <Camera className="w-8 h-8 text-gray-400" />
                        <Video className="w-8 h-8 text-gray-400" />
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-2">Upload photos, videos, or documents</p>
                      <p className="text-sm text-gray-500 mb-4">Supported: JPG, PNG, MP4, PDF (Max 10MB each)</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </label>
                    </div>
                    
                    {formData.proofs.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.proofs.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Suggestions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.suggestions}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="How do you think this issue can be resolved or prevented in the future?"
                  />
                </div>

                {/* Relaxations Needed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relaxations/Compensation Needed (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.relaxations_needed}
                    onChange={(e) => setFormData(prev => ({ ...prev, relaxations_needed: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="What kind of compensation or relaxation are you looking for? (e.g., refund, extended display time, discount on future bookings)"
                  />
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you like us to contact you? *
                  </label>
                  <div className="flex space-x-4">
                    {[
                      { value: 'email', label: '📧 Email' },
                      { value: 'phone', label: '📞 Phone' },
                      { value: 'both', label: '📧📞 Both' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_preference"
                          value={option.value}
                          checked={formData.contact_preference === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_preference: e.target.value as any }))}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.complaint_type || !formData.subject || !formData.description}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Complaint</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComplaintForm;