import type { Metadata } from "next";
import { generateLegalPageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Privacy Policy - WhatsMyName",
  description: "Our privacy policy outlines how we protect your tax information when using the WhatsMyName for 2025 tax calculations.",
  alternates: {
    canonical: "https://bigbeautifulbillcalculator.org/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - WhatsMyName",
    description: "Our privacy policy outlines how we protect your tax information when using the WhatsMyName for 2025 tax calculations.",
  },
};

export default function PrivacyPolicy({ params }: { params: { locale: string } }) {
  const structuredData = generateLegalPageStructuredData('privacy', params.locale);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <div className="prose dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>

        <p><strong>Last updated: July 8, 2025</strong></p>

        <h2>Your Tax Information Security is Our Priority</h2>
        <p>
          At WhatsMyName, we understand that your tax information is highly sensitive and personal. This Privacy Policy explains how we collect, use, and protect your information when you use our free US Remittance Tax Calculator and H.R.1 Tax Calculator 2025.
        </p>

        <h2>Information We Collect</h2>
        <h3>Tax Calculation Data</h3>
        <p>
          When you use our WhatsMyName, we may temporarily process the following information to provide accurate tax calculations:
        </p>
        <ul>
          <li>Income information (wages, business income, investment income)</li>
          <li>Filing status and dependent information</li>
          <li>Deduction amounts (standard, itemized, SALT, mortgage interest)</li>
          <li>Tax credits (child tax credit, earned income credit, education credits)</li>
          <li>State and local tax information</li>
          <li>Business expenses and qualified business income for QBI deduction</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>We may collect certain information automatically when you visit our website:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>IP address (anonymized)</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website information</li>
        </ul>

        <h2>How We Protect Your Tax Information</h2>
        <h3>No Storage of Personal Tax Data</h3>
        <p>
          <strong>Your tax information is NEVER stored on our servers.</strong> All tax calculations in our One Big Beautiful Bill Tax Calculator happen directly in your browser. Your sensitive financial information never leaves your device.
        </p>

        <h3>Security Measures</h3>
        <ul>
          <li><strong>Client-Side Processing:</strong> All tax calculations are performed locally in your browser</li>
          <li><strong>HTTPS Encryption:</strong> All data transmission is encrypted using industry-standard SSL/TLS</li>
          <li><strong>No Registration Required:</strong> Use our American Tax Reform Calculator 2025 without creating accounts</li>
          <li><strong>Anonymous Usage:</strong> We don't track individual users or their tax situations</li>
          <li><strong>Regular Security Audits:</strong> Our systems undergo regular security assessments</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use collected information solely for the following purposes:</p>
        <ul>
          <li>Providing accurate 2025 tax calculations based on H.R.1 provisions</li>
          <li>Improving our US Tax Law 2025 Calculator functionality</li>
          <li>Ensuring website security and preventing abuse</li>
          <li>Analyzing website usage patterns (in aggregate, anonymous form)</li>
          <li>Providing customer support when requested</li>
        </ul>

        <h2>Information Sharing and Third Parties</h2>
        <p>
          <strong>We do NOT sell, trade, or share your personal tax information with third parties.</strong> The only exceptions are:
        </p>
        <ul>
          <li><strong>Legal Requirements:</strong> If required by law enforcement or court order</li>
          <li><strong>Service Providers:</strong> Limited technical service providers who help maintain our website (they cannot access your tax data)</li>
          <li><strong>Business Transfer:</strong> In the unlikely event of a merger or acquisition, user privacy protections would remain in place</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>Our Big Beautiful Bill Tax Tool uses minimal cookies for:</p>
        <ul>
          <li>Remembering your calculator preferences (optional)</li>
          <li>Ensuring website security</li>
          <li>Anonymous analytics to improve user experience</li>
        </ul>
        <p>You can disable cookies in your browser settings. This may affect some website functionality but will not prevent tax calculations.</p>

        <h2>Your Rights and Choices</h2>
        <h3>Access and Control</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Use our calculator completely anonymously</li>
          <li>Clear your browser data at any time</li>
          <li>Opt out of analytics cookies</li>
          <li>Request information about our privacy practices</li>
        </ul>

        <h3>Data Retention</h3>
        <p>
          Since we don't store your tax information, there is no personal data to retain. Anonymous analytics data is kept for 12 months to help improve our service.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our WhatsMyName is not intended for use by children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify users of any material changes by posting the updated policy on our website with a new "Last updated" date.
        </p>

        <h2>Compliance and Certifications</h2>
        <p>Our privacy practices comply with:</p>
        <ul>
          <li>California Consumer Privacy Act (CCPA)</li>
          <li>General Data Protection Regulation (GDPR) for EU users</li>
          <li>IRS Publication 1075 guidelines for tax information protection</li>
          <li>SOC 2 Type II standards for data security</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@bigbeautifulbillcalculator.org">privacy@bigbeautifulbillcalculator.org</a></li>
          <li><strong>Mailing Address:</strong> WhatsMyName Privacy Team, 1234 Tax Avenue, Suite 2025, Washington, DC 20001</li>
        </ul>

        <p>
          <strong>Remember:</strong> Your tax privacy is our commitment. We designed our US Remittance Tax Calculator with privacy-first principles to ensure your sensitive financial information remains secure and private.
        </p>
      </div>
    </>
  );
} 