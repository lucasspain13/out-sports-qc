import { useState } from 'react';
import { waiverService, WaiverSignatureData, WaiverSubmissionResponse } from '../services/waiverService';

export interface WaiverFormData {
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  participantDOB: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  digitalSignature: string;
  acknowledgeTerms: boolean;
  voluntarySignature: boolean;
  legalAgeCertification: boolean;
}

export const useWaiverForm = (waiverType: 'liability' | 'photo_release') => {
  const [formData, setFormData] = useState<WaiverFormData>({
    participantName: '',
    participantEmail: '',
    participantPhone: '',
    participantDOB: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    digitalSignature: '',
    acknowledgeTerms: false,
    voluntarySignature: false,
    legalAgeCertification: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<WaiverSubmissionResponse | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof WaiverFormData, string>>>({});

  const updateFormData = (field: keyof WaiverFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Enhanced email validation
    if (!formData.participantEmail.trim()) {
      newErrors.participantEmail = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.participantEmail)) {
        newErrors.participantEmail = 'Please enter a valid email address';
      }
    }

    // Enhanced phone validation
    if (!formData.participantPhone.trim()) {
      newErrors.participantPhone = 'Phone number is required';
    } else {
      // Remove all non-digits for validation
      const phoneDigits = formData.participantPhone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.participantPhone = 'Phone number must be at least 10 digits';
      } else if (phoneDigits.length > 11) {
        newErrors.participantPhone = 'Phone number cannot exceed 11 digits';
      } else if (phoneDigits.length === 11 && !phoneDigits.startsWith('1')) {
        newErrors.participantPhone = 'Invalid 11-digit phone number format';
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

    if (!formData.emergencyName.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }

    // Enhanced emergency phone validation
    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    } else {
      const emergencyPhoneDigits = formData.emergencyPhone.replace(/\D/g, '');
      if (emergencyPhoneDigits.length < 10) {
        newErrors.emergencyPhone = 'Emergency contact phone must be at least 10 digits';
      } else if (emergencyPhoneDigits.length > 11) {
        newErrors.emergencyPhone = 'Emergency contact phone cannot exceed 11 digits';
      } else if (emergencyPhoneDigits.length === 11 && !emergencyPhoneDigits.startsWith('1')) {
        newErrors.emergencyPhone = 'Invalid emergency contact phone format';
      }
    }

    if (!formData.emergencyRelation) {
      newErrors.emergencyRelation = 'Emergency contact relationship is required';
    }

    if (!formData.digitalSignature.trim()) {
      newErrors.digitalSignature = 'Digital signature is required';
    } else {
      // Check if digital signature matches participant name
      if (formData.digitalSignature.toLowerCase().trim() !== formData.participantName.toLowerCase().trim()) {
        newErrors.digitalSignature = 'Digital signature must match participant name exactly';
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
    if (!formData.acknowledgeTerms) {
      newErrors.acknowledgeTerms = 'You must acknowledge the terms';
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
        participantEmail: formData.participantEmail,
        participantPhone: formData.participantPhone,
        participantDOB: formData.participantDOB,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelation: formData.emergencyRelation,
        isMinor: false, // All participants must be 18+
        guardianName: undefined,
        guardianRelation: undefined,
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
          participantEmail: '',
          participantPhone: '',
          participantDOB: '',
          emergencyName: '',
          emergencyPhone: '',
          emergencyRelation: '',
          digitalSignature: '',
          acknowledgeTerms: false,
          voluntarySignature: false,
          legalAgeCertification: false,
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
      participantEmail: '',
      participantPhone: '',
      participantDOB: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
      digitalSignature: '',
      acknowledgeTerms: false,
      voluntarySignature: false,
      legalAgeCertification: false,
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
