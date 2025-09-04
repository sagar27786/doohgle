import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const DOOHChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your DOOH platform assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // WhatsApp configuration - replace with your actual WhatsApp number
  const whatsappNumber = "+1234567890"; // Replace with your WhatsApp business number
  const whatsappMessage =
    "Hello! I'm interested in learning more about DOOHGLE Media.";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const doohResponses = {
    greeting: [
      "Hello! I'm here to help with your DOOHGLE Media platform questions.",
      "Hi there! Ask me anything about DOOHGLE Media and Digital Out-of-Home advertising.",
      "Welcome to DOOHGLE Media! How can I assist you today?",
    ],
    free: [
      "Yes! Our software is available without fee. Create your account and login to your dashboard. Once you start an Ad Campaign, enter your payment options for the ad spend. Screen Managers equally can use our software for free with the option to upgrade to our Premium plan for additional features.",
    ],
    campaign: [
      "For campaign management, you can create, schedule, and monitor your DOOH campaigns through our platform dashboard. Would you like specific guidance on any of these features?",
      "Our campaign tools allow you to target specific locations, times, and demographics. What type of campaign are you looking to set up?",
    ],
    pricing: [
      "Campaign costs vary based on location, duration, and audience reach. Contact our sales team for detailed pricing.",
      "We offer flexible pricing models. Campaign costs depend on factors like location, duration, and audience reach. Would you like me to connect you with our sales team for a detailed quote?",
    ],
    audiences: [
      "Our network spans across various venue types including gyms, coworking spaces, retail locations, and more. Each venue type attracts different target audiences based on their activities and interests.",
    ],
    locations: [
      "Our screens are located in high-traffic venues across 32+ countries worldwide. We have premium DOOH locations in gyms, coworking spaces, retail locations, and other strategic venues.",
      "We're present in 32+ countries with screens in diverse venue types. Where are you looking to reach your target audience?",
    ],
    start: [
      "Kindly begin by logging in to your account to proceed with the available services.",
      "To get started, please log in to your account to access all features.",
    ],
    difference: [
      "Unlike traditional DOOH, DOOHGLE Media offers programmatic booking, real-time optimization, and detailed analytics. This means you get more control, better targeting, and measurable results from your campaigns.",
    ],
    analytics: [
      "Our analytics dashboard provides real-time data on impressions, engagement, and campaign performance. You can track ROI, audience demographics, and optimal display times.",
      "Analytics include foot traffic data, dwell time, and conversion tracking. Which metrics are most important for your campaigns?",
    ],
    technical: [
      "Our platform supports various creative formats including static images, videos, and interactive content. Files should be in HD resolution (1920x1080 minimum).",
      "Technical requirements include specific file formats (MP4, JPG, PNG), size limits, and duration constraints. What type of creative are you planning?",
    ],
    default: [
      "I'm here to help with DOOHGLE Media platform questions. You can ask about our free software, campaign costs, target audiences, screen locations, or how we differ from traditional DOOH.",
      "I can assist with DOOHGLE Media topics like pricing, locations across 32+ countries, our programmatic approach, or getting started with our free platform.",
    ],
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Greeting check
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("good morning") ||
      lowerMessage.includes("good afternoon") ||
      lowerMessage.includes("good evening")
    ) {
      return doohResponses.greeting[
        Math.floor(Math.random() * doohResponses.greeting.length)
      ];
    }

    // Free software check
    if (
      lowerMessage.includes("free") ||
      (lowerMessage.includes("software") &&
        (lowerMessage.includes("cost") || lowerMessage.includes("price"))) ||
      (lowerMessage.includes("doohgle") &&
        (lowerMessage.includes("free") ||
          lowerMessage.includes("without fee") ||
          lowerMessage.includes("no cost")))
    ) {
      return doohResponses.free[0];
    }

    // Getting started check
    if (
      lowerMessage.includes("get started") ||
      lowerMessage.includes("how to start") ||
      lowerMessage.includes("begin") ||
      lowerMessage.includes("start using") ||
      lowerMessage.includes("getting started") ||
      lowerMessage.includes("how do i")
    ) {
      return doohResponses.start[
        Math.floor(Math.random() * doohResponses.start.length)
      ];
    }

    // Campaign check
    if (
      lowerMessage.includes("campaign") ||
      lowerMessage.includes("advertise") ||
      lowerMessage.includes("ad") ||
      lowerMessage.includes("advertising") ||
      lowerMessage.includes("promote") ||
      lowerMessage.includes("marketing")
    ) {
      return doohResponses.campaign[
        Math.floor(Math.random() * doohResponses.campaign.length)
      ];
    }

    // Pricing check (but not if it's about free software)
    if (
      (lowerMessage.includes("price") ||
        lowerMessage.includes("cost") ||
        lowerMessage.includes("pricing") ||
        lowerMessage.includes("budget") ||
        lowerMessage.includes("how much") ||
        lowerMessage.includes("rate") ||
        lowerMessage.includes("fee")) &&
      !lowerMessage.includes("free")
    ) {
      return doohResponses.pricing[
        Math.floor(Math.random() * doohResponses.pricing.length)
      ];
    }

    // Target audience check
    if (
      lowerMessage.includes("target") ||
      lowerMessage.includes("audience") ||
      lowerMessage.includes("venue") ||
      lowerMessage.includes("gym") ||
      lowerMessage.includes("coworking") ||
      lowerMessage.includes("demographic") ||
      lowerMessage.includes("reach")
    ) {
      return doohResponses.audiences[0];
    }

    // Location check
    if (
      lowerMessage.includes("screen") ||
      lowerMessage.includes("location") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("countries") ||
      lowerMessage.includes("place") ||
      lowerMessage.includes("coverage") ||
      lowerMessage.includes("network")
    ) {
      return doohResponses.locations[
        Math.floor(Math.random() * doohResponses.locations.length)
      ];
    }

    // Difference check
    if (
      lowerMessage.includes("different") ||
      lowerMessage.includes("difference") ||
      lowerMessage.includes("traditional") ||
      lowerMessage.includes("unlike") ||
      lowerMessage.includes("programmatic") ||
      lowerMessage.includes("vs") ||
      lowerMessage.includes("compare") ||
      lowerMessage.includes("advantage") ||
      lowerMessage.includes("benefit")
    ) {
      return doohResponses.difference[0];
    }

    // Analytics check
    if (
      lowerMessage.includes("analytic") ||
      lowerMessage.includes("report") ||
      lowerMessage.includes("data") ||
      lowerMessage.includes("metric") ||
      lowerMessage.includes("track") ||
      lowerMessage.includes("performance") ||
      lowerMessage.includes("result") ||
      lowerMessage.includes("roi") ||
      lowerMessage.includes("measurement")
    ) {
      return doohResponses.analytics[
        Math.floor(Math.random() * doohResponses.analytics.length)
      ];
    }

    // Technical check
    if (
      lowerMessage.includes("technical") ||
      lowerMessage.includes("format") ||
      lowerMessage.includes("file") ||
      lowerMessage.includes("resolution") ||
      lowerMessage.includes("video") ||
      lowerMessage.includes("image") ||
      lowerMessage.includes("creative") ||
      lowerMessage.includes("upload") ||
      lowerMessage.includes("requirement") ||
      lowerMessage.includes("spec")
    ) {
      return doohResponses.technical[
        Math.floor(Math.random() * doohResponses.technical.length)
      ];
    }

    // Default response
    return doohResponses.default[
      Math.floor(Math.random() * doohResponses.default.length)
    ];
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /\+/g,
      ""
    )}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);

      // Add WhatsApp message after a short delay
      setTimeout(() => {
        const whatsappMessage = {
          id: Date.now() + 2,
          text: "💬 Chat with us on WhatsApp",
          sender: "whatsapp",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, whatsappMessage]);
      }, 500);
    }, 1000 + Math.random() * 1000); // Random typing delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="hover:bg-purple-700 bg-purple-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group relative shadow-indigo-300/50 dark:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            1
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-80 h-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 dark:bg-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 dark:bg-white/30 rounded-full p-2">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">DOOH Assistant</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 dark:bg-purple-600 bg-purple-600 rounded-full"></div>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 dark:hover:bg-white/30 rounded-full p-1 transition-colors focus:outline-none focus:ring-1 focus:ring-white/50"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
        {messages.map((message) => (
          <div key={message.id}>
            {/* Regular message */}
            <div
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end space-x-2 max-w-xs">
                {(message.sender === "bot" ||
                  message.sender === "whatsapp") && (
                  <div className="bg-purple-600 dark:bg-purple-600 rounded-full p-1 mb-1 flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-purple-600 dark:bg-purple-600 text-white rounded-br-md"
                      : message.sender === "whatsapp"
                      ? "dark:bg-purple-600 bg-purple-600 text-white rounded-bl-md cursor-pointer hover:bg-purple-800  transition-colors"
                      : "bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-md border border-gray-200 dark:border-slate-600"
                  }`}
                  onClick={
                    message.sender === "whatsapp"
                      ? handleWhatsAppClick
                      : undefined
                  }
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user" || message.sender === "whatsapp"
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="bg-gray-400 dark:bg-slate-600 rounded-full p-1 mb-1 flex-shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="bg-purple-600 dark:bg-purple-600 rounded-full p-1 mb-1 flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-md px-3 py-2 border border-gray-200 dark:border-slate-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask about DOOH"
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent max-h-20 min-h-[40px] transition-colors"
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default DOOHChatbot;
