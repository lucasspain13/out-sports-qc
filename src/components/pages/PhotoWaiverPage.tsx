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
              <h3 className="font-semibold text-gray-900 mb-2">1. PERMISSION TO USE PHOTOS AND VIDEOS</h3>
              <p className="text-sm leading-relaxed">
                I give Out Sports permission to use photographs, videos, and digital images of me 
                taken during Out Sports activities. This includes the right to edit these materials 
                as needed for promotional purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. HOW PHOTOS AND VIDEOS WILL BE USED</h3>
              <p className="text-sm leading-relaxed">
                These materials may be used for promotional materials, websites, social media, newsletters, 
                brochures, advertisements, or other purposes that help promote Out Sports activities 
                and build our community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. NO PAYMENT EXPECTED</h3>
              <p className="text-sm leading-relaxed">
                I understand that I will not receive any payment for the use of these photos and videos. 
                This is a volunteer contribution to help promote our sports community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. UNDERSTANDING ABOUT USAGE</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports will handle these photos and videos responsibly and 
                use them in a positive way to represent our sports community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. OWNERSHIP</h3>
              <p className="text-sm leading-relaxed">
                I understand that Out Sports will own the rights to these photographs and videos 
                once they are taken during activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. SHARING WITH PARTNERS</h3>
              <p className="text-sm leading-relaxed">
                Out Sports may share these materials with media outlets, sponsors, partner organizations, 
                or other groups that help support recreational sports and community activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. ONGOING PERMISSION</h3>
              <p className="text-sm leading-relaxed">
                This permission covers all photographs and videos taken during any Out Sports 
                activity or event where I participate, and continues unless I request otherwise 
                in writing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. AGE REQUIREMENT</h3>
              <p className="text-sm leading-relaxed">
                All participants must be 18 years of age or older. This ensures that everyone 
                can make their own decisions about photo and video permissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. VOLUNTARY PARTICIPATION</h3>
              <p className="text-sm leading-relaxed">
                I understand that being in photos and videos is voluntary. I can ask to opt out 
                of specific photo or video sessions while still participating in Out Sports activities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. MY AGREEMENT</h3>
              <p className="text-sm leading-relaxed">
                I have read this permission form, understand what it means, and agree to give 
                Out Sports permission to use my photos and videos as described. I am providing 
                this permission voluntarily.
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
