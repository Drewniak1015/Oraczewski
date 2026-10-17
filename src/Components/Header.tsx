import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import notesSVG from "../assets/notes.svg";
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
  const [visible, setVisible] = useState(false); // było: useState<Boolean> (zły typ)
  const { pathname } = useLocation();

  // zamknij menu po zmianie podstrony
  useEffect(() => setVisible(false), [pathname]);

  return (
    <header className="w-full h-[6rem] bg-black flex justify-center items-center sticky top-0 left-0 z-[100]">
      <div className="w-full max-w-[1320px] px-4 flex justify-between items-center">
        <Link to="/">
          <img src={Logo} alt="Oraczewski Interiors" className="h-[3.5rem] sm:h-[4.5rem] md:h-[5.5rem]" />
        </Link>

        <button
          type="button"
          aria-label={visible ? "Close menu" : "Open menu"}
          aria-expanded={visible}
          className="md:hidden p-1"
          onClick={() => setVisible((v) => !v)}
        >
          <img src={notesSVG} alt="" className="w-11 h-11" />
        </button>

        <nav>
          <ul
            className={`
              text-white text-[0.95rem] lg:text-[1rem] font-['Montserrat',sans-serif] font-medium uppercase tracking-[0.12em]
              absolute top-[6rem] left-0 w-full bg-black py-2
              transition-transform duration-300 ease-in-out
              ${visible ? "translate-x-0" : "-translate-x-full"}
              md:static md:flex md:items-center md:gap-8 lg:gap-14 md:translate-x-0 md:w-auto md:bg-transparent md:py-0
            `}
          >
            {navItems.map(({ name, path }) => (
              <li key={path} className="border-b border-white/20 md:border-none">
                <NavLink
                  to={path}
                  end={path === "/"}
                  className={({ isActive }) =>
                    `block px-4 py-3 md:p-0 transition duration-300 hover:text-[#FF9800] ${
                      isActive ? "text-[#FF9800]" : ""
                    }`
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;