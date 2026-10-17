import React from "react";

// TODO: sprawdź, czy handyman10@gmail.com to właściwy adres kontaktowy
const CONTACT_EMAIL = "handyman10@gmail.com";

const Privacy: React.FC = () => {
  return (
    <div className="bg-[#faf9f6] w-full font-family-serif4 text-[#313742]">
      <section className="bg-[#12171b] text-white">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <p className="text-[#FF9800] uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold">Legal</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
          <div className="mx-auto mt-6 h-[2px] w-16 bg-[#FF9800]" />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="privacy-policy bg-white rounded-3xl border border-[#ece8df] shadow-sm p-6 sm:p-10 leading-relaxed text-[#4a505a] [&_li]:marker:text-[#FF9800]">

        <p>
          Oraczewski Interiors Inc. ("we", "our", or "us") respects your privacy
          and is committed to protecting it through this Privacy Policy. This
          policy explains how we collect, use, and disclose your personal
          information when you visit our website or use our services in
          California.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Information We Collect</h2>
        <p>We may collect the following types of personal information:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            Contact information (such as your name, email address, phone number,
            and ZIP code)
          </li>
          <li>Information you provide when you fill out forms or request a quote</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">How We Use Your Information</h2>
        <p>We use your personal information to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Respond to your inquiries and provide our services</li>
          <li>Communicate with you about your project and our offerings</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share your information
          with trusted third parties who assist us in operating our business, such
          as service providers and contractors, but only as necessary and under
          confidentiality agreements. Messages sent through our contact form are
          delivered via the EmailJS service.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Your Privacy Rights</h2>
        <p>
          If you're a resident of California or any other region with privacy
          regulations, please know that we respect your privacy rights. You may
          contact us at any time with questions or requests regarding your
          personal data.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Security</h2>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, disclosure, or misuse.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The updated policy
          will be posted on this page with a new effective date.
        </p>

        <h2 className="text-xl sm:text-2xl font-bold mt-10 mb-3 text-[#12171b]">Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please
          contact us at:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF9800] font-semibold hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Privacy;