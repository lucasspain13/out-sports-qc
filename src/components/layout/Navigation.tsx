import { ChevronDown, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavigationProps } from "../../types";

const Navigation: React.FC<NavigationProps> = ({
  logo,
  menuItems,
  isScrolled: propIsScrolled,
  onMenuToggle,
}) => {
  const [isScrolled, setIsScrolled] = useState(propIsScrolled || false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
              <img src={logo} alt="Out Sports League" className="h-12 w-auto" />
              <span className="ml-3 text-xl font-display font-bold text-gradient-brand">
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
                      onClick={() => toggleDropdown(item.label)}
                      className={`nav-link nav-link-hover flex items-center space-x-1 ${
                        isScrolled ? "text-gray-900" : "text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {activeDropdown === item.label && item.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                        {item.dropdownItems.map(dropdownItem => (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.href}
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
                    href={item.href}
                    className={`nav-link nav-link-hover ${
                      isScrolled ? "text-gray-900" : "text-white"
                    } ${item.isActive ? "text-brand-teal" : ""}`}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
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
                        onClick={() => toggleDropdown(item.label)}
                        className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {activeDropdown === item.label && item.dropdownItems && (
                        <div className="pl-4 space-y-1">
                          {item.dropdownItems.map(dropdownItem => (
                            <a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
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
                      href={item.href}
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
