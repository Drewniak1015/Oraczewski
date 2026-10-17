import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { API_URL } from "../config";

interface Photo {
  public_id: string;
  url: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const photoVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

// Cloudinary: mniejsza, zoptymalizowana miniatura (szybsze ładowanie strony)
const thumb = (url: string) =>
  url.replace("/upload/", "/upload/c_fill,w_600,h_600,q_auto,f_auto/");
const large = (url: string) => url.replace("/upload/", "/upload/w_1800,q_auto,f_auto/");

const Portfolio = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null); // indeks w powiększeniu

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/photos/list`);
        if (!res.ok) throw new Error();
        setPhotos(await res.json());
      } catch {
        setError("We couldn't load the gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Klawiatura w lightboxie: Esc / strzałki
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i! + 1) % photos.length);
      if (e.key === "ArrowLeft") setActive((i) => (i! - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, photos.length]);

  return (
    <div className="w-full bg-[#faf9f6] min-h-[60vh] font-family-serif4 text-[#313742]">
      <section className="bg-[#12171b] text-white">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">Our Work</p>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold">Portfolio</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
          <p className="mt-6 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            A selection of kitchens, bathrooms and living spaces we’ve finished for our clients.
            Click any photo to see it up close.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col items-center px-4 sm:px-6 pb-20">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-[#ece8df] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-16 text-red-600">{error}</p>
        ) : photos.length === 0 ? (
          <p className="mt-16 text-[#6b717b] text-lg">New projects coming soon.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {photos.map((photo, i) => (
              <motion.button
                key={photo.public_id}
                variants={photoVariants}
                onClick={() => setActive(i)}
                className="relative overflow-hidden rounded-2xl shadow-md group focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:ring-offset-2"
              >
                <img
                  src={thumb(photo.url)}
                  alt={`Oraczewski Interiors project ${i + 1}`}
                  loading="lazy"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute inset-0 flex items-end justify-start p-4 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-[#12171b]">View photo</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox – powiększenie po kliknięciu */}
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <img
              src={large(photos[active].url)}
              alt=""
              className="max-h-[90vh] max-w-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button aria-label="Close" onClick={() => setActive(null)}
              className="absolute top-4 right-5 text-white text-4xl leading-none">×</button>
            {photos.length > 1 && (
              <>
                <button aria-label="Previous"
                  onClick={(e) => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }}
                  className="absolute left-2 sm:left-6 text-white text-5xl px-3">‹</button>
                <button aria-label="Next"
                  onClick={(e) => { e.stopPropagation(); setActive((active + 1) % photos.length); }}
                  className="absolute right-2 sm:right-6 text-white text-5xl px-3">›</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;