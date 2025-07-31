import React from "react";
import WaiverSignatureForm from '../forms/WaiverSignatureForm';

const PhotoWaiverPage: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-1 text-gray-900 mb-8">Photo Release Waiver</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              PHOTO AND VIDEO RELEASE AUTHORIZATION
            </h2>
            <p className="text-sm text-gray-600 italic">
              Please read this document carefully before participating in any Out Sports activities.
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. GRANT OF RIGHTS</h3>
              <p className="text-sm leading-relaxed">
                I hereby grant to Out Sports, its successors, assigns, licensees, and legal representatives, 
                the irrevocable and unrestricted right to use and publish photographs, videos, digital images, 
                and audio recordings of me taken during Out Sports activities. This includes the right to 
                edit, alter, copy, exhibit, publish, or distribute these materials for any lawful purpose.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. PERMITTED USES</h3>
              <p className="text-sm leading-relaxed">
                These materials may be used for promotional materials, websites, social media, newsletters, 
                brochures, advertisements, fundraising materials, news articles, or any other purpose that 
                promotes Out Sports activities and community engagement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. WAIVER OF COMPENSATION</h3>
              <p className="text-sm leading-relaxed">
                I waive any right to royalties, proceeds, or other compensation arising or related to the 
                use of these materials. I understand that I will not receive any financial compensation 
                for the use of my likeness.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. RELEASE OF CLAIMS</h3>
              <p className="text-sm leading-relaxed">
                I hereby release Out Sports from any claims, demands, or causes of action arising out of 
                or related to any use of the materials, including without limitation any claims for invasion 
                of privacy, defamation, or violation of moral rights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. COPYRIGHT AND OWNERSHIP</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports will own the copyright and all other rights to the photographs, 
                videos, and recordings. I acknowledge that I have no ownership rights in these materials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. THIRD-PARTY USAGE</h3>
              <p className="text-sm leading-relaxed">
                Out Sports may provide these materials to media outlets, sponsors, partner organizations, 
                or other third parties for purposes related to promoting recreational sports and community 
                activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. DURATION AND SCOPE</h3>
              <p className="text-sm leading-relaxed">
                This release is perpetual and covers all photographs, videos, and recordings taken during 
                any Out Sports activity or event where I am present.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. MINOR PARTICIPANTS</h3>
              <p className="text-sm leading-relaxed">
                If the participant is under 18 years of age, this release must be signed by a parent or 
                legal guardian who has the authority to grant these rights on behalf of the minor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. VOLUNTARY PARTICIPATION</h3>
              <p className="text-sm leading-relaxed">
                I understand that my participation in photo and video activities is voluntary, and I may 
                request to opt out of specific photo or video sessions while still participating in 
                Out Sports activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. ACKNOWLEDGMENT</h3>
              <p className="text-sm leading-relaxed">
                I acknowledge that I have read this release, understand its contents, and agree to be 
                bound by its terms. I am signing this voluntarily and certify that I am at least 18 years 
                of age or have parental/guardian consent.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              This release is effective for all Out Sports activities and remains in effect unless revoked 
              in writing. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Digital Signature Section */}
          <WaiverSignatureForm 
            waiverType="photo_release" 
            waiverTitle="Photo Release Waiver" 
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoWaiverPage;
