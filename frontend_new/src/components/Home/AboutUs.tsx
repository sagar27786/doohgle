import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Target,
  Users,
  Calendar,
  ArrowRight,
  Quote,
  Linkedin,
  Twitter,
  Mail,
  Lightbulb,
  Handshake,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

// Data can be defined outside the component for better organization
const teamMembers = [
  {
    name: "Marcus Rodriguez",
    position: "Founder & CTO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    bio: "Tech visionary with deep expertise in the DOOH and ad-tech landscape.",
    linkedin: "#",
    twitter: "#",
    email: "marcus@doohgle.com",
  },
  {
    name: "Emily Johnson",
    position: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    bio: "Creative director passionate about crafting intuitive and beautiful user experiences.",
    linkedin: "#",
    twitter: "#",
    email: "emily@doohgle.com",
  },
  {
    name: "David Kim",
    position: "VP of Sales",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Expert in forging strategic partnerships that drive sustainable, long-term growth.",
    linkedin: "#",
    twitter: "#",
    email: "david@doohgle.com",
  },
  {
    name: "Sarah Chen",
    position: "VP of Operations",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    bio: "Master of optimizing complex systems and processes for peak efficiency.",
    linkedin: "#",
    twitter: "#",
    email: "sarah@doohgle.com",
  },
];

const timelineEvents = [
  {
    year: "2019",
    title: "Company Founded",
    description: "Started with a vision to revolutionize DOOH advertising.",
  },
  {
    year: "2020",
    title: "First Platform Launch",
    description: "Launched our initial screen and content management platform.",
  },
  {
    year: "2022",
    title: "AI Integration",
    description: "Introduced AI-powered analytics for content optimization.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Expanded our network and operations to over 15 countries.",
  },
];

const stats = [
  { number: 18000, label: "Screens Powered", suffix: "+" },
  { number: 99.8, label: "Platform Uptime", suffix: "%" },
  { number: 24, label: "Hour Support", suffix: "/7" },
  { number: 4.9, label: "Client Rating", suffix: "★" },
];

const coreValues = [
  {
    icon: <Lightbulb className="h-8 w-8 text-purple-600" />,
    title: "Innovation First",
    description:
      "We constantly push the boundaries of what's possible in digital advertising technology.",
  },
  {
    icon: <Handshake className="h-8 w-8 text-purple-600" />,
    title: "Client Success",
    description:
      "Your success is our success. We are dedicated partners in achieving your growth.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    title: "Sustainable Growth",
    description:
      "We build robust and scalable solutions that evolve with your business needs.",
  },
];

const AboutUs = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const duration = 2000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          setCounters((prev) => {
            const newCounters = [...prev];
            const target = stat.number;
            const value = target * progress;
            newCounters[index] = Number(
              target % 1 === 0 ? Math.floor(value) : value.toFixed(1));
            return newCounters;
          });
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      });
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <motion.section
        className="px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center min-h-[90vh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "tween",
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96]
              }
            }
          }}
          className="text-5xl md:text-7xl font-bold mb-6 purple-gray-gradient bg-clip-text text-transparent"
        >
          About Doohgle Media
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
            }
          }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Revolutionizing Digital Out-of-Home advertising through innovative
          technology and creative, data-driven solutions.
        </motion.p>
      </motion.section>

      {/* Stats Section */}
      <section ref={sectionRef} className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="pt-20 max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800 text-center border border-gray-200 dark:border-slate-700"
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                {counters[i]}
                {stat.suffix}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <motion.section
        className="py-24 bg-gray-50 dark:bg-slate-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "spring",
                  duration: 0.6,
                  ease: "easeOut"
                }
              }
            }} 
            className="text-center mb-16"
          >
            <Target className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize DOOH advertising by providing cutting-edge
              technology that makes digital signage accessible, efficient, and
              impactful for businesses of all sizes.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
variants={{
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "tween",
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    } 
  }
}}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-slate-700 mb-6 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "tween",
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }
            }} 
            className="text-center mb-20"
          >
            <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A story of innovation, growth, and revolutionary changes in DOOH
              advertising.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-0 left-4 md:left-1/2 w-0.5 h-full bg-purple-200 dark:bg-slate-700 transform md:-translate-x-1/2"></div>
            <div className="space-y-12 md:space-y-16">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "tween",
                        duration: 0.6,
                        ease: [0.43, 0.13, 0.23, 0.96]
                      }
                    }
                  }}
                  className="relative"
                >
                  <div className="absolute left-4 top-1 md:left-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white dark:border-slate-900 transform -translate-x-1/2"></div>
                  <div
                    className={`pl-12 md:pl-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-8 md:ml-0" : "md:pl-8 md:ml-auto"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <p className="text-2xl font-bold text-purple-600 mb-2">
                        {event.year}
                      </p>
                      <h3 className="text-lg font-semibold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-24 bg-gray-50 dark:bg-slate-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }
            }}
            className="text-center mb-16"
          >
            <Users className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate individuals driving innovation at Doohgle Media.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
variants={{
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "tween",
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    } 
  }
}}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-purple-500 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-16">
                    {member.bio}
                  </p>
                  <div className="flex justify-center space-x-4">
                    {[
                      { href: member.linkedin, icon: <Linkedin /> },
                      { href: member.twitter, icon: <Twitter /> },
                      { href: `mailto:${member.email}`, icon: <Mail /> },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                        aria-label={member.name}
                      >
                        {React.cloneElement(social.icon, {
                          className: "h-5 w-5",
                        })}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "tween",
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }
            }}
          >
            <Quote className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your DOOH Strategy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join hundreds of businesses already revolutionizing their digital
              advertising with Doohgle Media.
            </p>
            <Link to="/auth">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(93, 29, 204, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Get Started Today</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
