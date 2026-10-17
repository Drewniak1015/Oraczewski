import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import emailjs from "@emailjs/browser";
import { EMAILJS } from "../config";

import peopleSVG from "../assets/person.svg";
import pinSvg from "../assets/pin.svg";
import phoneSVG from "../assets/phone.svg";
import notesSVG from "../assets/notes.svg";
import calendarSVG from "../assets/calendar.svg";
import homeSVG from "../assets/home.svg";
import listSVG from "../assets/list.svg";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

interface FormData {
  fullName: string;
  email: string;
  propertyType: string;
  dateTime: string;
  phone: string;
  projectDescription: string;
  zipCode: string;
  consent: boolean;
}

const EMPTY_FORM: FormData = {
  fullName: "",
  email: "",
  propertyType: "",
  dateTime: "",
  phone: "+1",
  projectDescription: "",
  zipCode: "",
  consent: false,
};

const inputClass =
  "w-full bg-white text-[#313742] rounded-2xl h-[3.5rem] md:h-[4rem] px-4 shadow-[0_3px_8px_rgb(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition";
const labelClass =
  "text-lg md:text-2xl font-semibold mb-3 flex gap-3 items-center text-[#313742]";
const iconClass = "h-7 w-7 md:h-9 md:w-9 shrink-0";

// "teraz" w formacie datetime-local – blokuje wybór daty z przeszłości
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const Form = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("1")) digits = digits.slice(1);
    digits = digits.substring(0, 10);
    const len = digits.length;
    if (len === 0) return "+1";
    if (len < 4) return `+1 ${digits}`;
    if (len < 7) return `+1 ${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `+1 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }));
  };

  const validateForm = (): string | null => {
    const { fullName, email, propertyType, dateTime, phone, zipCode, consent } = formData;
    if (!fullName.trim() || !email.trim() || !propertyType.trim() || !dateTime)
      return "Please fill out all required fields.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address.";
    if (phone.replace(/\D/g, "").length !== 11)
      return "Please enter a valid 10-digit phone number.";
    if (zipCode && !/^\d{5}(-\d{4})?$/.test(zipCode.trim()))
      return "Please enter a valid ZIP code (e.g. 95112).";
    if (!consent) return "You must consent to data processing.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return; // blokada podwójnego wysłania

    const error = validateForm();
    if (error) return setStatus({ type: "err", text: error });

    setSending(true);
    setStatus(null);
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        { ...formData, consent: formData.consent ? "Yes" : "No" },
        EMAILJS.publicKey // jako tekst – działa w EmailJS v3 i v4
      );
      setStatus({
        type: "ok",
        text: "Thank you! Your request has been sent. We'll get back to you shortly.",
      });
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "err", text: "Failed to send message. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full bg-[#faf9f6] flex items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        className="w-full max-w-[60rem] font-family-serif4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          variants={itemVariants}
          className="text-[#313742] font-bold text-3xl md:text-5xl leading-tight mb-4 text-center md:text-left"
        >
          Get In Touch To Schedule A Consultation
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-[#313742] text-lg md:text-xl mb-10 max-w-3xl text-center md:text-left"
        >
          Discover how we can transform your space. Contact us today to book your
          personalized interior design consultation.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          variants={containerVariants}
          className="w-full bg-white/60 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="fullName" className={labelClass}>
              <img src={peopleSVG} alt="" className={iconClass} /> Full Name *
            </label>
            <input id="fullName" type="text" autoComplete="name" value={formData.fullName}
              onChange={handleChange} placeholder="Enter your full name" className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className={labelClass}>
              <img src={listSVG} alt="" className={iconClass} /> Email Address *
            </label>
            <input id="email" type="email" autoComplete="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com" className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="propertyType" className={labelClass}>
              <img src={homeSVG} alt="" className={iconClass} /> Property / Renovation *
            </label>
            <input id="propertyType" type="text" value={formData.propertyType}
              onChange={handleChange} placeholder="e.g. House, Apartment, Office" className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="phone" className={labelClass}>
              <img src={phoneSVG} alt="" className={iconClass} /> Phone Number *
            </label>
            <input id="phone" type="tel" autoComplete="tel" value={formData.phone}
              onChange={handlePhoneChange} placeholder="+1 XXX-XXX-XXXX" className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="dateTime" className={labelClass}>
              <img src={calendarSVG} alt="" className={iconClass} /> Preferred Date &amp; Time *
            </label>
            <input id="dateTime" type="datetime-local" min={nowLocal()} value={formData.dateTime}
              onChange={handleChange} className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="zipCode" className={labelClass}>
              <img src={pinSvg} alt="" className={iconClass} /> ZIP Code
            </label>
            <input id="zipCode" type="text" inputMode="numeric" maxLength={10} value={formData.zipCode}
              onChange={handleChange} placeholder="e.g. 95112" className={inputClass} />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <label htmlFor="projectDescription" className={labelClass}>
              <img src={notesSVG} alt="" className={iconClass} /> Brief Description Of Your Project
            </label>
            <textarea id="projectDescription" value={formData.projectDescription} onChange={handleChange}
              placeholder="Tell us about your vision, style preferences, budget, timeline..."
              className={`${inputClass} h-[9rem] md:h-[11rem] py-3 resize-y`} />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 flex items-start gap-3">
            <input type="checkbox" id="consent" checked={formData.consent} onChange={handleChange}
              className="mt-1 w-5 h-5 accent-[#FF9800] cursor-pointer shrink-0" />
            <label htmlFor="consent" className="text-[#3F3F3F] text-base md:text-lg cursor-pointer">
              I consent to data processing *
            </label>
          </motion.div>

          <motion.p variants={itemVariants}
            className="md:col-span-2 text-sm md:text-base text-[#7a818b] leading-relaxed">
            By providing my phone number, I consent to receive SMS text messages from
            Oraczewski Interiors Inc. for appointment reminders, marketing messages, and
            general two-way communication. Please check our{" "}
            <Link to="/Privacy" className="underline hover:text-black">privacy policy</Link> and{" "}
            <Link to="/terms" className="underline hover:text-black">terms and conditions</Link> for details.
          </motion.p>

          {status && (
            <div role="alert"
              className={`md:col-span-2 rounded-xl p-4 border ${
                status.type === "ok"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
              {status.text}
            </div>
          )}

          <motion.div variants={itemVariants} className="md:col-span-2 flex justify-center mt-2">
            <motion.button
              whileHover={sending ? undefined : { scale: 1.04 }}
              whileTap={sending ? undefined : { scale: 0.96 }}
              type="submit"
              disabled={sending}
              className="text-white text-xl md:text-2xl font-semibold rounded-2xl py-3 px-10 bg-[#FF9800] hover:bg-[#f08c00] disabled:opacity-60 disabled:cursor-wait shadow-[0_3px_8px_rgb(0,0,0,0.25)] transition-colors"
            >
              {sending ? "Sending..." : "Submit Request"}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Form;