import React, { useEffect, useRef } from 'react';
import { useWaiverForm } from '../../hooks/useWaiverForm';

interface WaiverSignatureFormProps {
  waiverType: 'liability' | 'photo_release';
  waiverTitle: string;
}

const WaiverSignatureForm: React.FC<WaiverSignatureFormProps> = ({ waiverType, waiverTitle }) => {
  const {
    formData,
    updateFormData,
    handleSubmit,
    clearForm,
    isSubmitting,
    submissionResult,
    errors,
  } = useWaiverForm(waiverType);

  const messageRef = useRef<HTMLDivElement>(null);

  // Scroll to success/error message when it appears
  useEffect(() => {
    if (submissionResult && messageRef.current) {
      messageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [submissionResult]);

  // Calculate the maximum allowed birth date (18 years ago)
  const getMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  const getButtonColor = () => {
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const getSubmissionMessage = () => {
    if (!submissionResult) return null;

    if (submissionResult.success) {
      // Show success message
      return (
        <div ref={messageRef} className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-green-800 font-semibold">{submissionResult.message}</p>
              <p className="text-green-700 text-sm mt-2">
                You can now safely navigate away from this page. Your waiver signature has been recorded.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Show error message
      return (
        <div ref={messageRef} className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-800">{submissionResult.message}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="border-t-2 border-green-200 pt-8 mt-8">
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
          <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Digital Signature Required
        </h3>
        <p className="text-green-800 text-sm leading-relaxed">
          By signing below, you confirm that you have read and agree to the terms of this {waiverTitle}. Your digital signature has the same legal effect as a handwritten signature.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Participant Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="participantName" className="block text-sm font-semibold text-gray-900 mb-2">
              Participant Full Name (required)
            </label>
            <input
              type="text"
              id="participantName"
              name="participantName"
              required
              value={formData.participantName}
              onChange={(e) => updateFormData('participantName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.participantName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter full legal name"
            />
            {errors.participantName && (
              <p className="text-red-600 text-sm mt-1">{errors.participantName}</p>
            )}
          </div>
          <div>
            <label htmlFor="participantDOB" className="block text-sm font-semibold text-gray-900 mb-2">
              Date of Birth (required)
            </label>
            <input
              type="date"
              id="participantDOB"
              name="participantDOB"
              required
              max={getMaxBirthDate()}
              value={formData.participantDOB}
              onChange={(e) => updateFormData('participantDOB', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.participantDOB ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.participantDOB && (
              <p className="text-red-600 text-sm mt-1">{errors.participantDOB}</p>
            )}
          </div>
        </div>

        {/* Minor Participant Section - Removed since all participants must be 18+ */}

        {/* Digital Signature Canvas */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Digital Signature</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label htmlFor="digitalSignature" className="block text-sm font-semibold text-gray-900 mb-2">
              Type your full legal name as your digital signature (required)
            </label>
            <input
              type="text"
              id="digitalSignature"
              name="digitalSignature"
              required
              value={formData.digitalSignature}
              onChange={(e) => updateFormData('digitalSignature', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white font-serif text-lg ${
                errors.digitalSignature ? 'border-red-300 bg-red-50' : 'border-blue-300'
              }`}
              placeholder="Type your full legal name here"
            />
            {errors.digitalSignature && (
              <p className="text-red-600 text-sm mt-1">{errors.digitalSignature}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              By typing your name above, you are providing a legal digital signature equivalent to a handwritten signature.
            </p>
          </div>
        </div>

        {/* Terms Acknowledgment */}
        <div className="border-t pt-6">
          <div className="space-y-4">
            {waiverType === 'photo_release' ? (
              // Photo release specific permission selection
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Photo Permission Selection</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Out Sports of the Quad Cities (OSQC) considers its members' preferences as a top priority. 
                    This form ensures all members have control of their visibility to the community at large. <strong>Granting permission is NOT required to participate in Out Sports, and you may return to this page at any time to change your preferences.</strong> Please read thoroughly 
                    and make a selection to grant or withhold Out Sports of the Quad Cities permission to share 
                    images in which you may appear.
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Please select your preference for photo and video usage:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start border border-green-300 bg-green-50 rounded-lg p-4">
                    <input
                      type="radio"
                      id="grantPermission"
                      name="photoPermission"
                      value="grant"
                      checked={formData.photoPermission === 'grant'}
                      onChange={(e) => updateFormData('photoPermission', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="grantPermission" className="ml-3 text-sm text-green-800">
                      <strong>I GRANT permission</strong> for Out Sports of the Quad Cities (OSQC) to use my photography, image, video, 
                      and likeness publicly to promote the league. I understand these images may be used in print, 
                      website, and/or social media. I also understand that no royalty, fee or any other compensation 
                      shall be made to me for such use.
                    </label>
                  </div>
                  
                  <div className="flex items-start border border-red-300 bg-red-50 rounded-lg p-4">
                    <input
                      type="radio"
                      id="withholdPermission"
                      name="photoPermission"
                      value="withhold"
                      checked={formData.photoPermission === 'withhold'}
                      onChange={(e) => updateFormData('photoPermission', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 mt-1"
                    />
                    <label htmlFor="withholdPermission" className="ml-3 text-sm text-red-800">
                      <strong>I WITHHOLD permission</strong> for Out Sports of the Quad Cities (OSQC) to use my photography, image, 
                      video, or likeness publicly to promote the league. I understand this may mean exclusion to 
                      protect my privacy during photo opportunities. I also understand that there is no perceived 
                      privacy in public spaces and waive my right to hold OSQC liable for images taken and released by 
                      individuals not part of the Administrative Team.
                    </label>
                  </div>
                </div>
                {errors.photoPermission && (
                  <p className="text-red-600 text-sm mt-2">{errors.photoPermission}</p>
                )}
              </div>
            ) : (
              // Liability waiver acknowledgment checkbox
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acknowledgeTerms"
                  name="acknowledgeTerms"
                  required
                  checked={formData.acknowledgeTerms}
                  onChange={(e) => updateFormData('acknowledgeTerms', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="acknowledgeTerms" className="ml-3 text-sm text-gray-900">
                  <strong>I acknowledge</strong> that I have read and understood all terms and conditions of this {waiverTitle} and agree to be bound by them.
                </label>
              </div>
            )}
            {waiverType === 'liability' && errors.acknowledgeTerms && (
              <p className="text-red-600 text-sm ml-7">{errors.acknowledgeTerms}</p>
            )}
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="voluntarySignature"
                name="voluntarySignature"
                required
                checked={formData.voluntarySignature}
                onChange={(e) => updateFormData('voluntarySignature', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="voluntarySignature" className="ml-3 text-sm text-gray-900">
                <strong>I confirm</strong> that I am signing this waiver voluntarily and understand what it means.
              </label>
            </div>
            {errors.voluntarySignature && (
              <p className="text-red-600 text-sm ml-7">{errors.voluntarySignature}</p>
            )}
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="legalAgeCertification"
                name="legalAgeCertification"
                required
                checked={formData.legalAgeCertification}
                onChange={(e) => updateFormData('legalAgeCertification', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="legalAgeCertification" className="ml-3 text-sm text-gray-900">
                <strong>I certify</strong> that I am 18 years of age or older.
              </label>
            </div>
            {errors.legalAgeCertification && (
              <p className="text-red-600 text-sm ml-7">{errors.legalAgeCertification}</p>
            )}
          </div>
        </div>

        {/* Submission */}
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={clearForm}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50 ${getButtonColor()}`}
            >
              {isSubmitting ? 'Submitting...' : `Submit ${waiverTitle}`}
            </button>
          </div>
        </div>
      </form>

      {/* Success/Error Message Display */}
      {getSubmissionMessage()}
    </div>
  );
};

export default WaiverSignatureForm;
