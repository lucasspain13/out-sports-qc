import { ChevronDown, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "../../types";
import { LiveScoreWidget } from "../ui";

const Navigation: React.FC<NavigationProps> = ({
  logo,
  menuItems,
  isScrolled: propIsScrolled,
  onMenuToggle,
  showLiveScores = false,
  currentRoute = "#home",
}) => {
  const [isScrolled, setIsScrolled] = useState(propIsScrolled || false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Determine if we need dark text (not on home page OR scrolled)
  const needsDarkText = currentRoute !== "#home" || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    if (propIsScrolled === undefined) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [propIsScrolled]);

  // Close dropdown when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [currentRoute]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        activeDropdown &&
        !target.closest(".relative") &&
        !target.closest(".dropdown-container")
      ) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle?.();
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              {/* White circle behind logo */}
              <div className="relative flex items-center justify-center">
                <div className="absolute bg-white rounded-full w-10 h-10 shadow-sm"></div>
                <img
                  src={logo}
                  alt="Out Sports League"
                  className="relative h-10 w-auto z-10"
                />
              </div>
              <span
                className={`ml-3 text-xl font-display font-bold transition-colors duration-300 ${
                  needsDarkText ? "text-gray-900" : "text-white"
                }`}
              >
                Out Sports League
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(item.label);
                      }}
                      type="button"
                      aria-expanded={activeDropdown === item.label}
                      aria-haspopup="true"
                      className={`nav-link nav-link-hover flex items-center space-x-1 ${
                        needsDarkText ? "text-gray-900" : "text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {activeDropdown === item.label && item.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        {item.dropdownItems.map(dropdownItem => (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-2 text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href || "#"}
                    className={`nav-link nav-link-hover ${
                      needsDarkText ? "text-gray-900" : "text-white"
                    } ${item.isActive ? "text-brand-teal" : ""}`}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            {/* Live Score Widget */}
            {showLiveScores && (
              <div className="ml-4">
                <LiveScoreWidget isDarkMode={needsDarkText} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${
                needsDarkText ? "text-gray-900" : "text-white"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map(item => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDropdown(item.label);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md flex items-center justify-between"
                        type="button"
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === item.label && item.dropdownItems && (
                        <div className="pl-4 space-y-1">
                          {item.dropdownItems.map(dropdownItem => (
                            <a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMobileMenuOpen(false);
                              }}
                              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                              {dropdownItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href || "#"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md ${
                        item.isActive ? "text-brand-teal" : ""
                      }`}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
