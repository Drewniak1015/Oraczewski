import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/oraczewski-logo-biale.svg";
// Font nagłówka – instalacja: npm install @fontsource/montserrat
import "@fontsource/montserrat/500.css";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Contact us", path: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // zamknij menu po zmianie podstrony
  useEffect(() => setOpen(false), [pathname]);

  // efekt szkła po przewinięciu strony
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // blokada przewijania strony, gdy menu mobilne jest otwarte
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const glass = scrolled || open;

  return (
    <header
      className={`sticky top-0 left-0 z-[100] w-full h-[6rem] flex justify-center items-center font-['Montserrat',sans-serif] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-out border-b ${
        glass
          ? "bg-[#0d1114]/75 backdrop-blur-xl backdrop-saturate-150 border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          : "bg-black border-transparent"
      }`}
    >
      <div className="w-full max-w-[1320px] px-4 sm:px-6 flex justify-between items-center">
        {/* Logo – lekko zmniejsza się po przewinięciu */}
        <Link to="/" aria-label="Oraczewski Interiors – home" className="shrink-0">
          <img
            src={Logo}
            alt="Oraczewski Interiors"
            className={`h-[3.5rem] sm:h-[4.5rem] md:h-[5.25rem] w-auto origin-left transition-transform duration-500 ease-out ${
              scrolled ? "scale-[0.85]" : "scale-100"
            }`}
          />
        </Link>

        {/* Menu – komputer */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <ul className="flex items-center gap-6 lg:gap-10 text-white text-[0.85rem] lg:text-[0.9rem] font-medium uppercase tracking-[0.14em]">
            {navItems.map(({ name, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/"}
                  className={({ isActive }) =>
                    `group relative py-2 transition-colors duration-300 hover:text-[#FF9800] ${
                      isActive ? "text-[#FF9800]" : "text-white/90"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {name}
                      {/* podkreślenie rozjeżdżające się od środka */}
                      <span
                        className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-center bg-[#FF9800] transition-transform duration-300 ease-out ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center rounded-full bg-[#FF9800] px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-black transition-colors duration-300"
          >
            Free Quote
          </Link>
        </nav>

        {/* Hamburger – telefon */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative h-11 w-11 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <span className={`absolute h-[2px] w-6 bg-white rounded transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[7px]"}`} />
          <span className={`absolute h-[2px] w-6 bg-white rounded transition-all duration-300 ${open ? "opacity-0 scale-x-0" : "opacity-100"}`} />
          <span className={`absolute h-[2px] w-6 bg-white rounded transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[7px]"}`} />
        </button>
      </div>

      {/* Menu – telefon (szklany panel) */}
      <div
        className={`md:hidden absolute top-[6rem] left-0 w-full h-[calc(100dvh-6rem)] bg-[#0d1114]/90 backdrop-blur-xl transition-all duration-300 ease-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <ul className="flex flex-col px-6 pt-6 text-white text-lg font-medium uppercase tracking-[0.14em]">
          {navItems.map(({ name, path }, i) => (
            <li
              key={path}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={`border-b border-white/10 transition-all duration-300 ease-out ${
                open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
            >
              <NavLink
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between py-5 transition-colors ${
                    isActive ? "text-[#FF9800]" : "hover:text-[#FF9800]"
                  }`
                }
              >
                {name}
                <span aria-hidden="true" className="text-white/40">→</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="px-6 pt-8">
          <Link
            to="/contact"
            className="block text-center rounded-full bg-[#FF9800] py-4 font-semibold uppercase tracking-[0.12em] text-white"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;