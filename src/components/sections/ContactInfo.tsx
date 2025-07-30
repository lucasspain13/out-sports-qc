import { motion, useInView } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { ContactInfo as ContactInfoType, GameLocation } from "../../types";
import LocationMap from "../ui/LocationMap";
import { getAllLocations } from "../../data/supabase";

interface ContactInfoProps {
  contact: ContactInfoType;
  title?: string;
  subtitle?: string;
  showMap?: boolean;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contact,
  title = "Get In Touch",
  subtitle = "Ready to join our community? We'd love to hear from you!",
  showMap = true,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [gameLocations, setGameLocations] = useState<GameLocation[]>([]);

  // Load locations from database
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await getAllLocations();
        setGameLocations(locations);
      } catch (error) {
        console.error("Failed to load locations:", error);
      }
    };
    loadLocations();
  }, []);

  const contactMethods = [
    {
      icon: "📧",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      gradient: "bg-gradient-primary",
    },
    {
      icon: "📞",
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone}`,
      gradient: "from-brand-blue to-brand-blue-light",
    },
    {
      icon: "📍",
      label: "Address",
      value: "Quad Cities, IA/IL",
      href: "https://www.google.com/maps/search/?api=1&query=41.55526369651487,-90.57899561557102",
      gradient: "from-brand-orange to-brand-orange-light",
    },
  ];

  return (
    <section className={`py-20 bg-white ${className}`} ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Facebook */}
            {contact.socialMedia.facebook && (
              <motion.a
                href={contact.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Facebook</h3>
                  <p className="text-gray-600 text-sm">Follow us on Facebook</p>
                </div>
                <div className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </motion.a>
            )}

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.label === "Address" ? "_blank" : undefined}
                  rel={
                    method.label === "Address"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                      {method.label}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                      {method.value}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </motion.a>
              ))}
            </div>



          </motion.div>

          {/* Map or Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:sticky lg:top-8"
          >
            {showMap ? (
              /* Quad Cities Locations Map */
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Our Locations
                  </h3>
                  <p className="text-gray-600">
                    Find us throughout the Quad Cities, IA/IL
                  </p>
                </div>
                <div className="relative">
                  <LocationMap
                    locations={gameLocations}
                    height="400px"
                    showAllMarkers={true}
                  />
                </div>
              </div>
            ) : (
              /* Quick Contact Form */
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a message
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
                      placeholder="OutSportsQC@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-primary text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* Removed Bottom CTA - contact info is sufficient call to action */}
      </div>
    </section>
  );
};

export default ContactInfo;
