import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Your privacy is important to us
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Aurelex ("we", "our", or "us") operates the website. This page
                informs you of our policies regarding the collection, use, and
                disclosure of personal data when you use our website and the
                choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                2. Information Collection and Use
              </h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our service to you.
              </p>
              <div className="mt-3 space-y-2">
                <h3 className="font-semibold">Types of Data Collected:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Personal Data: Name, email address, phone number</li>
                  <li>Usage Data: Browser type, IP address, pages visited</li>
                  <li>Cookie Data: Information stored on your device</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Use of Data</h2>
              <p>Aurelex uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To gather analysis or valuable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                4. Security of Data
              </h2>
              <p>
                The security of your data is important to us but remember that
                no method of transmission over the Internet is 100% secure.
                While we strive to use commercially acceptable means to protect
                your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at privacy@aurelex.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
