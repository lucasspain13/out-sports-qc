import { useState } from 'react';
import { waiverService, WaiverSignatureData, WaiverSubmissionResponse } from '../services/waiverService';

export interface WaiverFormData {
  participantName: string;
  participantDOB: string;
  digitalSignature: string;
  acknowledgeTerms: boolean;
  voluntarySignature: boolean;
  legalAgeCertification: boolean;
  photoPermission?: 'grant' | 'withhold'; // For photo release waiver only
}

export const useWaiverForm = (waiverType: 'liability' | 'photo_release') => {
  const [formData, setFormData] = useState<WaiverFormData>({
    participantName: '',
    participantDOB: '',
    digitalSignature: '',
    acknowledgeTerms: false,
    voluntarySignature: false,
    legalAgeCertification: false,
    photoPermission: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<WaiverSubmissionResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof WaiverFormData, string>>>({});

  const updateFormData = (field: keyof WaiverFormData, value: string | boolean) => {
    // For photo release, update acknowledgeTerms based on photoPermission selection
    if (field === 'photoPermission' && waiverType === 'photo_release') {
      setFormData(prev => ({ 
        ...prev, 
        photoPermission: value as 'grant' | 'withhold',
        acknowledgeTerms: value === 'grant' ? true : false
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WaiverFormData, string>> = {};

    // Required field validation with full name check
    if (!formData.participantName.trim()) {
      newErrors.participantName = 'Participant name is required';
    } else {
      const nameParts = formData.participantName.trim().split(/\s+/);
      if (nameParts.length < 2 || nameParts.some(part => part.length < 1)) {
        newErrors.participantName = 'Please enter your full name (first and last name)';
      }
    }

    // Age validation - must be 18+
    if (!formData.participantDOB) {
      newErrors.participantDOB = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.participantDOB);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      // Adjust age if birthday hasn't occurred this year
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
      
      if (actualAge < 18) {
        newErrors.participantDOB = 'Participant must be at least 18 years old';
      }
    }

    if (!formData.digitalSignature.trim()) {
      newErrors.digitalSignature = 'Digital signature is required';
    } else {
      // Check if digital signature matches participant name EXACTLY (case-sensitive)
      if (formData.digitalSignature.trim() !== formData.participantName.trim()) {
        newErrors.digitalSignature = 'Digital signature must match participant name exactly (including capitalization)';
      } else {
        // Check if digital signature is a full name
        const signatureParts = formData.digitalSignature.trim().split(/\s+/);
        if (signatureParts.length < 2 || signatureParts.some(part => part.length < 1)) {
          newErrors.digitalSignature = 'Digital signature must be your full legal name (first and last name)';
        }
      }
    }

    // Minor validation removed - all participants must be 18+

    // Acknowledgment validation
    if (waiverType === 'photo_release') {
      // For photo release, require permission selection instead of acknowledgeTerms checkbox
      if (!formData.photoPermission) {
        newErrors.photoPermission = 'You must select either grant or withhold permission';
      }
    } else {
      // For liability waiver, require acknowledgeTerms checkbox
      if (!formData.acknowledgeTerms) {
        newErrors.acknowledgeTerms = 'You must acknowledge the terms';
      }
    }

    if (!formData.voluntarySignature) {
      newErrors.voluntarySignature = 'You must confirm voluntary signature';
    }

    if (!formData.legalAgeCertification) {
      newErrors.legalAgeCertification = 'You must certify legal age or guardian authority';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const waiverData: WaiverSignatureData = {
        waiverType,
        participantName: formData.participantName,
        participantDOB: formData.participantDOB,
        digitalSignature: formData.digitalSignature,
        acknowledgeTerms: formData.acknowledgeTerms,
        voluntarySignature: formData.voluntarySignature,
        legalAgeCertification: formData.legalAgeCertification,
      };

      const result = await waiverService.submitWaiver(waiverData);
      setSubmissionResult(result);

      if (result.success) {
        // Clear form on successful submission
        setFormData({
          participantName: '',
          participantDOB: '',
          digitalSignature: '',
          acknowledgeTerms: false,
          voluntarySignature: false,
          legalAgeCertification: false,
          photoPermission: undefined,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      participantName: '',
      participantDOB: '',
      digitalSignature: '',
      acknowledgeTerms: false,
      voluntarySignature: false,
      legalAgeCertification: false,
      photoPermission: undefined,
    });
    setErrors({});
    setSubmissionResult(null);
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    clearForm,
    isSubmitting,
    submissionResult,
    errors,
  };
};
