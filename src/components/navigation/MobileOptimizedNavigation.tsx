import React, { useEffect, useState } from "react";
import { usePlatform } from "../../hooks/usePlatform";
import { MenuItem, NavigationProps } from "../../types";

// Simplified navigation for mobile devices that removes dropdown complexity
const MobileOptimizedNavigation: React.FC<
  NavigationProps & { children?: React.ReactNode }
> = ({ logo, menuItems, currentRoute = "", children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const platform = usePlatform();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    setIsScrolled(window.scrollY > 50);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Flatten menu items to remove dropdown complexity
  const flattenedMenuItems: MenuItem[] = [];
  menuItems.forEach(item => {
    if (item.hasDropdown && item.dropdownItems) {
      // Add main item first
      flattenedMenuItems.push({
        ...item,
        hasDropdown: false,
        href: item.href || item.dropdownItems[0]?.href || "#",
      });
      // Add dropdown items as separate menu items
      item.dropdownItems.forEach(dropdownItem => {
        flattenedMenuItems.push({
          ...dropdownItem,
          label: `${dropdownItem.label}`, // Could prefix with parent: `${item.label} ${dropdownItem.label}`,
          hasDropdown: false,
        });
      });
    } else {
      flattenedMenuItems.push(item);
    }
  });

  const shouldBeTransparent = currentRoute === "#home" && !isScrolled;

  return (
    <>
      {/* Simplified top navigation - only show on desktop or when needed */}
      {!platform.isMobile && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            shouldBeTransparent
              ? "bg-transparent"
              : "bg-white/95 backdrop-blur-md shadow-lg"
          }`}
          style={{
            paddingTop: "var(--safe-area-inset-top)",
          }}
        >
          <div
            className="container-custom"
            style={{
              paddingLeft: "max(1rem, var(--safe-area-inset-left))",
              paddingRight: "max(1rem, var(--safe-area-inset-right))",
            }}
          >
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/" className="flex items-center">
                  <img
                    src={logo}
                    alt="Out Sports League"
                    className="h-10 w-auto"
                  />
                  <span
                    className={`ml-3 text-lg font-display font-bold ${
                      shouldBeTransparent ? "text-white" : "text-gradient-brand"
                    }`}
                  >
                    Out Sports League
                  </span>
                </a>
              </div>

              {/* Simplified Menu Items */}
              <div className="flex items-center space-x-6">
                {flattenedMenuItems.slice(0, 4).map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      shouldBeTransparent
                        ? "text-white/90 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    } ${item.isActive ? "text-brand-blue" : ""}`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Content with appropriate spacing */}
      <div
        className={platform.isMobile ? "pb-20" : "pt-16"}
        style={{
          paddingBottom:
            platform.isMobile && platform.isNative
              ? "calc(5rem + env(safe-area-inset-bottom))"
              : platform.isMobile
              ? "5rem"
              : "0",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default MobileOptimizedNavigation;
