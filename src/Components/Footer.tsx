import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#12171b] w-full py-6 px-4 flex flex-col items-center text-center">
      <p className="text-gray-400 text-sm sm:text-base leading-snug">
        © {new Date().getFullYear()} Oraczewski Interiors Inc. All Rights Reserved.
      </p>

      <nav className="flex flex-wrap justify-center gap-4 mt-2 text-gray-500 text-xs sm:text-sm">
        <Link to="/Privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <span className="hidden sm:inline">|</span>
        <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
        <span className="hidden sm:inline">|</span>
        <Link to="/AdminLogin" className="hover:text-white transition-colors">Admin</Link>
      </nav>
    </footer>
  );
};

export default Footer;