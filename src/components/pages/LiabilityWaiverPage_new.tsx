import React from "react";
import WaiverSignatureForm from '../forms/WaiverSignatureForm';

const LiabilityWaiverPage: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-1 text-gray-900 mb-8">General Liability Waiver and Release</h1>
        
        {/* Scroll to Sign Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Please scroll to the bottom of this document to digitally sign the waiver.</strong> You must read through all sections and sign at the bottom to complete your registration.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              WAIVER AND RELEASE FROM LIABILITY
            </h2>
            <p className="text-sm text-gray-600 italic">
              Please read this document carefully before participating in any Out Sports activities.
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. ASSUMPTION OF RISK</h3>
              <p className="text-sm leading-relaxed">
                I acknowledge that participation in recreational sports activities including but not limited to 
                kickball, dodgeball, and other athletic activities organized by Out Sports involves inherent 
                risks of serious injury, permanent disability, paralysis, and death. These risks include, but 
                are not limited to: contact with other participants, equipment, playing surfaces, weather 
                conditions, and facilities. I voluntarily assume all such risks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. RELEASE AND WAIVER</h3>
              <p className="text-sm leading-relaxed">
                In consideration for being permitted to participate in Out Sports activities, I hereby RELEASE, 
                WAIVE, DISCHARGE, and COVENANT NOT TO SUE Out Sports, its organizers, sponsors, supervisors, 
                participants, and persons or entities acting in any capacity on their behalf (collectively 
                "Released Parties") from any and all liability, claims, demands, losses, or damages caused by 
                the negligence of the Released Parties or otherwise, including negligent rescue operations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. INDEMNIFICATION</h3>
              <p className="text-sm leading-relaxed">
                I agree to INDEMNIFY AND HOLD HARMLESS the Released Parties from any and all liabilities or 
                claims made by other individuals or entities as a result of or relating to my participation 
                in Out Sports activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. MEDICAL CONDITION</h3>
              <p className="text-sm leading-relaxed">
                I represent that I am in good health and have no physical limitations, medical ailments, 
                physical or mental impairments or disabilities that would limit or prevent my participation 
                in these activities. If I have any such limitations, I have received physician approval 
                for participation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. SAFETY RULES AND REGULATIONS</h3>
              <p className="text-sm leading-relaxed">
                I agree to observe and obey all posted rules and warnings, and further agree to follow 
                any oral instructions or directions given by Out Sports organizers, or the employees, 
                representatives or agents of Out Sports.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. PERSONAL PROPERTY</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports is not responsible for any loss, theft, or damage to personal 
                property during participation in activities or while on premises.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. PHOTOGRAPHY AND VIDEO CONSENT</h3>
              <p className="text-sm leading-relaxed">
                I consent to the use of my likeness in photographs and videos taken during Out Sports 
                activities for promotional, educational, or other purposes related to Out Sports.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. ALCOHOL AND SUBSTANCE POLICY</h3>
              <p className="text-sm leading-relaxed">
                I agree not to participate in any Out Sports activities while under the influence of 
                alcohol or any controlled substance that could impair my ability to safely participate.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. SEVERABILITY</h3>
              <p className="text-sm leading-relaxed">
                If any portion of this agreement is found to be void or unenforceable, the remaining 
                portions shall remain in full force and effect.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. GOVERNING LAW</h3>
              <p className="text-sm leading-relaxed">
                This agreement shall be governed by the laws of the jurisdiction in which the activities 
                take place, without regard to conflict of law principles.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">11. ACKNOWLEDGMENT AND UNDERSTANDING</h3>
              <p className="text-sm leading-relaxed">
                I acknowledge that I have read this entire waiver and release, understand it completely, 
                understand that it affects my legal rights, and agree to be bound by its terms. I am 
                signing this agreement voluntarily and certify that I am at least 18 years of age.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              This waiver is effective for all Out Sports activities and remains in effect unless revoked 
              in writing. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Digital Signature Section */}
          <WaiverSignatureForm 
            waiverType="liability" 
            waiverTitle="General Liability Waiver and Release" 
          />
        </div>
      </div>
    </div>
  );
};

export default LiabilityWaiverPage;
