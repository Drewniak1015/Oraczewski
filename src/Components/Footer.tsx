import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import instagram from "../assets/instagram-svgrepo-com.svg";

const INSTAGRAM_URL = "https://www.instagram.com/monaamer_interior/";

const pages = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Contact us", path: "/contact" },
];

const serviceLinks = [
  { name: "Kitchen Remodeling", id: "kitchen" },
  { name: "Bathroom Renovation", id: "bathroom" },
  { name: "Flooring", id: "flooring" },
  { name: "Moulding & Trim", id: "moulding" },
  { name: "Stone Finishing", id: "stone-finishing" },
];

const Footer = () => {
  const linkClass = "text-gray-400 hover:text-[#FF9800] transition-colors";

  return (
    <footer className="bg-[#0d1114] text-white font-family-serif4">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marka */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="Oraczewski Interiors – home">
              <img src={Logo} alt="Oraczewski Interiors" className="h-16 w-auto" />
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed text-sm">
              Family-owned interior finishing and remodeling — European craftsmanship for homes
              across the Bay Area.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#FF9800] transition">
              <img src={instagram} alt="" className="h-5 w-5 invert" />
            </a>
          </div>

          {/* Strony */}
          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF9800]">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {pages.map((p) => (
                <li key={p.path}><Link to={p.path} className={linkClass}>{p.name}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Usługi */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF9800]">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.id}><Link to={`/services#${s.id}`} className={linkClass}>{s.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FF9800]">Get in touch</h3>
            <ul className="mt-4 space-y-2.5 text-gray-400">
              <li>San Jose, California</li>
              <li>Serving the entire Bay Area</li>
              <li>Mon–Sat, 8:00 AM – 6:00 PM</li>
            </ul>
            <Link to="/contact"
              className="mt-5 inline-block rounded-full bg-[#FF9800] px-6 py-2.5 text-sm font-semibold hover:bg-white hover:text-black transition">
              Free Consultation
            </Link>
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Oraczewski Interiors Inc. All rights reserved.</p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link to="/Privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link to="/AdminLogin" className="hover:text-white transition-colors">Admin</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;