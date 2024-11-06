"use client";

const ModelsNav = () => {
  const navItems = [
    { label: "Overview", isActive: true },
    { label: "Providers", isActive: false },
    { label: "Apps Using This", isActive: false },
    { label: "Parameters", isActive: false },
  ];

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
  ) => {
    e.preventDefault();
    const sectionId = label.toLowerCase().replace(/\s+/g, "-");
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="w-[252px] py-14">
      <ul className="flex flex-col">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href={`#${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={(e) => scrollToSection(e, item.label)}
              className={`
                flex items-center border-l-2 px-6
                py-2 transition-colors hover:bg-gray-50
                ${
                  item.isActive
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
