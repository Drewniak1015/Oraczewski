import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div>
      <div className="terms-container text-black p-6 max-w-4xl mx-auto leading-relaxed rounded-xl">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

        <div className="mb-6">
          <p>
            <strong>Effective Date:</strong> Data Obowiązywania
          </p>
          <p>
            <strong>Website:</strong> Domena
          </p>
          <p>
            <strong>Business Name:</strong> Oraczewski Interiors
          </p>
          <p>
            <strong>Location:</strong> San Jose, CA, USA
          </p>
        </div>

        <p className="mb-8">
          Welcome to <strong>Oraczewski Interiors</strong>. By using our
          website, you agree to comply with and be bound by the following Terms
          and Conditions. Please read them carefully. If you do not agree with
          any part of these terms, please do not use this website.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Services</h2>
          <p>
            Oraczewski Interiors provides custom interior finishing services
            across California, including but not limited to:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Kitchens</strong> – Remodeling, cabinetry, countertops,
              backsplashes
            </li>
            <li>
              <strong>Bathrooms</strong> – Renovations, showers, tubs, vanities,
              tiling
            </li>
            <li>
              <strong>Living Rooms</strong> – Custom woodwork, painting,
              built-ins, wall finishing
            </li>
            <li>
              <strong>Bedrooms</strong> – Upgrades, closet solutions, flooring,
              paint
            </li>
            <li>
              <strong>Flooring</strong> – Hardwood, laminate, vinyl, tile, and
              natural stone installation
            </li>
            <li>
              <strong>Mouldings</strong> – Crown moulding, baseboards, casings,
              decorative trim
            </li>
            <li>
              <strong>Natural Stone</strong> – Marble, granite, quartz, and
              other stone surfaces
            </li>
            <li>
              <strong>Electricity & Plumbing</strong> – Electrical and plumbing
              work related to renovation projects
            </li>
          </ul>
          <p className="mt-2 text-sm italic">
            All visuals and descriptions on this website are for informational
            purposes only. Final scope, pricing, and details will be defined in
            a written project agreement.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Use of the Website</h2>
          <p>
            You agree to use this website only for lawful purposes. You must
            not:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Violate any local, state, or federal laws or regulations</li>
            <li>
              Attempt to gain unauthorized access to the website or its server
            </li>
            <li>
              Use the website to distribute spam, unsolicited marketing, or
              malware
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            3. Estimates and Proposals
          </h2>
          <p>
            Estimates provided through the website or contact forms are{" "}
            <strong>non-binding</strong>. Final quotes are issued only after a
            consultation and, if necessary, an on-site visit.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            4. Intellectual Property
          </h2>
          <p>
            All content, including text, images, graphics, and layout, is the
            property of Oraczewski Interiors unless otherwise stated. You may
            not:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Copy, reproduce, or republish for commercial purposes</li>
            <li>
              Modify or redistribute content without{" "}
              <strong>written permission</strong>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            5. Limitation of Liability
          </h2>
          <p>
            We strive to keep all information accurate and up to date, but we do
            not guarantee completeness or reliability. Oraczewski Interiors is
            not liable for:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Direct or indirect losses resulting from your use of this website
            </li>
            <li>Temporary unavailability or technical issues</li>
          </ul>
          <p className="mt-2">Use of this website is at your own risk.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for their content, privacy practices, or availability.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Privacy Policy</h2>
          <p>
            We value your privacy. Please review our{" "}
            <Link to="/Privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>{" "}
            for details on how we collect, store, and protect your personal
            information.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Warranty</h2>
          <p>
            We offer a <strong>12-month limited warranty</strong> on labor and
            installation, effective from the project completion date.
          </p>
          <p className="mt-2">
            <strong>Covered:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Workmanship defects</li>
            <li>Installation issues caused by our team</li>
          </ul>
          <p className="mt-2">
            <strong>Not Covered:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Damage from misuse, accidents, improper maintenance, or
              third-party alterations
            </li>
            <li>Natural wear and tear or material aging</li>
          </ul>
          <p className="mt-2 text-sm italic">
            Warranty claims must be made in writing within the warranty period.
            We reserve the right to inspect and resolve issues at our
            discretion.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            9. Cancellation & Changes
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>7+ days before start date:</strong> No cancellation fee
            </li>
            <li>
              <strong>Less than 7 days before start date:</strong> Up to 20%
              cancellation fee
            </li>
          </ul>
          <p className="mt-2">
            Changes to project scope after agreement may affect pricing and
            deadlines. We may postpone or cancel work due to unforeseen
            circumstances, safety concerns, or non-payment.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">10. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions at any time. Continued use
            of the website means you accept the revised terms.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the{" "}
            <strong>State of California</strong>, and any disputes will be
            handled exclusively in California courts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;