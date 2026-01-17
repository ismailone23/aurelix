import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Terms & Conditions
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Please read these terms carefully
            </p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to Aurelex. These terms and conditions govern your use
                of our website and services. By accessing and using this
                website, you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Aurelex website for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Modifying or copying the materials</li>
                <li>
                  Using the materials for any commercial purpose or for any
                  public display
                </li>
                <li>
                  Attempting to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  Removing any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Disclaimer</h2>
              <p>
                The materials on Aurelex website are provided on an 'as is'
                basis. Aurelex makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Limitations</h2>
              <p>
                In no event shall Aurelex or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on the Aurelex website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on Aurelex website could include
                technical, typographical, or photographic errors. Aurelex does
                not warrant that any of the materials on its website are
                accurate, complete, or current.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
