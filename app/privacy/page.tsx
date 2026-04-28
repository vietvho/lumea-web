import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 selection:bg-[#ff3366] selection:text-white font-sans">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-block text-sm text-purple-300 hover:text-white transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <p className="text-gray-400 mb-10 leading-7">
          This Privacy Policy explains how Lumea Engine collects, uses, and protects information when you use the service.
        </p>

        <section className="space-y-8 text-gray-200">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="leading-7">
              We collect information you provide directly, such as account registration details, your Instagram handle, and any content you submit while using the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Information</h2>
            <p className="leading-7">
              Collected information is used to provide and improve the service, process requests, personalize your experience, and communicate with you about account activity and updates.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Cookies and Tracking</h2>
            <p className="leading-7">
              We may use cookies and similar technologies to understand how the service is used and to improve site performance. You can manage cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
            <p className="leading-7">
              We may use third-party services such as analytics providers, cloud hosting, and authentication tools. These third parties may collect data under their own privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Security</h2>
            <p className="leading-7">
              We take reasonable measures to protect your information, but no internet transmission or storage is completely secure. Please keep your account credentials confidential.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
            <p className="leading-7">
              Depending on your location, you may have rights to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">7. Children</h2>
            <p className="leading-7">
              Our service is not intended for children under 13. We do not knowingly collect personal information from minors without parental consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p className="leading-7">
              We may update this policy from time to time. The most recent version will be posted on this page, and continued use of the service constitutes acceptance of any changes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">9. Contact</h2>
            <p className="leading-7">
              If you have questions about this Privacy Policy, please contact the site owner or administrator. This draft may be revised as the product and legal requirements evolve.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
