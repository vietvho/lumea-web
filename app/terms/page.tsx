import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 selection:bg-[#ff3366] selection:text-white font-sans">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-block text-sm text-purple-300 hover:text-white transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold mb-6">Terms of Service</h1>
        <p className="text-gray-400 mb-10 leading-7">
          These Terms of Service govern your use of Lumea Engine. By accessing or using our platform, you agree to these terms. If you do not agree, please do not use the service.
        </p>

        <section className="space-y-8 text-gray-200">
          <div>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="leading-7">
              Lumea Engine provides website generation services for creators. By using the platform, you agree to comply with these Terms of Service and all applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
            <p className="leading-7">
              You must be at least 13 years old or the minimum age required in your jurisdiction to access and use the service. Account holders are responsible for maintaining accurate and lawful information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">3. Account Responsibility</h2>
            <p className="leading-7">
              If you create an account, you are responsible for keeping your login information secure. You agree not to share access credentials and to notify us immediately of any unauthorized use.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="leading-7">
              You must not use Lumea Engine to create or publish illegal, infringing, abusive, or harmful content. We reserve the right to remove any content that violates these terms or applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
            <p className="leading-7">
              All intellectual property rights in the platform, branding, and the underlying technology belong to Lumea Engine or its licensors. You retain ownership of the content you submit, subject to the license you grant us to operate the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">6. Disclaimer of Warranties</h2>
            <p className="leading-7">
              The service is provided “as is” and “as available.” We do not guarantee uninterrupted operation, accuracy, or the suitability of generated content for any particular purpose.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="leading-7">
              To the maximum extent permitted by law, Lumea Engine is not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">8. Termination</h2>
            <p className="leading-7">
              We may suspend or terminate access to the platform for any reason, including violation of these terms. You may also close your account at any time by following the account settings or contacting support.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
            <p className="leading-7">
              We may update these terms periodically. Continued use of the service after changes are posted constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
            <p className="leading-7">
              If you have questions about these terms, please contact the site owner or administrator. This draft is intended for review and may be updated as the product evolves.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
