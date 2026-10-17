import { useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
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

/* ================== USTAWIENIA (łatwo zmienić) ================== */
const OPEN_HOUR = 8; // najwcześniejsza godzina konsultacji
const CLOSE_HOUR = 18; // najpóźniejsza (wizyta musi zacząć się przed 18:00)
const MIN_HOURS_AHEAD = 24; // minimum ile godzin do przodu
const MAX_DAYS_AHEAD = 180; // maksymalnie ile dni do przodu
const SUNDAY_CLOSED = true;
const DESCRIPTION_MAX = 1000;
const COOLDOWN_SECONDS = 60; // blokada ponownego wysłania po sukcesie
/* ================================================================ */

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
type FieldName = keyof FormData;
type Errors = Partial<Record<FieldName, string>>;

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

// Kolejność pól – do ustawienia kursora na pierwszym błędnym
const FIELD_ORDER: FieldName[] = [
  "fullName", "email", "propertyType", "phone", "dateTime", "zipCode", "projectDescription", "consent",
];

// Popularne literówki w domenach email -> podpowiedź "Did you mean...?"
const EMAIL_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmal.com": "gmail.com",
  "gnail.com": "gmail.com", "gmail.con": "gmail.com", "gmaill.com": "gmail.com",
  "yahooo.com": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "iclod.com": "icloud.com", "icloud.co": "icloud.com",
};

/* ---------- pomocnicze ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const addHours = (h: number) => new Date(Date.now() + h * 3600_000);
const formatHour = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "AM" : "PM"}`;

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

// Data w czytelnej formie do maila, np. "Tue, Oct 20, 2026, 10:00 AM"
const prettyDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

/* ---------- walidacja pojedynczego pola ---------- */
function validateField(name: FieldName, data: FormData): string | undefined {
  const v = typeof data[name] === "string" ? (data[name] as string).trim() : "";

  switch (name) {
    case "fullName": {
      if (!v) return "Please enter your full name.";
      if (v.length < 3) return "Name is too short.";
      if (v.length > 60) return "Name is too long (max 60 characters).";
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž' .-]+$/.test(v))
        return "Name can contain only letters, spaces, hyphens and apostrophes.";
      if (v.split(/\s+/).filter((p) => p.length >= 2).length < 2)
        return "Please enter your first and last name.";
      return;
    }
    case "email": {
      if (!v) return "Please enter your email address.";
      if (v.length > 100) return "Email is too long.";
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v) || v.includes(".."))
        return "Please enter a valid email address (e.g. name@example.com).";
      const domain = v.split("@")[1].toLowerCase();
      if (EMAIL_TYPOS[domain])
        return `Did you mean ${v.split("@")[0]}@${EMAIL_TYPOS[domain]}?`;
      return;
    }
    case "propertyType": {
      if (!v) return "Please tell us the type of property or renovation.";
      if (v.length < 3) return "Please be a bit more specific (e.g. Kitchen remodel, House).";
      if (v.length > 80) return "Please keep it under 80 characters.";
      return;
    }
    case "phone": {
      const digits = data.phone.replace(/\D/g, "").replace(/^1/, "");
      if (digits.length === 0) return "Please enter your phone number.";
      if (digits.length !== 10) return "Phone number must have 10 digits (e.g. 408-555-1234).";
      if (!/^[2-9]/.test(digits)) return "Area code can't start with 0 or 1.";
      if (!/^[2-9]/.test(digits.slice(3))) return "Please enter a valid US phone number.";
      if (/^(\d)\1{9}$/.test(digits)) return "Please enter a real phone number.";
      return;
    }
    case "dateTime": {
      if (!data.dateTime) return "Please choose a preferred date and time.";
      const d = new Date(data.dateTime);
      if (isNaN(d.getTime())) return "Please choose a valid date.";
      if (d < addHours(MIN_HOURS_AHEAD))
        return `Please choose a time at least ${MIN_HOURS_AHEAD} hours from now.`;
      if (d > addHours(MAX_DAYS_AHEAD * 24))
        return `Please choose a date within the next ${Math.round(MAX_DAYS_AHEAD / 30)} months.`;
      if (SUNDAY_CLOSED && d.getDay() === 0) return "We're closed on Sundays — please pick Monday–Saturday.";
      const h = d.getHours() + d.getMinutes() / 60;
      if (h < OPEN_HOUR || h >= CLOSE_HOUR)
        return `Please choose a time between ${formatHour(OPEN_HOUR)} and ${formatHour(CLOSE_HOUR)}.`;
      return;
    }
    case "zipCode": {
      if (!v) return "Please enter your ZIP code.";
      if (!/^\d{5}$/.test(v)) return "ZIP code must be 5 digits (e.g. 95112).";
      const zip = Number(v);
      if (zip < 90001 || zip > 96162) return "Sorry, we currently serve California only.";
      return;
    }
    case "projectDescription": {
      if (v.length > DESCRIPTION_MAX) return `Please keep it under ${DESCRIPTION_MAX} characters.`;
      if (v.length > 0 && v.length < 10) return "Please add a bit more detail (at least 10 characters).";
      return;
    }
    case "consent":
      return data.consent ? undefined : "You must consent to data processing to continue.";
  }
}

const validateAll = (data: FormData): Errors => {
  const errors: Errors = {};
  FIELD_ORDER.forEach((f) => {
    const e = validateField(f, data);
    if (e) errors[f] = e;
  });
  return errors;
};

/* ================== KOMPONENT ================== */
const Form = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [honeypot, setHoneypot] = useState(""); // pułapka na boty
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (name: FieldName, value: string | boolean) => {
    const next = { ...formData, [name]: value };
    setFormData(next);
    // jeśli pole było już dotknięte, sprawdzamy na bieżąco
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }));
    if (status?.type === "err") setStatus(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (id === "phone") return update("phone", formatPhoneNumber(value));
    if (id === "zipCode") return update("zipCode", value.replace(/\D/g, "").slice(0, 5));
    update(id as FieldName, type === "checkbox" ? checked : value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.id as FieldName;
    // przytnij spacje przy wyjściu z pola
    let data = formData;
    if (typeof formData[name] === "string" && name !== "phone") {
      data = { ...formData, [name]: (formData[name] as string).trim().replace(/\s{2,}/g, " ") };
      if (name === "projectDescription") data = { ...formData, projectDescription: formData.projectDescription.trim() };
      setFormData(data);
    }
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, data) }));
  };

  const focusFirstError = (errs: Errors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#${first}`);
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    // bot wypełnił ukryte pole -> udajemy sukces, nic nie wysyłamy
    if (honeypot) {
      setStatus({ type: "ok", text: "Thank you! Your request has been sent." });
      return;
    }

    // blokada spamu: ponowne wysłanie zbyt szybko
    try {
      const last = Number(localStorage.getItem("lastContactSubmit") || 0);
      const wait = Math.ceil((last + COOLDOWN_SECONDS * 1000 - Date.now()) / 1000);
      if (wait > 0) {
        setStatus({ type: "err", text: `You've just sent a request. Please wait ${wait}s before sending another.` });
        return;
      }
    } catch { /* localStorage niedostępny – pomijamy */ }

    const errs = validateAll(formData);
    setErrors(errs);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    if (Object.keys(errs).length) {
      const count = Object.keys(errs).length;
      setStatus({ type: "err", text: `Please correct ${count} field${count > 1 ? "s" : ""} highlighted below.` });
      focusFirstError(errs);
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          propertyType: formData.propertyType.trim(),
          dateTime: prettyDate(formData.dateTime),
          phone: formData.phone,
          projectDescription: formData.projectDescription.trim() || "—",
          zipCode: formData.zipCode,
          consent: "Yes",
        },
        EMAILJS.publicKey // jako tekst – działa w EmailJS v3 i v4
      );
      try { localStorage.setItem("lastContactSubmit", String(Date.now())); } catch { /* */ }
      setStatus({ type: "ok", text: "Thank you! Your request has been sent. We'll get back to you within 24 hours." });
      setFormData(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({
        type: "err",
        text: "Failed to send message. Please try again or contact us directly by phone or email.",
      });
    } finally {
      setSending(false);
    }
  };

  /* ---------- wygląd ---------- */
  const inputClass = (name: FieldName) =>
    `w-full bg-white text-[#313742] rounded-2xl h-[3.5rem] md:h-[4rem] px-4 shadow-[0_3px_8px_rgb(0,0,0,0.12)] border-2 focus:outline-none transition ${
      touched[name] && errors[name]
        ? "border-red-400 focus:border-red-500 bg-red-50/40"
        : touched[name] && !errors[name] && name !== "projectDescription"
        ? "border-green-400/70 focus:border-[#FF9800]"
        : "border-transparent focus:border-[#FF9800]"
    }`;
  const labelClass = "text-lg md:text-xl font-semibold mb-2 flex gap-3 items-center text-[#313742]";
  const iconClass = "h-7 w-7 md:h-8 md:w-8 shrink-0";

  const ErrorText = ({ name }: { name: FieldName }) =>
    touched[name] && errors[name] ? (
      <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-red-600 flex items-start gap-1.5">
        <span aria-hidden="true">⚠</span>
        {errors[name]}
      </p>
    ) : null;

  const a11y = (name: FieldName) => ({
    "aria-invalid": !!(touched[name] && errors[name]),
    "aria-describedby": touched[name] && errors[name] ? `${name}-error` : undefined,
    onBlur: handleBlur,
    onChange: handleChange,
  });

  const minDate = toLocalInput(addHours(MIN_HOURS_AHEAD));
  const maxDate = toLocalInput(addHours(MAX_DAYS_AHEAD * 24));
  const descLen = formData.projectDescription.length;

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
          Discover how we can transform your space. Contact us today to book your personalized
          interior design consultation.
        </motion.p>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          variants={containerVariants}
          className="w-full bg-white/60 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* Pułapka na boty – niewidoczna dla ludzi */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off"
              value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <p className="md:col-span-2 text-sm text-[#7a818b] -mb-2">
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>

          <motion.div variants={itemVariants}>
            <label htmlFor="fullName" className={labelClass}>
              <img src={peopleSVG} alt="" className={iconClass} /> Full Name <span className="text-red-500">*</span>
            </label>
            <input id="fullName" type="text" autoComplete="name" maxLength={60} value={formData.fullName}
              placeholder="e.g. John Smith" className={inputClass("fullName")} {...a11y("fullName")} />
            <ErrorText name="fullName" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className={labelClass}>
              <img src={listSVG} alt="" className={iconClass} /> Email Address <span className="text-red-500">*</span>
            </label>
            <input id="email" type="email" autoComplete="email" inputMode="email" maxLength={100}
              value={formData.email} placeholder="you@example.com" className={inputClass("email")} {...a11y("email")} />
            <ErrorText name="email" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="propertyType" className={labelClass}>
              <img src={homeSVG} alt="" className={iconClass} /> Property / Renovation <span className="text-red-500">*</span>
            </label>
            <input id="propertyType" type="text" list="propertyTypeOptions" maxLength={80}
              value={formData.propertyType} placeholder="e.g. Kitchen remodel in a house"
              className={inputClass("propertyType")} {...a11y("propertyType")} />
            <datalist id="propertyTypeOptions">
              <option value="Kitchen remodel" />
              <option value="Bathroom renovation" />
              <option value="Living room makeover" />
              <option value="Bedroom renovation" />
              <option value="Flooring installation" />
              <option value="Moulding & trim work" />
              <option value="Whole house renovation" />
              <option value="Apartment / Condo" />
              <option value="Office / Commercial" />
            </datalist>
            <ErrorText name="propertyType" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="phone" className={labelClass}>
              <img src={phoneSVG} alt="" className={iconClass} /> Phone Number <span className="text-red-500">*</span>
            </label>
            <input id="phone" type="tel" autoComplete="tel" inputMode="tel" value={formData.phone}
              placeholder="+1 408-555-1234" className={inputClass("phone")} {...a11y("phone")} />
            <ErrorText name="phone" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="dateTime" className={labelClass}>
              <img src={calendarSVG} alt="" className={iconClass} /> Preferred Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <input id="dateTime" type="datetime-local" min={minDate} max={maxDate} step={900}
              value={formData.dateTime} className={inputClass("dateTime")} {...a11y("dateTime")} />
            {touched.dateTime && errors.dateTime ? (
              <ErrorText name="dateTime" />
            ) : (
              <p className="mt-2 text-sm text-[#7a818b]">
                Mon–{SUNDAY_CLOSED ? "Sat" : "Sun"}, {formatHour(OPEN_HOUR)} – {formatHour(CLOSE_HOUR)}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="zipCode" className={labelClass}>
              <img src={pinSvg} alt="" className={iconClass} /> ZIP Code <span className="text-red-500">*</span>
            </label>
            <input id="zipCode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5}
              value={formData.zipCode} placeholder="e.g. 95112" className={inputClass("zipCode")} {...a11y("zipCode")} />
            <ErrorText name="zipCode" />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <label htmlFor="projectDescription" className={labelClass}>
              <img src={notesSVG} alt="" className={iconClass} /> Brief Description Of Your Project
            </label>
            <textarea id="projectDescription" value={formData.projectDescription} maxLength={DESCRIPTION_MAX}
              placeholder="Tell us about your vision, style preferences, budget, timeline..."
              className={`${inputClass("projectDescription")} h-[9rem] md:h-[11rem] py-3 resize-y`}
              {...a11y("projectDescription")} />
            <div className="flex justify-between gap-4">
              <ErrorText name="projectDescription" />
              <span className={`mt-2 ml-auto text-sm shrink-0 ${descLen > DESCRIPTION_MAX * 0.9 ? "text-[#FF9800]" : "text-[#7a818b]"}`}>
                {descLen}/{DESCRIPTION_MAX}
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="consent" checked={formData.consent}
                className="mt-1 w-5 h-5 accent-[#FF9800] cursor-pointer shrink-0" {...a11y("consent")} />
              <label htmlFor="consent" className="text-[#3F3F3F] text-base md:text-lg cursor-pointer">
                I consent to data processing <span className="text-red-500">*</span>
              </label>
            </div>
            <ErrorText name="consent" />
          </motion.div>

          <motion.p variants={itemVariants} className="md:col-span-2 text-sm md:text-base text-[#7a818b] leading-relaxed">
            By providing my phone number, I consent to receive SMS text messages from Oraczewski
            Interiors Inc. for appointment reminders, marketing messages, and general two-way
            communication. Please check our{" "}
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