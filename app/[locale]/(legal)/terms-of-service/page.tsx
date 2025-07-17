import type { Metadata } from "next";
import { generateLegalPageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Terms of Service - Big Beautiful Bill Calculator",
  description: "Terms and conditions for using Big Beautiful Bill Calculator, including usage guidelines for our free 2025 tax calculator and H.R.1 compliance information.",
  alternates: {
    canonical: "https://bigbeautifulbillcalculator.org/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service - Big Beautiful Bill Calculator",
    description: "Terms and conditions for using Big Beautiful Bill Calculator, including usage guidelines for our free 2025 tax calculator and H.R.1 compliance information.",
  },
};

export default function TermsOfService({ params }: { params: { locale: string } }) {
  const structuredData = generateLegalPageStructuredData('terms', params.locale);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <div className="prose dark:prose-invert max-w-none">
        <h1>Terms of Service for Big Beautiful Bill Calculator</h1>

        <p><strong>Last updated: July 8, 2025</strong></p>

        <h2>Introduction and Acceptance of Terms</h2>
        <p>
          Welcome to <strong>Big Beautiful Bill Calculator</strong>, a free online tax calculation platform designed to help Americans calculate their 2025 federal and state taxes based on the H.R.1 One Big Beautiful Bill Act. By accessing or using our US Remittance Tax Calculator, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, please do not use our service.
        </p>

        <h2>Description of Service</h2>
        <p>
          Big Beautiful Bill Calculator provides users with comprehensive tax calculation tools including:
        </p>
        <ul>
          <li>2025 federal and state income tax calculations</li>
          <li>H.R.1 Tax Calculator 2025 with new provisions for tips and overtime deductions</li>
          <li>Enhanced qualified business income (QBI) deduction calculations at 23%</li>
          <li>SALT deduction optimization with the new $40,000 cap</li>
          <li>American Tax Reform Calculator 2025 features</li>
          <li>US Tax Law 2025 Calculator compliance tools</li>
          <li>One Big Beautiful Bill Tax Calculator functionality</li>
        </ul>

        <h2>Proper Use of the Service</h2>
        <h3>Permitted Uses</h3>
        <p>You may use our Big Beautiful Bill Tax Tool for:</p>
        <ul>
          <li>Personal tax planning and estimation for tax year 2025</li>
          <li>Educational purposes to understand tax calculations</li>
          <li>Comparing different tax scenarios and strategies</li>
          <li>Professional tax planning (with appropriate disclaimers to clients)</li>
          <li>Academic research and tax policy analysis</li>
        </ul>

        <h3>Usage Guidelines</h3>
        <p>You agree to use the service in accordance with all applicable laws and regulations, and you agree to:</p>
        <ul>
          <li>Provide accurate information for tax calculations</li>
          <li>Use the calculator for legitimate tax planning purposes</li>
          <li>Respect the intellectual property rights of Big Beautiful Bill Calculator</li>
          <li>Not attempt to reverse engineer or copy our calculation algorithms</li>
          <li>Comply with all federal and state tax laws</li>
        </ul>

        <h2>User Responsibilities and Account Information</h2>
        <h3>No Registration Required</h3>
        <p>
          Big Beautiful Bill Calculator operates without requiring user accounts, ensuring maximum privacy for your tax information. You can use our US Overseas Remittance Fee Calculator completely anonymously.
        </p>

        <h3>Information Accuracy</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Entering accurate financial information into our calculators</li>
          <li>Verifying that our calculations match your specific tax situation</li>
          <li>Consulting with qualified tax professionals for complex scenarios</li>
          <li>Ensuring compliance with current tax laws and regulations</li>
          <li>Understanding that our tool provides estimates, not official tax advice</li>
        </ul>

        <h2>Intellectual Property Rights</h2>
        <h3>Our Proprietary Content</h3>
        <p>
          All content provided through Big Beautiful Bill Calculator, including the website design, calculation algorithms, tax formulas, user interface, and educational materials, is protected under copyright law and owned by <strong>Big Beautiful Bill Calculator</strong>.
        </p>

        <h3>Third-Party Content</h3>
        <ul>
          <li>Tax law information is based on official IRS publications and H.R.1 legislation</li>
          <li>State tax rates are sourced from official state revenue departments</li>
          <li>We respect and acknowledge all third-party intellectual property rights</li>
        </ul>

        <h3>User License</h3>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to use our American Tax Reform Calculator 2025 for personal and professional tax planning purposes. This license does not include the right to:
        </p>
        <ul>
          <li>Redistribute or resell our calculation tools</li>
          <li>Create derivative works based on our algorithms</li>
          <li>Use our service for competing tax software products</li>
          <li>Remove copyright or proprietary notices</li>
        </ul>

        <h2>Prohibited Activities</h2>
        <p>You agree not to engage in any of the following prohibited activities while using our One Big Beautiful Bill Tax Calculator:</p>
        <ul>
          <li>Attempting to reverse engineer, decompile, or disassemble our tax calculation algorithms</li>
          <li>Using automated tools to scrape data or perform bulk calculations beyond reasonable personal use</li>
          <li>Interfering with or disrupting the security, performance, or availability of our service</li>
          <li>Using the service for any illegal activities, including tax evasion or fraud</li>
          <li>Attempting to bypass security features or access restricted areas of our website</li>
          <li>Distributing malware or engaging in denial-of-service attacks</li>
          <li>Impersonating Big Beautiful Bill Calculator or our representatives</li>
          <li>Using the service to provide unauthorized tax advice or preparation services</li>
        </ul>

        <h2>Tax Calculation Disclaimers</h2>
        <h3>Estimates Only</h3>
        <p>
          <strong>IMPORTANT:</strong> Big Beautiful Bill Calculator provides tax estimates based on the information you provide and current tax laws. Our calculations are for informational purposes only and should not be considered as:
        </p>
        <ul>
          <li>Official tax advice or professional tax consultation</li>
          <li>A substitute for professional tax preparation or filing</li>
          <li>Legal or financial advice</li>
          <li>Guaranteed accurate calculations for your specific situation</li>
        </ul>

        <h3>Professional Consultation Recommended</h3>
        <p>
          We strongly recommend consulting with qualified tax professionals, especially for:
        </p>
        <ul>
          <li>Complex tax situations involving multiple income sources</li>
          <li>Business tax planning and QBI deduction optimization</li>
          <li>State-specific tax considerations and local tax implications</li>
          <li>Tax strategy planning and year-end tax moves</li>
          <li>Audit preparation and IRS correspondence</li>
        </ul>

        <h2>Service Availability and Updates</h2>
        <h3>Free Service</h3>
        <p>
          Big Beautiful Bill Calculator is provided free of charge. We reserve the right to:
        </p>
        <ul>
          <li>Modify or discontinue features at any time</li>
          <li>Implement usage limits if necessary to maintain service quality</li>
          <li>Update our calculations based on new tax legislation</li>
        </ul>

        <h3>Tax Law Updates</h3>
        <p>
          We make every effort to keep our US Tax Law 2025 Calculator current with the latest tax laws, including:
        </p>
        <ul>
          <li>H.R.1 One Big Beautiful Bill Act provisions</li>
          <li>IRS guidance and regulation updates</li>
          <li>State tax law changes</li>
          <li>Federal tax bracket adjustments</li>
        </ul>

        <h2>Privacy and Data Protection</h2>
        <p>
          Your tax information privacy is paramount. Our service is designed with privacy-first principles:
        </p>
        <ul>
          <li>All calculations are performed locally in your browser</li>
          <li>We do not store your personal tax information on our servers</li>
          <li>Anonymous usage analytics help us improve the service</li>
          <li>For detailed information, please review our <a href="/privacy-policy">Privacy Policy</a></li>
        </ul>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Big Beautiful Bill Calculator shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
        </p>
        <ul>
          <li>Use of or inability to use our tax calculation service</li>
          <li>Errors or inaccuracies in tax calculations or estimates</li>
          <li>Reliance on our calculations for official tax filing</li>
          <li>Changes in tax laws that affect calculation accuracy</li>
          <li>Loss of data or interruption of service</li>
          <li>Tax penalties or interest resulting from calculation errors</li>
        </ul>

        <h2>Disclaimer of Warranties</h2>
        <p>
          The service is provided on an "as is" and "as available" basis. We make no warranties or representations about:
        </p>
        <ul>
          <li>The accuracy, reliability, or completeness of tax calculations</li>
          <li>The availability or uninterrupted operation of our service</li>
          <li>The suitability of our calculations for your specific tax situation</li>
          <li>Compliance with all applicable tax laws and regulations</li>
        </ul>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Big Beautiful Bill Calculator, its operators, affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
        </p>
        <ul>
          <li>Your use of our tax calculation service</li>
          <li>Violation of these Terms of Service</li>
          <li>Infringement of intellectual property rights</li>
          <li>Reliance on our calculations for official tax purposes</li>
        </ul>

        <h2>Governing Law and Dispute Resolution</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the United States and the State of Delaware, without regard to conflict of law provisions. Any disputes arising from these Terms or the service will be resolved through binding arbitration in Delaware.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We reserve the right to update or modify these Terms at any time to reflect:
        </p>
        <ul>
          <li>Changes in tax laws and regulations</li>
          <li>Updates to our service features</li>
          <li>Legal or regulatory requirements</li>
        </ul>
        <p>
          Changes will be effective immediately upon posting on our website. Your continued use of the service after any changes signifies your acceptance of the new terms.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms or our service, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@bigbeautifulbillcalculator.org">support@bigbeautifulbillcalculator.org</a></li>
          <li><strong>Legal Inquiries:</strong> <a href="mailto:legal@bigbeautifulbillcalculator.org">legal@bigbeautifulbillcalculator.org</a></li>
          <li><strong>Mailing Address:</strong> Big Beautiful Bill Calculator Legal Team, 1234 Tax Avenue, Suite 2025, Washington, DC 20001</li>
        </ul>

        <h2>Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
        </p>

        <hr />

        <p>
          <strong>By using Big Beautiful Bill Calculator, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong> Thank you for choosing our free US Remittance Tax Calculator for your 2025 tax planning needs!
        </p>

        <p>
          <em>Remember: Always consult with qualified tax professionals for official tax advice and complex tax situations. Our H.R.1 Tax Calculator 2025 is designed to assist with tax planning and estimation, not replace professional tax services.</em>
        </p>
      </div>
    </>
  );
} 