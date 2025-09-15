"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

// --- SVG Icons ---
const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
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
    setStatusMessage("Sending your message...");

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

    if (!serviceID || !templateID || !publicKey) {
      setStatus("error");
      setStatusMessage("EmailJS credentials are not configured correctly.");
      console.error("EmailJS credentials missing in environment variables.");
      return;
    }

    emailjs.sendForm(serviceID, templateID, form.current, publicKey).then(
      () => {
        setStatus("success");
        setStatusMessage("Message sent successfully! We'll be in touch soon.");
        form.current?.reset();
      },
      (error) => {
        setStatus("error");
        setStatusMessage("Failed to send the message. Please try again.");
        console.error("EMAILJS FAILED...", error.text);
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(#8A2BE2_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden grid md:grid-cols-2"
      >
        {/* Left Column: Information */}
        <div className="p-8 sm:p-12 text-gray-200">
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">
            Let's build together
          </p>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-slate-300 leading-relaxed mb-10">
            Have a question, a project idea, or just want to say hi? We'd love
            to hear from you. Fill out the form, and we'll get back to you as
            soon as possible.
          </p>

          <div className="space-y-8">
            <ContactInfo
              icon={<MailIcon />}
              title="Email Us"
              value="soluvent***@gmail.com"
              href="mailto:soluvent***@gmail.com"
            />
            <ContactInfo
              icon={<PhoneIcon />}
              title="Call Us"
              value="+123-456-7890"
              href="tel:+1234567890"
            />
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-12 bg-slate-800/30">
          <form ref={form} onSubmit={sendEmail} noValidate>
            <div className="space-y-6">
              <FormField
                id="user_name"
                name="user_name"
                label="Full Name"
                placeholder="Jane Smith"
              />
              <FormField
                id="user_email"
                name="user_email"
                type="email"
                label="Email Address"
                placeholder="jane@email.com"
              />
              <RadioGroup />
              <FormField
                id="message"
                name="message"
                label="Message"
                type="textarea"
                placeholder="How can we help you today?"
              />

              <div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-300 ease-in-out disabled:bg-purple-800 disabled:cursor-not-allowed group"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </form>

          {status !== "idle" && (
            <div
              className={`mt-4 text-center p-3 rounded-lg text-sm ${
                status === "success"
                  ? "bg-green-900/50 text-green-300"
                  : "bg-red-900/50 text-red-300"
              }`}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Helper Components for Form Fields ---

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

const FormField = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
}: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-slate-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        id={id}
        required
        rows={5}
        className="mt-2 block w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        placeholder={placeholder}
      ></textarea>
    ) : (
      <input
        type={type}
        name={name}
        id={id}
        required
        className="mt-2 block w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        placeholder={placeholder}
      />
    )}
  </div>
);

const RadioGroup = () => (
  <div>
    <span className="text-sm font-medium text-slate-300">Industry</span>
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
          <div className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-200 text-center cursor-pointer peer-checked:bg-purple-600 peer-checked:border-purple-500 peer-checked:text-white transition-all duration-200 shadow-sm hover:border-slate-500">
            {option}
          </div>
        </label>
      ))}
    </div>
  </div>
);

type ContactInfoProps = {
  icon: React.ReactElement;
  title: string;
  value: string;
  href: string;
};

const ContactInfo = ({ icon, title, value, href }: ContactInfoProps) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-purple-900/50 text-purple-400 rounded-full flex items-center justify-center ring-2 ring-purple-500/30">
      {React.cloneElement(icon, { className: "h-6 w-6" })}
    </div>
    <div>
      <p className="text-slate-400 font-medium">{title}</p>
      <a
        href={href}
        className="text-lg text-gray-200 hover:text-purple-400 transition-colors"
      >
        {value}
      </a>
    </div>
  </div>
);

export default ContactPage;
