import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Bed, ChefHat, Sofa, Bath, Frame, LayoutGrid, Gem, PlugZap, Check, MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServicePanel {
  id: string;
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

// importy obrazków
import bedroomImg from "../assets/bedroom.png";
import floorImg from "../assets/floor.png";
import kitchenImg from "../assets/kitchen.png";
import livingroomImg from "../assets/livingroom.png";
import moldingImg from "../assets/molding.png";
import plumbingImg from "../assets/plumbing.png";
import stoneFinishingImg from "../assets/StoneFinishing.png";
import bathRoom from "../assets/bathroom.png";

const servicesPanels: ServicePanel[] = [
  {
    id: "bedroom",
    image: bedroomImg,
    icon: Bed,
    title: "Bedroom Renovation",
    description:
      "Create your perfect private retreat with modern bedroom designs.",
    details: [
      "Custom closets and storage solutions",
      "Accent walls and ceiling treatments",
      "Lighting design for ambiance",
      "Flooring upgrades and refinishing",
      "Smart home integration",
    ],
  },
  {
    id: "kitchen",
    image: kitchenImg,
    icon: ChefHat,
    title: "Kitchen Remodeling",
    description:
      "Upgrade your kitchen with functional, stylish, and modern solutions.",
    details: [
      "Custom cabinetry and countertops",
      "Tile and backsplash installation",
      "Plumbing and appliance integration",
      "Lighting design and smart storage",
      "Flooring upgrades and wall finishes",
    ],
  },
  {
    id: "living-room",
    image: livingroomImg,
    icon: Sofa,
    title: "Living Room Makeover",
    description:
      "Transform your living space into a cozy and stylish environment.",
    details: [
      "Custom built-in shelving and cabinetry",
      "Fireplace renovations",
      "Window treatments and lighting",
      "Flooring and area rugs",
      "Paint and wall treatments",
    ],
  },
  {
    id: "bathroom",
    image: bathRoom,
    icon: Bath,
    title: "Bathroom Renovation",
    description:
      "Transform your bathroom into a relaxing and beautiful retreat.",
    details: [
      "Custom tile work – floors, showers, backsplashes",
      "Walk-in showers and freestanding tubs",
      "Vanity installation and plumbing updates",
      "Lighting, mirrors, and smart storage",
      "Waterproofing and subfloor leveling",
    ],
  },
  {
    id: "moulding",
    image: moldingImg,
    icon: Frame,
    title: "Moulding & Trim Work",
    description: "Add elegant details with custom moulding and trim finishes.",
    details: [
      "Crown molding and baseboards",
      "Wainscoting and paneling",
      "Door and window casings",
      "Custom millwork",
      "Painting and finishing",
    ],
  },
  {
    id: "flooring",
    image: floorImg,
    icon: LayoutGrid,
    title: "Flooring Installation & Repair",
    description: "Durable and stylish flooring solutions for every room.",
    details: [
      "Hardwood, laminate, and vinyl",
      "Tile and stone installation",
      "Floor leveling and repair",
      "Custom patterns and inlays",
      "Sanding and finishing",
    ],
  },
  {
    id: "stone-finishing",
    image: stoneFinishingImg,
    icon: Gem,
    title: "Stone Finishing & Installation",
    description: "Enhance your spaces with elegant stonework finishes.",
    details: [
      "Countertops and backsplashes",
      "Stone veneer and cladding",
      "Flooring and patios",
      "Restoration and sealing",
      "Custom stone features",
    ],
  },
  {
    id: "electricity-plumbing",
    image: plumbingImg,
    icon: PlugZap,
    title: "Electricity & Plumbing",
    description: "Reliable and safe electrical and plumbing services.",
    details: [
      "Wiring and electrical panel upgrades",
      "Lighting installation",
      "Pipe repair and replacement",
      "Fixture installation",
      "Code compliance and inspections",
    ],
  },
];

const operatingCities = [
  "San Francisco",
  "Oakland",
  "San Jose",
  "Berkeley",
  "Palo Alto",
  "Mountain View",
  "Sunnyvale",
  "Santa Clara",
  "Fremont",
  "Hayward",
  "San Mateo",
  "Redwood City",
  "Cupertino",
  "Milpitas",
  "Concord",
  "Richmond",
  "Walnut Creek",
  "Daly City",
  "San Rafael",
  "Santa Rosa",
];

// Jedna, prosta animacja: element wjeżdża lekko z dołu przy przewinięciu
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Services: React.FC = () => {
  return (
    <div className="bg-[#faf9f6] w-full font-family-serif4 text-[#313742]">
      {/* ===== Nagłówek strony ===== */}
      <section className="bg-[#12171b] text-white">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible"
            className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
            What We Do
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible"
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Our Services
          </motion.h1>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
          <motion.p variants={fadeUp} initial="hidden" animate="visible"
            className="mt-6 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            From a single room refresh to a complete remodel — one team, one point of contact,
            and craftsmanship you can see in every detail.
          </motion.p>
        </div>
      </section>

      {/* ===== Karty usług ===== */}
      <section className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {servicesPanels.map((panel, index) => (
            <motion.article
              key={panel.id}
              id={panel.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#ece8df] shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-60 sm:h-72 lg:h-80 overflow-hidden">
                <img
                  src={panel.image}
                  alt={panel.title}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow">
                  <panel.icon className="h-6 w-6 text-[#12171b]" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="absolute bottom-4 left-5 text-white/90 text-xs font-semibold tracking-[0.2em]">
                  {String(index + 1).padStart(2, "0")} / {String(servicesPanels.length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h2 className="text-2xl font-bold">{panel.title}</h2>
                <p className="mt-2 text-[#6b717b] leading-relaxed">{panel.description}</p>
                <ul className="mt-5 grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {panel.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5 text-[#4a505a]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF9800]/15">
                        <Check className="h-3 w-3 text-[#FF9800]" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="text-[0.95rem] leading-snug">{detail}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-auto pt-6 inline-flex items-center gap-1.5 self-start font-semibold text-[#313742] hover:text-[#FF9800] transition-colors"
                >
                  Request a quote <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== Obszar działania ===== */}
      <section className="bg-white border-y border-[#ece8df]">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
            Service Area
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">We Operate Across the Bay Area</h2>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto"
          >
            {operatingCities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#faf9f6] border border-[#ece8df] text-sm sm:text-base hover:border-[#FF9800] hover:text-[#FF9800] transition-colors cursor-default"
              >
                <MapPin className="h-3.5 w-3.5 text-[#FF9800]" strokeWidth={2} aria-hidden="true" />
                {city}
              </span>
            ))}
          </motion.div>
          <p className="mt-8 text-[#6b717b]">
            Don’t see your city? <Link to="/contact" className="font-semibold text-[#313742] underline hover:text-[#FF9800]">Ask us</Link> — we may still be able to help.
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="rounded-3xl bg-[#12171b] text-white px-6 sm:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Have a project in mind?</h2>
            <p className="mt-3 text-gray-400 text-base sm:text-lg">
              Tell us about it — we’ll get back to you within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/contact"
              className="rounded-full bg-[#FF9800] px-7 py-3.5 font-semibold text-white hover:bg-white hover:text-black transition">
              Get a Free Quote
            </Link>
            <Link to="/portfolio"
              className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white hover:border-white hover:bg-white/10 transition">
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;