import type { Metadata } from "next";
import { generateLegalPageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Cookie Policy - WhatsMyName",
  description: "Learn about how WhatsMyName uses cookies to enhance your tax calculation experience while protecting your privacy.",
  alternates: {
    canonical: "https://bigbeautifulbillcalculator.org/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy - WhatsMyName",
    description: "Learn about how WhatsMyName uses cookies to enhance your tax calculation experience while protecting your privacy.",
  },
};

export default function CookiePolicy({ params }: { params: { locale: string } }) {
  const structuredData = generateLegalPageStructuredData('cookie', params.locale);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
      />
      <div className="prose dark:prose-invert max-w-none">
        <h1>Cookie Policy</h1>

        <p><strong>Last updated: July 8, 2025</strong></p>

        <h2>Introduction</h2>
        <p>
          At WhatsMyName, we believe in transparency about how we collect and use data when you use our free US Remittance Tax Calculator. This Cookie Policy explains how and why we use cookies and similar technologies on our website to provide you with the best possible tax calculation experience.
        </p>

        <h2>What Are Cookies</h2>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, smartphone) when you visit our WhatsMyName website. These files contain information that helps us provide you with a better experience by:
        </p>
        <ul>
          <li>Remembering your calculator preferences and settings</li>
          <li>Ensuring our H.R.1 Tax Calculator 2025 functions properly</li>
          <li>Analyzing how users interact with our tax calculation tools</li>
          <li>Improving the performance and security of our service</li>
        </ul>

        <h2>Types of Cookies We Use</h2>
        
        <h3>Essential Cookies (Always Active)</h3>
        <p>
          These cookies are necessary for our One Big Beautiful Bill Tax Calculator to function properly and cannot be disabled:
        </p>
        <ul>
          <li><strong>Security Cookies:</strong> Protect against cross-site request forgery and ensure secure browsing</li>
          <li><strong>Session Management:</strong> Maintain your calculator session and prevent data loss</li>
          <li><strong>Load Balancing:</strong> Ensure optimal performance of our tax calculation service</li>
          <li><strong>Error Prevention:</strong> Help us identify and prevent technical issues</li>
        </ul>

        <h3>Functional Cookies (Optional)</h3>
        <p>
          These cookies enhance your experience with our American Tax Reform Calculator 2025:
        </p>
        <ul>
          <li><strong>Calculator Preferences:</strong> Remember your filing status, state selection, and calculation preferences</li>
          <li><strong>Display Settings:</strong> Save your preferred theme (light/dark mode) and language settings</li>
          <li><strong>Recent Calculations:</strong> Store your recent tax scenarios for easy access (stored locally only)</li>
          <li><strong>Tutorial Progress:</strong> Remember which features you've explored in our tax tool</li>
        </ul>

        <h3>Analytics Cookies (Optional)</h3>
        <p>
          These cookies help us understand how users interact with our Big Beautiful Bill Tax Tool:
        </p>
        <ul>
          <li><strong>Usage Analytics:</strong> Track which calculator features are most popular (anonymized data only)</li>
          <li><strong>Performance Monitoring:</strong> Measure page load times and identify areas for improvement</li>
          <li><strong>Error Tracking:</strong> Identify and fix bugs in our tax calculation algorithms</li>
          <li><strong>User Flow Analysis:</strong> Understand how users navigate through our tax planning tools</li>
        </ul>

        <h3>Marketing Cookies (Optional)</h3>
        <p>
          These cookies may be used to provide relevant tax-related information:
        </p>
        <ul>
          <li><strong>Content Personalization:</strong> Show relevant tax tips based on your calculator usage</li>
          <li><strong>Educational Content:</strong> Display helpful information about H.R.1 tax law changes</li>
          <li><strong>Feature Announcements:</strong> Notify you about new calculator features and tax law updates</li>
        </ul>

        <h2>How We Protect Your Tax Privacy</h2>
        
        <h3>No Personal Tax Data in Cookies</h3>
        <p>
          <strong>IMPORTANT:</strong> We never store your actual tax information (income, expenses, personal details) in cookies. All sensitive tax calculations in our US Tax Law 2025 Calculator happen locally in your browser and are never transmitted to our servers.
        </p>

        <h3>Data Minimization</h3>
        <p>
          We only collect the minimum data necessary to provide our service:
        </p>
        <ul>
          <li>Calculator preferences and settings (no financial data)</li>
          <li>Technical information for website functionality</li>
          <li>Anonymous usage patterns to improve our service</li>
          <li>Error logs to fix technical issues (no personal information)</li>
        </ul>

        <h2>Third-Party Cookies</h2>
        
        <h3>Analytics Services</h3>
        <p>
          We may use trusted third-party services to help us understand how our US Overseas Remittance Fee Calculator is being used:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> Provides anonymous website usage statistics</li>
          <li><strong>Performance Monitoring:</strong> Helps us identify and fix technical issues</li>
          <li><strong>Security Services:</strong> Protect against malicious activity and abuse</li>
        </ul>

        <h3>Content Delivery</h3>
        <p>
          We use content delivery networks (CDNs) to ensure fast loading of our calculator:
        </p>
        <ul>
          <li>Static asset delivery (images, CSS, JavaScript files)</li>
          <li>Geographic load balancing for optimal performance</li>
          <li>DDoS protection and security monitoring</li>
        </ul>

        <h2>Managing Your Cookie Preferences</h2>
        
        <h3>Browser Settings</h3>
        <p>
          You can control cookies through your browser settings. Here&apos;s how to manage cookies in popular browsers:
        </p>
        <ul>
          <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
          <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
          <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
        </ul>

        <h3>Cookie Consent Management</h3>
        <p>
          When you first visit our WhatsMyName, you can choose which types of cookies to accept:
        </p>
        <ul>
          <li><strong>Accept All:</strong> Enable all cookies for the best experience</li>
          <li><strong>Essential Only:</strong> Use only necessary cookies (may limit some features)</li>
          <li><strong>Custom Settings:</strong> Choose specific cookie categories</li>
          <li><strong>Manage Preferences:</strong> Change your settings at any time</li>
        </ul>

        <h2>Impact of Disabling Cookies</h2>
        
        <h3>Essential Cookies Disabled</h3>
        <p>
          If you disable essential cookies, you may experience:
        </p>
        <ul>
          <li>Security warnings or reduced protection</li>
          <li>Loss of calculator session data</li>
          <li>Potential functionality issues with our tax tools</li>
          <li>Inability to save preferences or settings</li>
        </ul>

        <h3>Functional Cookies Disabled</h3>
        <p>
          Disabling functional cookies may result in:
        </p>
        <ul>
          <li>Need to re-enter preferences each visit</li>
          <li>Loss of personalized calculator settings</li>
          <li>Inability to save recent tax calculations</li>
          <li>Default theme and language settings only</li>
        </ul>

        <h3>Analytics Cookies Disabled</h3>
        <p>
          Your calculator functionality won't be affected, but we won't be able to:
        </p>
        <ul>
          <li>Understand which features are most useful</li>
          <li>Identify areas for improvement</li>
          <li>Track performance issues</li>
          <li>Optimize the user experience</li>
        </ul>

        <h2>Cookie Retention and Deletion</h2>
        
        <h3>Automatic Expiration</h3>
        <p>Different cookies have different lifespans:</p>
        <ul>
          <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Preference Cookies:</strong> Stored for up to 1 year</li>
          <li><strong>Analytics Cookies:</strong> Stored for up to 2 years</li>
          <li><strong>Security Cookies:</strong> Stored for the duration of your session</li>
        </ul>

        <h3>Manual Deletion</h3>
        <p>You can delete cookies at any time by:</p>
        <ul>
          <li>Clearing your browser data and cookies</li>
          <li>Using private/incognito browsing mode</li>
          <li>Adjusting your cookie preferences on our website</li>
          <li>Using browser extensions that manage cookies</li>
        </ul>

        <h2>Mobile App Considerations</h2>
        <p>
          If we develop a mobile app for our tax calculator in the future, similar data collection principles will apply using mobile-specific technologies like:
        </p>
        <ul>
          <li>App preferences and settings storage</li>
          <li>Anonymous usage analytics</li>
          <li>Crash reporting and error logging</li>
          <li>Performance monitoring</li>
        </ul>

        <h2>Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy to reflect:
        </p>
        <ul>
          <li>Changes in cookie technology</li>
          <li>New features in our tax calculator</li>
          <li>Updated privacy regulations</li>
          <li>Improvements to our data practices</li>
        </ul>
        <p>
          We will notify you of any material changes by posting the updated policy on our website with a new "Last updated" date.
        </p>

        <h2>Legal Compliance</h2>
        <p>
          Our cookie practices comply with:
        </p>
        <ul>
          <li><strong>GDPR:</strong> European Union General Data Protection Regulation</li>
          <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
          <li><strong>PECR:</strong> UK Privacy and Electronic Communications Regulations</li>
          <li><strong>ePrivacy Directive:</strong> EU electronic communications privacy rules</li>
        </ul>

        <h2>Contact Us About Cookies</h2>
        <p>
          If you have any questions about our use of cookies or this Cookie Policy, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@bigbeautifulbillcalculator.org">privacy@bigbeautifulbillcalculator.org</a></li>
          <li><strong>Cookie Questions:</strong> <a href="mailto:cookies@bigbeautifulbillcalculator.org">cookies@bigbeautifulbillcalculator.org</a></li>
          <li><strong>Mailing Address:</strong> WhatsMyName Privacy Team, 1234 Tax Avenue, Suite 2025, Washington, DC 20001</li>
        </ul>

        <h2>Your Rights</h2>
        <p>
          Regarding cookies and data collection, you have the right to:
        </p>
        <ul>
          <li><strong>Know:</strong> Understand what cookies we use and why</li>
          <li><strong>Choose:</strong> Accept or decline non-essential cookies</li>
          <li><strong>Access:</strong> Request information about your cookie data</li>
          <li><strong>Delete:</strong> Remove cookies from your device at any time</li>
          <li><strong>Withdraw Consent:</strong> Change your cookie preferences</li>
        </ul>

        <hr />

        <p>
          <strong>Remember:</strong> Our primary goal is to provide you with accurate, secure, and private tax calculations. We use cookies responsibly to enhance your experience with our One Big Beautiful Bill Tax Calculator while protecting your privacy and sensitive financial information.
        </p>

        <p>
          <em>For more information about how we protect your data, please also review our <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms-of-service">Terms of Service</a>.</em>
        </p>
      </div>
    </>
  );
}