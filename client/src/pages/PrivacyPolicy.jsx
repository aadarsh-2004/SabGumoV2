import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  // --- IMPORTANT LEGAL NOTICE ---
  // This is a basic template. It MUST be reviewed, customized, and approved 
  // by a qualified legal professional to ensure compliance with all applicable 
  // laws and regulations (e.g., GDPR, CCPA) and accurately reflect your specific 
  // data handling practices. Do NOT use this as-is without legal review.
  // --- END LEGAL NOTICE ---

  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Privacy Policy for SabGumo.com
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last Updated: [Insert Date of Last Update]
        </p>

        {/* Introduction */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to SabGumo.com ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at [Insert Contact Email Address].
          </p>
          <p className="text-gray-700 leading-relaxed">
            This privacy notice describes how we might use your information if you visit our website at SabGumo.com, engage with us in other related ways ― including any sales, marketing, or events.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Please read this privacy notice carefully as it will help you understand what we do with the information that we collect.
          </p>
          <p className="text-gray-700 leading-relaxed">
             <strong>LEGAL DISCLAIMER: This is a template and requires legal review.</strong>
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">2. What Information Do We Collect?</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following: names; phone numbers; email addresses; mailing addresses; usernames; passwords; contact preferences; billing addresses; debit/credit card numbers; contact or authentication data; and other similar information.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
          </p>
           <p className="text-gray-700 leading-relaxed">
            Like many businesses, we also collect information through cookies and similar technologies. [Add more details about cookies if applicable].
          </p>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">3. How Do We Use Your Information?</h2>
          <p className="text-gray-700 leading-relaxed">
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials (with consent).</li>
            <li>Request feedback.</li>
            <li>To enable user-to-user communications (with consent).</li>
            <li>To manage user accounts.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our Services.</li>
            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
            <li>To respond to legal requests and prevent harm.</li>
            <li>Fulfill and manage your orders/bookings.</li>
            <li>Administer prize draws and competitions.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To send you marketing and promotional communications (with opt-out).</li>
            <li>Deliver targeted advertising to you (with opt-out).</li>
            <li>For other Business Purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, marketing and your experience.</li>
             <li>[Add/Remove/Modify Purposes as needed - REQUIRES LEGAL REVIEW]</li>
          </ul>
        </section>
        
        {/* Sharing Your Information */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">4. Will Your Information Be Shared With Anyone?</h2>
           <p className="text-gray-700 leading-relaxed">
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: [List specific bases like Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, Vital Interests - REQUIRES LEGAL REVIEW].
          </p>
           <p className="text-gray-700 leading-relaxed">
            More specifically, we may need to process your data or share your personal information in the following situations: [List specific situations like Business Transfers, Affiliates, Business Partners, Third-Party Vendors - REQUIRES LEGAL REVIEW].
          </p>
        </section>

        {/* Data Retention */}
         <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">5. How Long Do We Keep Your Information?</h2>
          <p className="text-gray-700 leading-relaxed">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). [Specify retention periods or criteria - REQUIRES LEGAL REVIEW].
          </p>
        </section>

        {/* Data Security */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">6. How Do We Keep Your Information Safe?</h2>
          <p className="text-gray-700 leading-relaxed">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. [Review and detail specific security measures if appropriate - REQUIRES LEGAL REVIEW].
          </p>
        </section>

        {/* Your Privacy Rights */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">7. What Are Your Privacy Rights?</h2>
          <p className="text-gray-700 leading-relaxed">
            In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below.
          </p>
           <p className="text-gray-700 leading-relaxed">
            [Include details on how users can exercise their rights, account information review/changes, opt-out of marketing, California rights (CCPA), etc. - REQUIRES LEGAL REVIEW].
          </p>
        </section>

        {/* Policy Updates */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">8. Do We Make Updates to This Notice?</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </p>
        </section>
        
        {/* Contact Us */}
        <section className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">9. How Can You Contact Us About This Notice?</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions or comments about this notice, you may email us at [Insert Contact Email Address] or by post to:
          </p>
          <p className="text-gray-700 leading-relaxed">
            [Your Company Name]<br />
            [Your Company Street Address]<br />
            [Your Company City, State, Zip Code]<br />
            [Your Company Country]
          </p>
        </section>
         <p className="text-sm text-red-600 font-semibold mt-12">
            Disclaimer: This privacy policy is a template and requires review by a qualified legal professional before publication.
          </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 