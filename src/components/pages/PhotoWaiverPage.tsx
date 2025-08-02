import React from "react";
import WaiverSignatureForm from '../forms/WaiverSignatureForm';

const PhotoWaiverPage: React.FC = () => {
  return (
    <div className="container-custom py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-1 text-gray-900 mb-8">Photo and Video Permission</h1>
        
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
              PHOTO AND VIDEO PERMISSION FORM
            </h2>
            <p className="text-sm text-gray-600 italic">
              Please read this permission form to understand how photos and videos from Out Sports activities may be used.
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. PERMISSION FOR OUT SPORTS ADMINISTRATORS</h3>
              <p className="text-sm leading-relaxed">
                I give Out Sports administrators and official representatives permission to take and use 
                photographs, videos, and digital images of me during Out Sports activities. This permission 
                applies only to photos/videos taken by Out Sports staff, volunteers, and authorized personnel. 
                This includes the right to edit these materials as needed for promotional purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. HOW OUT SPORTS WILL USE PHOTOS AND VIDEOS</h3>
              <p className="text-sm leading-relaxed">
                These materials taken by Out Sports administrators may be used for promotional materials, 
                websites, social media, newsletters, brochures, advertisements, or other purposes that help 
                promote Out Sports activities and build our community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. NO PAYMENT EXPECTED</h3>
              <p className="text-sm leading-relaxed">
                I understand that I will not receive any payment for the use of photos and videos taken 
                by Out Sports administrators. This is a volunteer contribution to help promote our sports community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. RESPONSIBLE USAGE BY OUT SPORTS</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports administrators will handle photos and videos they take responsibly 
                and use them in a positive way to represent our sports community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. OWNERSHIP OF OUT SPORTS PHOTOS</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports will own the rights to photographs and videos they take 
                during activities through their administrators and authorized personnel.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. SHARING WITH PARTNERS</h3>
              <p className="text-sm leading-relaxed">
                Out Sports may share photos and videos they have taken with media outlets, sponsors, 
                partner organizations, or other groups that help support recreational sports and community activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. ONGOING PERMISSION FOR OUT SPORTS</h3>
              <p className="text-sm leading-relaxed">
                This permission covers all photographs and videos taken by Out Sports administrators 
                during any Out Sports activity or event where I participate, and continues unless I request 
                otherwise in writing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. PUBLIC SPACE ACKNOWLEDGMENT</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports activities take place in public spaces where other individuals 
                (participants, spectators, passersby) may take photos or videos that include me. This waiver 
                only applies to photos/videos taken by Out Sports administrators and does not control what 
                others may photograph in public spaces.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. VOLUNTARY PARTICIPATION WITH OUT SPORTS PHOTOGRAPHY</h3>
              <p className="text-sm leading-relaxed">
                I understand that being photographed by Out Sports administrators is voluntary. I can ask 
                to opt out of specific Out Sports photo or video sessions while still participating in 
                Out Sports activities. However, I acknowledge that others in public spaces may still 
                take photos that include me.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. MY AGREEMENT AND UNDERSTANDING</h3>
              <p className="text-sm leading-relaxed">
                I have read this permission form, understand that it applies specifically to Out Sports 
                administrators taking and using photos/videos, and understand that others in public spaces 
                may take photos that Out Sports has no control over. I am providing this permission to 
                Out Sports voluntarily and only for their official photography and videography.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500">
              This permission form is effective for all Out Sports activities and remains in effect unless revoked 
              in writing. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Digital Signature Section */}
          <WaiverSignatureForm 
            waiverType="photo_release" 
            waiverTitle="Photo and Video Permission" 
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoWaiverPage;
