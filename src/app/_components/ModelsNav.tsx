"use client";

import { useEffect, useRef, useState } from "react";

const ModelsNav = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const sections = useRef<Element[]>([]);

  const navItems = [{ label: "Overview" }, { label: "Code Samples" }];

  const handleScroll = () => {
    const pageYOffset = window.scrollY;
    let newActiveSection = "overview";

    sections.current.forEach((section) => {
      const sectionOffsetTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).offsetHeight;

      if (
        pageYOffset >= sectionOffsetTop - 200 && // offset for header
        pageYOffset < sectionOffsetTop + sectionHeight - 200
      ) {
        newActiveSection = section.id;
      }
    });

    setActiveSection(newActiveSection);
  };

  useEffect(() => {
    // Convert NodeList to Array for easier handling
    sections.current = Array.from(document.querySelectorAll("[data-section]"));
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
  ) => {
    e.preventDefault();
    const sectionId = label.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(sectionId);

    if (element) {
      const offset = 200; // Adjust based on header height
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky h-fit animate-slide-in-delay py-4">
      <ul className="flex flex-col">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href={`#${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={(e) => scrollToSection(e, item.label)}
              className={`
                hover:mf-milk-300 flex items-center border-l-2
                px-6 py-2 transition-colors
                ${
                  activeSection ===
                  item.label.toLowerCase().replace(/\s+/g, "-")
                    ? "border-black text-black"
                    : "border-gray-400 text-gray-400 hover:text-gray-600"
                }
              `}
            >
              <span className="text-base font-medium">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ModelsNav;
