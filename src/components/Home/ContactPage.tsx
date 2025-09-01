import React, { useRef, useState, FC } from "react";
import emailjs from "@emailjs/browser";

// --- SVG Icons ---
const MailIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-purple-600 dark:text-purple-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
  </svg>
);

const PhoneIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-purple-600 dark:text-purple-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.02.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const ArrowIcon: FC = () => (
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

type Status = "idle" | "loading" | "success" | "error";

// --- Main Contact Component ---
const ContactPage: FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    const formData = new FormData(form.current);
    const name = formData.get("user_name") as string;
    const email = formData.get("user_email") as string;
    const message = formData.get("message") as string;
    const industry = formData.get("industry") as string;

    if (!name.trim() || !email.trim() || !message.trim() || !industry) {
      setStatus("error");
      setStatusMessage("Please fill out all required fields.");
      return;
    }

    setStatus("loading");
    setStatusMessage("Sending...");

    // NOTE: Replace with your actual EmailJS credentials from environment variables
    const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID!;
    const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID!;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY!;

    if (!serviceID || !templateID || !publicKey) {
      setStatus("error");
      setStatusMessage(
        "EmailJS is not configured. Please check your environment variables."
      );
      console.error("EmailJS credentials missing in environment variables.");
      return;
    }

    emailjs.sendForm(serviceID, templateID, form.current, publicKey).then(
      () => {
        setStatus("success");
        setStatusMessage(
          "Message sent successfully! We will get back to you soon."
        );
        form.current?.reset();
        setTimeout(() => setStatus("idle"), 5000);
      },
      (error) => {
        setStatus("error");
        setStatusMessage("Failed to send message. Please try again later.");
        console.error("EMAILJS FAILED...", error.text);
      }
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto bg-white dark:bg-slate-800/50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 grid md:grid-cols-2">
        {/* Left Column: Information */}
        <div className="p-8 sm:p-12 lg:p-16 text-gray-800 dark:text-gray-200 md:border-r md:border-gray-200 md:dark:border-slate-700">
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
            We're here to help you
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
            Digital Out-of-Home solutions — Whether you’re here to advertise or
            manage screens, we’re ready to help.
          </p>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-slate-700 p-3 rounded-full">
                <MailIcon />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  E-mail
                </p>
                <a
                  href="mailto:soluvent***@gmail.com"
                  className="text-lg text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  soluvent***@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-slate-700 p-3 rounded-full">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Phone number
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-lg text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  +123 - 456 - 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-gray-50/50 dark:bg-slate-900 p-8 sm:p-12 lg:p-16">
          <form ref={form} onSubmit={sendEmail} noValidate>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="user_name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  required
                  className="mt-1 block w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded-lg py-3 px-4 text-gray-800 dark:text-gray-200 
  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent 
  hover:border-purple-400 dark:hover:border-purple-500 
  transition duration-200 ease-in-out"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="user_email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  id="user_email"
                  required
                  className="mt-1 block w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded-lg py-3 px-4 text-gray-800 dark:text-gray-200 
  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent 
  hover:border-purple-400 dark:hover:border-purple-500 
  transition duration-200 ease-in-out"
                />
              </div>

              {/* Industry Field */}
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry
                </span>
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  {["Advertiser", "Screen Owner", "Other"].map((option) => (
                    <label key={option} className="relative block flex-1">
                      <input
                        type="radio"
                        name="industry"
                        value={option}
                        className="peer sr-only"
                        required
                      />
                      <div className="whitespace-nowrap w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-center cursor-pointer peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-checked:text-white transition-all duration-200 shadow-sm hover:border-purple-400">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>

                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="mt-1 block w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 rounded-lg py-3 px-4 text-gray-800 dark:text-gray-200 
  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent 
  hover:border-purple-400 dark:hover:border-purple-500 
  transition duration-200 ease-in-out"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-300 ease-in-out disabled:bg-purple-400 disabled:cursor-not-allowed group"
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
              className={`mt-4 text-center p-3 rounded-lg text-sm transition-opacity duration-300 ${
                status === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  : ""
              } ${
                status === "error"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                  : ""
              }`}
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
