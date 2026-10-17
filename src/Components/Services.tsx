import React from "react";
import { motion } from "framer-motion";

interface ServicePanel {
  id: string;
  image: string;
  icon: string;
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
    icon: "🛏️",
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
    icon: "🛠️",
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
    icon: "🛋️",
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
    icon: "🛁",
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
    icon: "🪚",
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
    icon: "🪵",
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
    icon: "🪨",
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
    icon: "🔌",
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

const Services: React.FC = () => {
  return (
    <div className="services-page max-w-[80rem] mx-auto px-6 py-10 bg-white shadow-2xl">
      {/* Nagłówek */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl font-extrabold mb-12 text-gray-800 text-center"
      >
        Our Services
      </motion.h1>

      {/* Karty usług */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {servicesPanels.map((panel, index) => (
          <motion.div
            key={panel.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
            }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300"
          >
            <div className="relative h-72 md:h-[28rem]">
              <img
                src={panel.image}
                alt={panel.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm text-white text-3xl p-3 rounded-full">
                {panel.icon}
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {panel.title}
              </h2>
              <p className="mb-5 text-gray-600">{panel.description}</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {panel.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Miasta */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          We Operate In These Cities
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {operatingCities.map((city, i) => (
            <motion.span
              key={city}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full shadow cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, backgroundColor: "#e2e8f0" }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              {city}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;