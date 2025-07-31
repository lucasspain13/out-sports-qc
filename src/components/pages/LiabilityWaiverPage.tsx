import React from "react";
import WaiverSignatureForm from '../forms/WaiverSignatureForm';

const LiabilityWaiverPage: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-1 text-gray-900 mb-8">Participation Agreement</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              PARTICIPATION AGREEMENT AND WAIVER
            </h2>
            <p className="text-sm text-gray-600 italic">
              Please read this agreement carefully before participating in Out Sports activities. This helps ensure everyone has a safe and fun experience!
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. UNDERSTANDING THE ACTIVITY</h3>
              <p className="text-sm leading-relaxed">
                I understand that participating in recreational sports activities like kickball and other 
                athletic activities organized by Out Sports involves physical activity and some level of risk, 
                as with any sport. I choose to participate knowing that sports activities can sometimes result 
                in injury, and I am comfortable with this level of activity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. RELEASE OF CLAIMS</h3>
              <p className="text-sm leading-relaxed">
                In exchange for being able to participate in Out Sports activities, I agree not to hold 
                Out Sports, its organizers, sponsors, or volunteers responsible for any injuries or 
                issues that might occur during normal sports activities. This helps protect the 
                organization so we can continue offering these fun community activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. TAKING RESPONSIBILITY</h3>
              <p className="text-sm leading-relaxed">
                I agree to take responsibility for my own actions during activities and understand 
                that if my actions cause problems for others, I may be responsible for addressing 
                those issues.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. HEALTH AND FITNESS</h3>
              <p className="text-sm leading-relaxed">
                I confirm that I am in good health and physically able to participate in these activities. 
                If I have any health concerns, I have discussed them with my doctor and received 
                clearance to participate in recreational sports.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. FOLLOWING THE RULES</h3>
              <p className="text-sm leading-relaxed">
                I agree to follow all posted rules and listen to instructions from Out Sports organizers 
                and volunteers. This helps ensure everyone has a safe and enjoyable experience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. PERSONAL BELONGINGS</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports is not responsible for any lost, stolen, or damaged 
                personal items during activities. I'll keep track of my own belongings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. PHOTOS AND VIDEOS</h3>
              <p className="text-sm leading-relaxed">
                I'm okay with photos and videos being taken during Out Sports activities for 
                promotional purposes. This helps share the fun of our community with others!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. SUBSTANCE POLICY</h3>
              <p className="text-sm leading-relaxed">
                I agree not to participate in activities while under the influence of alcohol or 
                any substances that could affect my ability to play safely.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. AGE REQUIREMENT</h3>
              <p className="text-sm leading-relaxed">
                All participants must be 18 years of age or older to join Out Sports activities. 
                This ensures all players can make their own decisions about participation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. UNDERSTANDING THIS AGREEMENT</h3>
              <p className="text-sm leading-relaxed">
                I acknowledge that I have read this agreement, understand what it means, and 
                agree to its terms. I am signing this voluntarily because I want to participate 
                in Out Sports activities.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              This agreement is effective for all Out Sports activities and remains in effect unless revoked 
              in writing. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Digital Signature Section */}
          <WaiverSignatureForm 
            waiverType="liability" 
            waiverTitle="Participation Agreement" 
          />
        </div>
      </div>
    </div>
  );
};

export default LiabilityWaiverPage;
