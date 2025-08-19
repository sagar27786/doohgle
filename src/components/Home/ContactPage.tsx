import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// --- SVG Icons ---
// You can keep these in the component file or move them to a separate icons file.

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-blue-600"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-blue-600"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    ></path>
  </svg>
);

// --- Main Contact Component ---

const ContactPage = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Validation ---
    if (!form.current) return;
    const formData = new FormData(form.current);
    const name = formData.get("user_name") as string;
    const email = formData.get("user_email") as string;
    const message = formData.get("message") as string;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setStatusMessage("Please fill out all required fields.");
      return;
    }

    setStatus("loading");
    setStatusMessage("Sending...");

    // --- EmailJS Integration ---
    // These values should come from your .env.local file
    const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID as string;
    const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY as string;

    if (!serviceID || !templateID || !publicKey) {
      setStatus("error");
      setStatusMessage(
        "EmailJS credentials are not configured. Please check your .env file."
      );
      console.error("EmailJS credentials missing in .env.local file");
      return;
    }

    emailjs.sendForm(serviceID, templateID, form.current, publicKey).then(
      () => {
        setStatus("success");
        setStatusMessage(
          "Message sent successfully! We will get back to you soon."
        );
        form.current?.reset();
      },
      (error) => {
        setStatus("error");
        setStatusMessage("Failed to send message. Please try again later.");
        console.error("EMAILJS FAILED...", error.text);
      }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* Left Column: Information */}
        <div className="p-8 sm:p-12 lg:p-16 text-gray-800">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            We're here to help you
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-gray-600 leading-relaxed mb-10">
            Digital Out-of-Home solutions — Whether you’re here to advertise or
            manage screens, we’re ready to help.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <MailIcon />
              <div>
                <p className="text-gray-500 font-medium">E-mail</p>
                <a
                  href="mailto:soluvent***@gmail.com"
                  className="text-lg text-gray-800 hover:text-blue-600 transition-colors"
                >
                  soluvent***@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PhoneIcon />
              <div>
                <p className="text-gray-500 font-medium">Phone number</p>
                <a
                  href="tel:+1234567890"
                  className="text-lg text-gray-800 hover:text-blue-600 transition-colors"
                >
                  +123 - 456 - 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white p-8 sm:p-12 lg:p-16">
          <form ref={form} onSubmit={sendEmail} noValidate>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="user_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  required
                  className="mt-1 block w-full bg-gray-100 border-transparent rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Jane Smith"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="user_email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  required
                  className="mt-1 block w-full bg-gray-100 border-transparent rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="jane@email.com"
                />
              </div>

              {/* Industry Field */}
              <div>
                {/* Industry Field - Radio Buttons */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Industry
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    {["Advertiser", "Screen Owner", "Other"].map((option) => (
                      <label key={option} className="relative block">
                        <input
                          type="radio"
                          name="industry"
                          value={option}
                          className="peer sr-only"
                          required
                        />
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-center cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white transition-all duration-200 shadow-sm hover:shadow-md">
                          {option}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="mt-1 block w-full bg-gray-100 border-transparent rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Type your message"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed group"
                >
                  {status === "loading" ? "Sending..." : "Get a Solution"}
                  <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Status Message */}
          {status !== "idle" && (
            <div
              className={`mt-4 text-center p-3 rounded-lg text-sm ${
                status === "success" ? "bg-green-100 text-green-800" : ""
              } ${status === "error" ? "bg-red-100 text-red-800" : ""}`}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
