import { useEffect, useState } from "react";
import Karuzela1 from "../assets/Karuzela1.png";
import Karuzela2 from "../assets/Karuzela2.png";
import Karuzela3 from "../assets/Karuzela3.png";
import Karuzela4 from "../assets/Karuzela4.png";
import Karuzela5 from "../assets/Karuzela5.png";
import Karuzela6 from "../assets/Karuzela6.png";
import Karuzela7 from "../assets/Karuzela7.png";
import HomeImage2 from "../assets/HomeImg2.jpg";
import partner from "../assets/partner.svg";
import tools from "../assets/tools.svg";
import services from "../assets/services.svg";
import idea from "../assets/idea.svg";
import aboutUs1 from "../assets/aboutUs1.png";
import aboutUs2 from "../assets/aboutUs2.png";
import aboutUs3 from "../assets/aboutUs3.png";
import aboutUs4 from "../assets/aboutUs4.png";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const backgrounds = [
  Karuzela1,
  Karuzela2,
  Karuzela3,
  Karuzela4,
  Karuzela5,
  Karuzela6,
  Karuzela7,
];

// Kroki sekcji "How It Works"
const processSteps = [
  {
    img: aboutUs1,
    icon: idea,
    title: "Let's Talk Vision",
    text: "We start with a conversation about your style, needs and how you use the space — so your vision is clear from day one.",
  },
  {
    img: aboutUs2,
    icon: partner,
    title: "Plan & Agreement",
    text: "You get a clear plan, budget and timeline in writing. Fully transparent, no hidden costs, no surprises.",
  },
  {
    img: aboutUs3,
    icon: services,
    title: "Design & Preparation",
    text: "We select materials, finalize layouts and prepare every detail needed to bring your concept to life.",
  },
  {
    img: aboutUs4,
    icon: tools,
    title: "Execution",
    text: "Our team handles the entire build with precision and care — delivering high-quality results, on time.",
  },
];

const Home = () => {
  // Poprzednio: handleChange wołane WEWNĄTRZ setState (efekt uboczny w updaterze,
  // nieaktualne wartości stanu, w StrictMode podwójne wywołania). Wystarczy samo:
  const [slide, setSlide] = useState(0);
  const backgroundImg = backgrounds[slide];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Wczytaj wszystkie zdjęcia karuzeli z wyprzedzeniem -> brak "mrugnięcia"
  useEffect(() => {
    backgrounds.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay: i * 0.1 },
    }),
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative w-full h-[calc(100svh-6rem)] min-h-[34rem] overflow-hidden bg-black">
        {/* Zdjęcia: płynne przenikanie + delikatne, powolne przybliżenie */}
        <AnimatePresence initial={false}>
          <motion.div
            key={backgroundImg}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1, ease: "easeInOut" },
              scale: { duration: 6, ease: "easeOut" },
            }}
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImg})` }}
          />
        </AnimatePresence>

        {/* Przyciemnienie – mocniejsze na dole i po bokach, tekst zawsze czytelny */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

        {/* Treść */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/90"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF9800]" />
            Interior Finishing · Bay Area, CA
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mt-6 max-w-5xl text-[2.4rem] leading-[1.05] sm:text-6xl lg:text-7xl font-bold text-white font-family-Geologica tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          >
            Top Quality Interiors
            <br />
            <span className="text-[#FF9800]">in California</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-white/85 leading-relaxed font-family-serif4"
          >
            From kitchens and bathrooms to complete remodels — European craftsmanship for homes
            across the entire Bay Area.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex w-full flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#FF9800] px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-[0_10px_30px_-8px_rgba(255,152,0,0.7)] hover:bg-white hover:text-black transition-colors duration-300"
            >
              Start Your Renovation
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 text-base sm:text-lg font-semibold text-white hover:bg-white/20 hover:border-white/60 transition-colors duration-300"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>

        {/* Dół: kropki slajdów */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === slide ? "w-10 bg-[#FF9800]" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Wskazówka przewijania (komputer) */}
        <div className="hidden md:flex absolute bottom-7 right-8 z-20 flex-col items-center gap-2 text-white/60 text-[0.65rem] uppercase tracking-[0.3em]">
          <span>Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/20">
            <span className="absolute left-0 top-0 h-4 w-px bg-white animate-[scrollhint_1.8s_ease-in-out_infinite]" />
          </span>
          <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}100%{transform:translateY(250%)}}`}</style>
        </div>
      </section>

      {/* ===== WELCOME ===== */}
      <section className="bg-[#faf9f6] w-full py-20 md:py-28 font-family-serif4 text-[#313742]">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
              Welcome
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Where all-inclusive design meets home quality
            </h2>
            <div className="mt-6 h-[2px] w-16 bg-[#FF9800]" />
            <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-[#4a505a]">
              <p>
                Oraczewski Interiors is a team with a passion for creating elegant, functional and
                timeless living spaces across the Bay Area. Our tailored process is made for people
                who value professionalism, transparency and a full-service experience.
              </p>
              <p>
                From concept to completion, we balance aesthetics and practicality — crafting spaces
                that reflect each client’s unique lifestyle and taste, with meticulous project
                management and trusted architects at our side.
              </p>
            </div>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {["Full-service, start to finish", "Transparent pricing", "European craftsmanship", "Projects across the Bay Area"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[#313742] font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF9800]/15 text-[#FF9800] text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/about"
                className="text-center rounded-full bg-[#12171b] px-7 py-3.5 font-semibold text-white hover:bg-[#FF9800] transition">
                About Our Team
              </Link>
              <Link to="/portfolio"
                className="text-center rounded-full border border-[#313742]/25 px-7 py-3.5 font-semibold hover:border-[#FF9800] hover:text-[#FF9800] transition">
                View Portfolio
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border-2 border-[#FF9800]/60 hidden sm:block" />
            <img
              src={HomeImage2}
              alt="Interior finished by Oraczewski Interiors"
              className="relative w-full h-80 sm:h-[30rem] lg:h-[36rem] object-cover rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative w-full bg-[#12171b] py-20 md:py-28 font-family-serif4 overflow-hidden">
        {/* delikatna poświata w tle */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-[#FF9800]/[0.06] blur-3xl" />

        <div className="relative max-w-[80rem] mx-auto px-4 sm:px-6">
          {/* Nagłówek */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
              Our Process
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
              How It Works
            </h2>
            <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
            <p className="mt-6 text-gray-400 text-base sm:text-lg leading-relaxed">
              From the first conversation to the final walkthrough — a clear,
              four-step process with no surprises along the way.
            </p>
          </motion.div>

          {/* Kroki */}
          <ol className="mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#FF9800]/50 transition-colors duration-300"
              >
                {/* Zdjęcie */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12171b] via-[#12171b]/20 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[0.7rem] font-semibold tracking-[0.2em] text-[#FF9800]">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Treść */}
                <div className="relative flex flex-1 flex-col px-6 pt-6 pb-8">
                  {/* Ikona + tytuł w jednym rzędzie */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF9800]/40 bg-[#FF9800]/10">
                      <img src={step.icon} alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <h3 className="text-white text-xl sm:text-2xl font-semibold leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-gray-400 leading-relaxed">{step.text}</p>
                  {/* Duży numer w tle */}
                  <span className="pointer-events-none select-none absolute bottom-2 right-5 text-7xl font-bold text-white/[0.04]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-14 md:mt-16 flex flex-col items-center gap-4 text-center"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF9800] px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-black transition-colors duration-300 shadow-lg"
            >
              Start Your Project <span aria-hidden="true">→</span>
            </Link>
            <p className="text-gray-500 text-sm tracking-wide">
              Free consultation · Transparent pricing · On-time delivery
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;