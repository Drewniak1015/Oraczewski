import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";
import instagram from "../assets/instagram-svgrepo-com.svg";
import AboutUs from "../assets/AboutUs.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

const INSTAGRAM_URL = "https://www.instagram.com/monaamer_interior/";

const highlights = [
  { value: "20+", label: "Years of craftsmanship" },
  { value: "2", label: "Generations, father & son" },
  { value: "100s", label: "Of satisfied clients" },
  { value: "EU → US", label: "European quality in California" },
];

const Aboutus = () => {
  return (
    <div className="bg-[#faf9f6] w-full font-family-serif4 text-[#313742]">
      {/* ===== Nagłówek strony ===== */}
      <section className="bg-[#12171b] text-white">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
            About Us
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Oraczewski Interiors
          </motion.h1>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
          <motion.blockquote variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-8 max-w-3xl mx-auto text-xl sm:text-2xl lg:text-3xl italic text-gray-200 leading-snug">
            “We don’t just finish interiors — we finish them like it’s our own home.”
          </motion.blockquote>
        </div>
      </section>

      {/* ===== Historia ===== */}
      <section className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="lg:col-span-5">
            <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
              Our Story
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
              A Family Tradition of Craftsmanship
            </h2>
            <div className="mt-6 h-[2px] w-16 bg-[#FF9800]" />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed text-[#4a505a]">
            <p>
              For over 20 years, we’ve built more than just interiors — we’ve built a legacy. As a
              father-and-son team, we started our finishing business with a shared vision: to deliver
              craftsmanship that speaks for itself. From humble beginnings in Europe, we turned our
              dedication, hard work and attention to detail into a thriving company trusted by
              hundreds of clients. Now, we’ve brought that same passion and expertise to the United States.
            </p>
            <p>
              Our journey wasn’t just about business — it was about family, trust and a relentless
              drive to grow together. We’ve spent two decades mastering the art of finishes — from
              drywall and painting to complete remodeling solutions. If you’re looking for a team that
              combines old-school values with modern precision, we’re ready to bring your vision to life.
            </p>
          </motion.div>
        </div>

        {/* Wyróżniki */}
        <div className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((h, i) => (
            <motion.div key={h.label} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              className="rounded-2xl bg-white border border-[#ece8df] p-6 text-center shadow-sm">
              <div className="text-3xl sm:text-4xl font-bold text-[#FF9800]">{h.value}</div>
              <div className="mt-2 text-sm sm:text-base text-[#6b717b]">{h.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Współpraca z projektantką ===== */}
      <section className="bg-white border-y border-[#ece8df]">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative order-2 lg:order-1">
            <div className="absolute -bottom-4 -left-4 w-full h-full rounded-2xl border-2 border-[#FF9800]/60 hidden sm:block" />
            <img src={AboutUs} alt="Interior designed in partnership with our European designer"
              className="relative w-full h-72 sm:h-[28rem] object-cover rounded-2xl shadow-lg" />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="order-1 lg:order-2">
            <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
              Design Partnership
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
              Interiors with Character — Now with a European Touch
            </h2>
            <div className="mt-6 h-[2px] w-16 bg-[#FF9800]" />
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#4a505a]">
              We’re proud to collaborate with a highly regarded interior designer from Europe, known
              for her refined sense of style and a loyal client base. Her work blends elegance,
              functionality and modern trends — all infused with a distinct European design sensibility.
            </p>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#4a505a]">
              Thanks to this partnership, we deliver not just high-quality finishing work, but complete
              interiors that feel thoughtful, personalized and truly one of a kind.
            </p>

            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-[#ece8df] bg-[#faf9f6] pr-6 pl-2 py-2 hover:border-[#FF9800] hover:shadow-md transition group">
              <img src={instagram} alt="" className="w-12 h-12 rounded-xl bg-[#dcdbd6] p-2 group-hover:scale-105 transition-transform" />
              <span className="text-left leading-tight">
                <span className="block text-sm text-[#6b717b]">See her latest projects</span>
                <span className="block font-semibold">Follow on Instagram →</span>
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="rounded-3xl bg-[#12171b] text-white px-6 sm:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready to transform your space?</h2>
            <p className="mt-3 text-gray-400 text-base sm:text-lg">
              Book a free consultation or explore what we can do for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/contact"
              className="rounded-full bg-[#FF9800] px-7 py-3.5 font-semibold text-white hover:bg-white hover:text-black transition">
              Get a Consultation
            </Link>
            <Link to="/services"
              className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white hover:border-white hover:bg-white/10 transition">
              Our Services
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Aboutus;