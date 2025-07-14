import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { ContactInfo as ContactInfoType } from "../../types";

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

  const contactMethods = [
    {
      icon: "📧",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      gradient: "from-brand-teal to-brand-teal-light",
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
      value: `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zipCode}`,
      href: `https://maps.google.com/?q=${encodeURIComponent(
        `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zipCode}`
      )}`,
      gradient: "from-brand-orange to-brand-orange-light",
    },
  ];

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: "📘",
      url: contact.socialMedia.facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: "📷",
      url: contact.socialMedia.instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: "🐦",
      url: contact.socialMedia.twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "Discord",
      icon: "💬",
      url: contact.socialMedia.discord,
      color: "hover:text-indigo-600",
    },
  ].filter(platform => platform.url);

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
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-brand-blue/5 to-brand-teal/5 rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🕒</span>
                Office Hours
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{contact.officeHours.weekdays}</p>
                <p>{contact.officeHours.weekends}</p>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-brand-purple/5 to-brand-orange/5 rounded-2xl p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🌐</span>
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {socialPlatforms.map(platform => (
                  <motion.a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-xl text-gray-600 ${platform.color} transition-all duration-300 hover:shadow-lg`}
                    title={platform.name}
                  >
                    {platform.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Map or Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:sticky lg:top-8"
          >
            {showMap ? (
              /* Map Placeholder */
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-96 flex items-center justify-center border border-gray-200 overflow-hidden relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Interactive Map
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Find us in the heart of Austin
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(
                          `${contact.address.street}, ${contact.address.city}, ${contact.address.state} ${contact.address.zipCode}`
                        )}`,
                        "_blank"
                      )
                    }
                    className="bg-gradient-to-r from-brand-teal to-brand-blue text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Open in Maps
                  </motion.button>
                </div>

                {/* Decorative map elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-brand-orange rounded-full animate-pulse" />
                <div
                  className="absolute bottom-8 right-8 w-2 h-2 bg-brand-teal rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute top-1/3 right-1/4 w-2 h-2 bg-brand-purple rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                />
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-brand-teal to-brand-blue text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand-orange/5 via-brand-teal/5 to-brand-purple/5 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't wait for the next season to begin your journey with us. Join
              our community today and discover the joy of inclusive recreational
              sports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-brand-orange to-brand-teal text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Register Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-brand-teal text-brand-teal px-8 py-4 rounded-full font-semibold hover:bg-brand-teal hover:text-white transition-all duration-300"
              >
                Schedule a Visit
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
