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
      <div className="relative w-full h-[calc(100vh-6rem)] overflow-hidden">
        {/* Płynne przenikanie: stare zdjęcie znika, nowe pojawia się na nim */}
        <AnimatePresence initial={false}>
          <motion.div
            key={backgroundImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImg})` }}
          />
        </AnimatePresence>

        {/* Przyciemnienie – biały tekst jest czytelny na każdym zdjęciu */}
        <div className="absolute inset-0 z-[1] bg-black/35" />

        {/* Kropki do ręcznej zmiany slajdu */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === slide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] text-[#F8F9FA] mb-4 md:mb-6 font-bold font-family-Geologica tracking-wide text-shadow-lg"
          >
            TOP QUALITY IN CALIFORNIA
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] text-white mb-6 md:mb-10 font-family-serif4 text-shadow-lg"
          >
            We do construction services in all Bay Area
          </motion.p>


          {/* Wcześniej <button> bez akcji – nic się nie działo po kliknięciu */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="w-full flex justify-center">
            <Link
              to="/contact"
              className="flex items-center justify-center transition duration-300 ease-in-out text-[1.25rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] text-[#D3D3D3] w-full max-w-[20rem] sm:max-w-[30rem] md:max-w-[35rem] lg:max-w-[45rem] h-[4rem] sm:h-[5rem] md:h-[6.375rem] bg-black rounded-full hover:bg-white hover:text-black hover:scale-[1.05] shadow-2xl tracking-wide font-family-Georama"
            >
              START YOUR RENOVATION TODAY
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#F6F3E8] py-16 w-full flex items-center justify-center">
        <div className="flex flex-col items-center w-[90%] max-w-[80rem]">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-family-serif4 text-center"
          >
            Welcome to Oraczewski Interiors
          </motion.h1>

          <div className="w-32 sm:w-64 h-[2px] bg-gray-900 my-8"></div>

          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-base sm:text-lg lg:text-xl lg:w-1/2 text-justify tracking-wide"
            >
              Where all-inclusive design meets home quality. Oraczewski
              Interiors is a team with a passion for creating elegant,
              functional, and timeless living spaces across Bay Area. Our
              tailored design process was created for individuals who value
              professionalism, transparency, and a full-service experience.
              <br />
              <br />
              From concept to completion, we deliver interior design solutions
              that balance aesthetics and practicality. With high-end
              residential projects in major cities and intimate locations alike,
              Oraczewski Interiors is known for crafting spaces that reflect each client’s
              unique lifestyle and taste.
              <br />
              <br />
              Our team is committed to providing top-quality service, seamless
              execution, and meticulous project management. We take pride in
              collaborating with trusted architects to deliver cohesive
              interiors that are not only beautiful but truly livable.
            </motion.p>

            <motion.img
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              src={HomeImage2}
              alt="Oraczewski Interiors"
              className="w-full lg:w-1/2 h-auto object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

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
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-[#FF9800]/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(255,152,0,0.25)] transition duration-300"
              >
                {/* Zdjęcie */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF9800]/40 bg-[#FF9800]/10 group-hover:bg-[#FF9800]/20 transition-colors duration-300">
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
              className="inline-flex items-center gap-2 rounded-full bg-[#FF9800] px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-black hover:scale-[1.03] transition duration-300 shadow-lg"
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