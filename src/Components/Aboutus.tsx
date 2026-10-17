import { motion } from "framer-motion";
import instagram from "../assets/instagram-svgrepo-com.svg";
import AboutUs from "../assets/AboutUs.png";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Aboutus = () => {
  return (
    <div className="bg-[#faf9f6] w-full h-auto flex items-center justify-center">
      <div className="w-[90%] max-w-[80rem] flex flex-col my-16">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
        >
          ABOUT ORACZEWSKI INTERIORS
        </motion.h1>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#e1e8f0] text-[#001563] italic font-semibold text-lg sm:text-xl lg:text-2xl rounded-xl p-4 self-center w-full sm:w-[90%] lg:w-[80%] my-8 text-center"
        >
          "We don’t just finish interiors — we finish them like it’s our own
          home."
        </motion.h2>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-start font-bold mb-4"
        >
          A Family Tradition of Craftsmanship
        </motion.h2>

        {/* Opis */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.6 }}
          className="text-base sm:text-lg lg:text-xl text-justify leading-relaxed mb-8"
        >
          For over 20 years, we’ve built more than just interiors — we’ve built
          a legacy. As a father-and-son team, we started our finishing business
          with a shared vision: to deliver craftsmanship that speaks for itself.
          From humble beginnings in Europe, we turned our dedication, hard work,
          and attention to detail into a thriving company trusted by hundreds of
          clients. Now, we’ve brought that same passion and expertise to the
          United States.
          <br />
          <br />
          Our journey wasn’t just about business — it was about family, trust,
          and a relentless drive to grow together. We understand what it takes
          to transform spaces because we’ve spent two decades mastering the art
          of finishes — from drywall and painting to complete remodeling
          solutions. If you’re looking for a team that combines old-school
          values with modern precision, we’re ready to bring your vision to life
          — just like we have for the past 20 years.
        </motion.p>

        {/* Dwie kolumny: tekst + obrazek */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-32">
          {/* Lewa kolumna */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col w-full lg:w-1/2 gap-6"
          >
            <p className="text-base sm:text-lg lg:text-xl text-justify leading-relaxed">
              Interiors with Character — Now with a European Touch. We’re proud
              to collaborate with a highly regarded interior designer from
              Europe, known for her refined sense of style and a loyal client
              base. Her work blends elegance, functionality, and modern trends —
              all infused with a distinct European design sensibility. Thanks to
              this partnership, we’re able to deliver not just high-quality
              finishing work, but complete interiors that feel thoughtful,
              personalized, and truly one of a kind. You can explore her latest
              projects and get inspired on Instagram.
            </p>

            <Link
              to="/contact"
              className="transition duration-300 ease-in-out bg-[#363535] p-4 text-white text-xl font-semibold rounded-xl cursor-pointer hover:bg-[hsl(0,1%,31%)] inline-block text-center"
            >
              Learn More About Us
            </Link>

            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/monaamer_interior/">
                <img
                  src={instagram}
                  alt="Instagram"
                  className="bg-[#dcdbd6] rounded-full w-16 h-16 sm:w-20 sm:h-20 p-2 cursor-pointer hover:scale-105 transition-transform"
                />
              </a>

              <a
                className="text-lg sm:text-xl"
                href="https://www.instagram.com/monaamer_interior/"
              >
                Discover more looks on
                <br /> <b>Instagram</b>
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 1 }}
            className="w-full lg:w-1/2 relative"
          >
            <img
              src={AboutUs}
              alt="About Us"
              className="w-full h-64 sm:h-[30rem] object-cover rounded-2xl"
            />
            <Link
              to="/services"
              className="absolute bg-[#363535] p-4 w-[70%] sm:w-[50%] lg:w-[20rem] text-white text-lg sm:text-xl lg:text-2xl font-semibold rounded-xl top-[60%] left-1/2 transform -translate-x-1/2 hover:bg-[hsl(0,1%,31%)] transition duration-300 text-center"
            >
              MEET OUR SERVICES
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;