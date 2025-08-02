import React from "react";
import WaiverSignatureForm from '../forms/WaiverSignatureForm';

const LiabilityWaiverPage: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-1 text-gray-900 mb-8">Participation Agreement</h1>
        
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
              PARTICIPATION AGREEMENT AND WAIVER
            </h2>
            <p className="text-sm text-gray-600 italic">
              Please read this agreement carefully before participating in Out Sports activities. This helps ensure everyone has a safe and fun experience!
            </p>
          </div>

          {/* Formal Legal Waiver Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
              <p className="font-medium">
                In consideration of being allowed to participate in any way in Out Sports of the Quad Cities kickball 
                competitions, games, events, and activities, I, ________________________________ ("Participant"), 
                acknowledge and agree to the following:
              </p>
              
              <div className="space-y-3">
                <p>
                  <strong>1.</strong> I understand that Kickball shall include, but is not limited to: Kickball, leasing, orientation and 
                  instructional courses, all such activities, events, and services in any way connected to the activities 
                  stated.
                </p>
                
                <p>
                  <strong>2.</strong> I understand that Kickball requires strenuous physical exertion and tasks, and I am fully aware of the 
                  risks and hazards that are inherent, including, but not limited to, physical illness, injury, death, or other 
                  consequences arising from my participation in the activities. I take full responsibility for my health and 
                  well-being on a voluntary basis and for any risks associated with engaging in a physical activity.
                </p>
                
                <p>
                  <strong>3.</strong> I agree to abide by the rules and regulations set forth, and by participating in Out Sports of the Quad 
                  Cities sporting events. I shall withdraw my participation and waive my rights to any and all claims 
                  relating to my participation; if my participation is affected differently by any of the prescribed rules, or if 
                  I am advised by my doctor or any authorized medical representative that I am not fit to proceed with the 
                  program.
                </p>
                
                <p>
                  <strong>4.</strong> I expressly waive, release, and discharge Out Sports of the Quad Cities directors, representatives, 
                  advisors, volunteers, assigns, and other affiliates ("Releasees") of any and all responsibility, loss and 
                  harm, or injury in connection with sports activities.
                </p>
                
                <p>
                  <strong>5.</strong> I accept that I would hold harmless and indemnify the Releasees for any and all responsibility to any 
                  third party arising from my involvement in Kickball for any property damage, loss or personal injury.
                </p>
              </div>
              
              <p className="font-medium pt-4">
                I have read this Sports Waiver of Liability, fully understand its terms, and that, by signing it, I have 
                relinquished rights to hold Out Sports of the Quad Cities liable, and sign it freely and voluntarily.
              </p>
              
              <div className="space-y-4 pt-6 border-t border-gray-300">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">Additional Terms and Conditions</h3>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. TAKING RESPONSIBILITY</h4>
                  <p className="text-sm leading-relaxed">
                    I agree to take responsibility for my own actions during activities and understand 
                    that if my actions cause problems for others, I may be responsible for addressing 
                    those issues.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. HEALTH AND FITNESS</h4>
                  <p className="text-sm leading-relaxed">
                    I confirm that I am in good health and physically able to participate in these activities. 
                    If I have any health concerns, I have discussed them with my doctor and received 
                    clearance to participate in recreational sports.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. FOLLOWING THE RULES</h4>
                  <p className="text-sm leading-relaxed">
                    I agree to follow all posted rules and listen to instructions from Out Sports organizers 
                    and volunteers. This helps ensure everyone has a safe and enjoyable experience.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. PERSONAL BELONGINGS</h4>
                  <p className="text-sm leading-relaxed">
                    I understand that Out Sports is not responsible for any lost, stolen, or damaged 
                    personal items during activities. I'll keep track of my own belongings.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">5. AGE REQUIREMENT</h4>
                  <p className="text-sm leading-relaxed">
                    All participants must be 18 years of age or older to join Out Sports activities. 
                    This ensures all players can make their own decisions about participation.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">6. UNDERSTANDING THIS AGREEMENT</h4>
                  <p className="text-sm leading-relaxed">
                    I acknowledge that I have read this agreement, understand what it means, and 
                    agree to its terms. I am signing this voluntarily because I want to participate 
                    in Out Sports activities.
                  </p>
                </div>
              </div>
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
