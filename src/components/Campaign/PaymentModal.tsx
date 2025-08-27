import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Building2,
  Wallet,
  X,
  Check,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';
import { EnhancedBookingNotificationService, PaymentOption } from '../../services/enhancedBookingNotificationService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  screenName: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  amount,
  screenName,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentOption | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: '',
    bankAccount: '',
    walletPhone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'processing' | 'success'>('select');

  const paymentOptions = EnhancedBookingNotificationService.getPaymentOptions();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'upi':
        return <Smartphone className="w-6 h-6 text-blue-600" />;
      case 'card':
        return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'netbanking':
        return <Building2 className="w-6 h-6 text-green-600" />;
      case 'wallet':
        return <Wallet className="w-6 h-6 text-orange-600" />;
      default:
        return <DollarSign className="w-6 h-6 text-gray-600" />;
    }
  };

  const calculateTotal = () => {
    if (!selectedPaymentMethod) return amount;
    const processingFee = amount * (selectedPaymentMethod.processingFee || 0);
    return amount + processingFee;
  };

  const handlePaymentMethodSelect = (option: PaymentOption) => {
    setSelectedPaymentMethod(option);
    setStep('details');
  };

  const handleDetailsSubmit = () => {
    if (!selectedPaymentMethod) return;
    
    // Validate required fields based on payment method
    const isValid = validatePaymentDetails();
    if (!isValid) {
      return;
    }
    
    setStep('confirm');
  };

  const validatePaymentDetails = (): boolean => {
    if (!selectedPaymentMethod) return false;

    switch (selectedPaymentMethod.type) {
      case 'card':
        return paymentDetails.cardNumber.length >= 16 && 
               paymentDetails.cardExpiry.length >= 5 && 
               paymentDetails.cardCvv.length >= 3 &&
               paymentDetails.cardName.length > 0;
      case 'upi':
        return paymentDetails.upiId.length > 0 && paymentDetails.upiId.includes('@');
      case 'netbanking':
        return paymentDetails.bankAccount.length > 0;
      case 'wallet':
        return paymentDetails.walletPhone.length >= 10;
      default:
        return false;
    }
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);
    setStep('processing');

    try {
      const result = await EnhancedBookingNotificationService.processPayment(
        bookingId,
        calculateTotal(),
        selectedPaymentMethod.id,
        paymentDetails
      );

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          resetModal();
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onPaymentError(errorMessage);
      setStep('select');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedPaymentMethod(null);
    setPaymentDetails({
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: '',
      upiId: '',
      bankAccount: '',
      walletPhone: ''
    });
    setIsProcessing(false);
  };

  const renderPaymentMethodSelection = () => (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => handlePaymentMethodSelect(option)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPaymentIcon(option.type)}
                <div>
                  <div className="font-medium text-gray-900">{option.name}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
              {option.processingFee && option.processingFee > 0 && (
                <div className="text-sm text-gray-500">
                  +{(option.processingFee * 100).toFixed(1)}% fee
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
        <button
          onClick={() => setStep('select')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Change Method
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          {selectedPaymentMethod && getPaymentIcon(selectedPaymentMethod.type)}
          <span className="font-medium">{selectedPaymentMethod?.name}</span>
        </div>
      </div>

      <div className="space-y-4">
        {selectedPaymentMethod?.type === 'card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ 
                  ...prev, 
                  cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardExpiry}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    cardExpiry: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
                  }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardCvv}
                  onChange={(e) => setPaymentDetails(prev => ({ 
                    ...prev, 
                    cardCvv: e.target.value.replace(/\D/g, '')
                  }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentDetails.cardName}
                onChange={(e) => setPaymentDetails(prev => ({ 
                  ...prev, 
                  cardName: e.target.value
                }))}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}

        {selectedPaymentMethod?.type === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              value={paymentDetails.upiId}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                upiId: e.target.value
              }))}
              placeholder="yourname@paytm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {selectedPaymentMethod?.type === 'netbanking' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank *
            </label>
            <select
              value={paymentDetails.bankAccount}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                bankAccount: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        )}

        {selectedPaymentMethod?.type === 'wallet' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={paymentDetails.walletPhone}
              onChange={(e) => setPaymentDetails(prev => ({ 
                ...prev, 
                walletPhone: e.target.value.replace(/\D/g, '')
              }))}
              placeholder="9876543210"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => setStep('select')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleDetailsSubmit}
          disabled={!validatePaymentDetails()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Payment</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Screen:</span>
            <span className="font-medium">{screenName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-medium">#{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${amount}</span>
          </div>
          {selectedPaymentMethod && selectedPaymentMethod.processingFee && selectedPaymentMethod.processingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium">${(amount * selectedPaymentMethod.processingFee).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-blue-600">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Payment Security</p>
            <p>Your payment information is encrypted and secure. You will be redirected to complete the payment process.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setStep('details')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={processPayment}
          disabled={isProcessing}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Pay Now</span>
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
      <p className="text-gray-600">Please wait while we process your payment...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
      <p className="text-gray-600">Your payment has been processed successfully. The screen owner will be notified.</p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Payment</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {step === 'select' && renderPaymentMethodSelection()}
            {step === 'details' && renderPaymentDetails()}
            {step === 'confirm' && renderConfirmation()}
            {step === 'processing' && renderProcessing()}
            {step === 'success' && renderSuccess()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
