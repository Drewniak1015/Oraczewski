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
  const isBad = (name: FieldName) => !!(touched[name] && errors[name]);
  const isGood = (name: FieldName) =>
    !!(touched[name] && !errors[name] && name !== "projectDescription" && name !== "consent");

  const inputClass = (name: FieldName, withIcon = true) =>
    `peer w-full rounded-xl border bg-[#faf9f6] text-[#313742] placeholder:text-[#a3a7ae] h-[3.25rem] ${
      withIcon ? "pl-12" : "pl-4"
    } pr-10 text-[0.98rem] outline-none transition duration-200 focus:bg-white focus:ring-4 ${
      isBad(name)
        ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100"
        : isGood(name)
        ? "border-green-300 focus:border-[#FF9800] focus:ring-[#FF9800]/15"
        : "border-[#e6e2d9] hover:border-[#d6d1c6] focus:border-[#FF9800] focus:ring-[#FF9800]/15"
    }`;
  const labelClass = "mb-1.5 block text-sm font-semibold text-[#313742]";
  const Req = () => <span className="text-[#FF9800]">*</span>;

  // ikona w polu (lewa strona) + znaczek ✓ / ! (prawa strona)
  const Adorn = ({ name, icon }: { name: FieldName; icon: string }) => (
    <>
      <img src={icon} alt="" aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 peer-focus:opacity-90 transition-opacity" />
      {isGood(name) && (
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">✓</span>
      )}
      {isBad(name) && (
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-sm font-bold">!</span>
      )}
    </>
  );

  const ErrorText = ({ name }: { name: FieldName }) =>
    isBad(name) ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        id={`${name}-error`}
        role="alert"
        className="mt-1.5 text-[0.82rem] text-red-600"
      >
        {errors[name]}
      </motion.p>
    ) : null;

  const a11y = (name: FieldName) => ({
    "aria-invalid": isBad(name),
    "aria-describedby": isBad(name) ? `${name}-error` : undefined,
    onBlur: handleBlur,
    onChange: handleChange,
  });

  const minDate = toLocalInput(addHours(MIN_HOURS_AHEAD));
  const maxDate = toLocalInput(addHours(MAX_DAYS_AHEAD * 24));
  const descLen = formData.projectDescription.length;

  const nextSteps = [
    { t: "We review your request", d: "Usually within 24 hours." },
    { t: "We call to confirm", d: "A quick chat about your project and timing." },
    { t: "Free consultation", d: "On-site or virtual — whatever suits you." },
  ];

  return (
    <div className="w-full bg-[#faf9f6] font-family-serif4 text-[#313742]">
      {/* ===== Nagłówek strony ===== */}
      <section className="bg-[#12171b] text-white">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 pt-16 pb-28 md:pt-20 md:pb-36 text-center">
          <motion.p variants={itemVariants} initial="hidden" animate="visible"
            className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">
            Contact
          </motion.p>
          <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Schedule a Consultation
          </motion.h1>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
          <motion.p variants={itemVariants} initial="hidden" animate="visible"
            className="mt-6 max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Tell us a little about your project — we’ll get back to you within 24 hours to book your
            free, personalized consultation.
          </motion.p>
        </div>
      </section>

      {/* ===== Karta: info + formularz ===== */}
      <div className="max-w-[72rem] mx-auto px-4 sm:px-6 -mt-20 md:-mt-24 pb-20 md:pb-28 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="grid lg:grid-cols-[22rem_1fr] rounded-3xl overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(18,23,27,0.25)] border border-[#ece8df]"
        >
          {/* --- Panel informacyjny --- */}
          <aside className="relative bg-[#12171b] text-white p-8 sm:p-10 overflow-hidden">
            <h2 className="relative text-2xl font-bold">What happens next?</h2>
            <ol className="relative mt-8 space-y-6">
              {nextSteps.map((st, i) => (
                <li key={st.t} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FF9800]/50 bg-[#FF9800]/10 text-sm font-bold text-[#FF9800]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{st.t}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{st.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="relative mt-10 pt-8 border-t border-white/10 space-y-3 text-sm text-gray-300">
              <p className="flex items-center gap-3"><span className="text-[#FF9800]">●</span> San Jose & the entire Bay Area</p>
              <p className="flex items-center gap-3"><span className="text-[#FF9800]">●</span> Mon–{SUNDAY_CLOSED ? "Sat" : "Sun"}, {formatHour(OPEN_HOUR)} – {formatHour(CLOSE_HOUR)}</p>
              <p className="flex items-center gap-3"><span className="text-[#FF9800]">●</span> Free, no-obligation estimate</p>
            </div>
          </aside>

          {/* --- Formularz --- */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative p-6 sm:p-10">
            {/* Pułapka na boty – niewidoczna dla ludzi */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label htmlFor="fullName" className={labelClass}>Full name <Req /></label>
                <div className="relative">
                  <input id="fullName" type="text" autoComplete="name" maxLength={60} value={formData.fullName}
                    placeholder="John Smith" className={inputClass("fullName")} {...a11y("fullName")} />
                  <Adorn name="fullName" icon={peopleSVG} />
                </div>
                <ErrorText name="fullName" />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email address <Req /></label>
                <div className="relative">
                  <input id="email" type="email" autoComplete="email" inputMode="email" maxLength={100}
                    value={formData.email} placeholder="you@example.com" className={inputClass("email")} {...a11y("email")} />
                  <Adorn name="email" icon={listSVG} />
                </div>
                <ErrorText name="email" />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Phone number <Req /></label>
                <div className="relative">
                  <input id="phone" type="tel" autoComplete="tel" inputMode="tel" value={formData.phone}
                    placeholder="+1 408-555-1234" className={inputClass("phone")} {...a11y("phone")} />
                  <Adorn name="phone" icon={phoneSVG} />
                </div>
                <ErrorText name="phone" />
              </div>

              <div>
                <label htmlFor="zipCode" className={labelClass}>ZIP code <Req /></label>
                <div className="relative">
                  <input id="zipCode" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5}
                    value={formData.zipCode} placeholder="95112" className={inputClass("zipCode")} {...a11y("zipCode")} />
                  <Adorn name="zipCode" icon={pinSvg} />
                </div>
                <ErrorText name="zipCode" />
              </div>

              <div>
                <label htmlFor="propertyType" className={labelClass}>Property / renovation <Req /></label>
                <div className="relative">
                  <input id="propertyType" type="text" list="propertyTypeOptions" maxLength={80}
                    value={formData.propertyType} placeholder="e.g. Kitchen remodel"
                    className={inputClass("propertyType")} {...a11y("propertyType")} />
                  <Adorn name="propertyType" icon={homeSVG} />
                </div>
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
              </div>

              <div>
                <label htmlFor="dateTime" className={labelClass}>Preferred date &amp; time <Req /></label>
                <div className="relative">
                  <input id="dateTime" type="datetime-local" min={minDate} max={maxDate} step={900}
                    value={formData.dateTime} className={inputClass("dateTime")} {...a11y("dateTime")} />
                  <Adorn name="dateTime" icon={calendarSVG} />
                </div>
                {isBad("dateTime") ? (
                  <ErrorText name="dateTime" />
                ) : (
                  <p className="mt-1.5 text-[0.82rem] text-[#8a8f98]">
                    Mon–{SUNDAY_CLOSED ? "Sat" : "Sun"}, {formatHour(OPEN_HOUR)} – {formatHour(CLOSE_HOUR)}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-end justify-between">
                  <label htmlFor="projectDescription" className={labelClass}>
                    Tell us about your project <span className="font-normal text-[#8a8f98]">(optional)</span>
                  </label>
                  <span className={`mb-1.5 text-xs ${descLen > DESCRIPTION_MAX * 0.9 ? "text-[#FF9800]" : "text-[#a3a7ae]"}`}>
                    {descLen}/{DESCRIPTION_MAX}
                  </span>
                </div>
                <div className="relative">
                  <textarea id="projectDescription" value={formData.projectDescription} maxLength={DESCRIPTION_MAX}
                    placeholder="Your vision, style preferences, budget, timeline..."
                    className={`${inputClass("projectDescription")} h-36 py-3.5 resize-y`}
                    {...a11y("projectDescription")} />
                  <img src={notesSVG} alt="" aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-4 h-5 w-5 opacity-50" />
                </div>
                <ErrorText name="projectDescription" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="consent"
                  className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                    isBad("consent") ? "border-red-300 bg-red-50/50" : formData.consent ? "border-[#FF9800]/40 bg-[#FF9800]/5" : "border-[#e6e2d9] hover:border-[#d6d1c6]"
                  }`}>
                  <input type="checkbox" id="consent" checked={formData.consent}
                    className="mt-0.5 w-5 h-5 accent-[#FF9800] cursor-pointer shrink-0" {...a11y("consent")} />
                  <span className="text-sm text-[#4a505a] leading-relaxed">
                    <span className="font-semibold text-[#313742]">I consent to data processing <Req /></span>
                    <br />
                    By providing my phone number, I agree to receive SMS messages from Oraczewski Interiors
                    Inc. (appointment reminders, marketing and two-way communication). See our{" "}
                    <Link to="/Privacy" className="underline hover:text-[#FF9800]">privacy policy</Link> and{" "}
                    <Link to="/terms" className="underline hover:text-[#FF9800]">terms</Link>.
                  </span>
                </label>
                <ErrorText name="consent" />
              </div>
            </div>

            {status && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 rounded-xl p-4 border text-sm sm:text-base ${
                  status.type === "ok"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {status.text}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="group mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9800] py-4 text-lg font-semibold text-white shadow-[0_10px_25px_-10px_rgba(255,152,0,0.7)] hover:bg-[#f08c00] active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait transition"
            >
              {sending ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Request
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-[#a3a7ae]">
              Fields marked with <Req /> are required. We never share your details.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Form;