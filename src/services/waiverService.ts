import { supabase } from '../lib/supabase';

export interface WaiverSignatureData {
  waiverType: 'liability' | 'photo_release';
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  participantDOB: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  isMinor: boolean;
  guardianName?: string;
  guardianRelation?: string;
  digitalSignature: string;
  acknowledgeTerms: boolean;
  voluntarySignature: boolean;
  legalAgeCertification: boolean;
}

export interface WaiverSubmissionResponse {
  success: boolean;
  id?: string;
  message: string;
  confirmationNumber?: string;
}

class WaiverService {
  /**
   * Submit a waiver signature to the database
   */
  async submitWaiver(data: WaiverSignatureData): Promise<WaiverSubmissionResponse> {
    try {
      // Validate required fields
      if (!this.validateWaiverData(data)) {
        return {
          success: false,
          message: 'Please fill in all required fields and check all acknowledgment boxes.'
        };
      }

      // Get client information for legal verification
      const clientInfo = this.getClientInfo();

      // Prepare data for database
      const dbData = {
        waiver_type: data.waiverType,
        waiver_version: '1.0',
        participant_name: data.participantName.trim(),
        participant_email: data.participantEmail?.trim().toLowerCase() || null,
        participant_phone: data.participantPhone?.trim() || null,
        participant_dob: data.participantDOB,
        emergency_name: data.emergencyName?.trim() || null,
        emergency_phone: data.emergencyPhone?.trim() || null,
        emergency_relation: data.emergencyRelation || null,
        is_minor: data.isMinor,
        guardian_name: data.guardianName?.trim() || null,
        guardian_relation: data.guardianRelation || null,
        digital_signature: data.digitalSignature.trim(),
        acknowledge_terms: data.acknowledgeTerms,
        voluntary_signature: data.voluntarySignature,
        legal_age_certification: data.legalAgeCertification,
        ip_address: clientInfo.ipAddress,
        user_agent: clientInfo.userAgent,
        signature_timestamp: new Date().toISOString()
      };

      // Insert into database
      const { data: result, error } = await supabase
        .from('waiver_signatures')
        .insert(dbData)
        .select('id')
        .single();

      if (error) {
        console.error('Database error:', error);
        return {
          success: false,
          message: 'Failed to submit waiver. Please try again or contact support.'
        };
      }

      // Generate confirmation number
      const confirmationNumber = this.generateConfirmationNumber(result.id);

      return {
        success: true,
        id: result.id,
        message: 'Waiver submitted successfully!',
        confirmationNumber
      };

    } catch (error) {
      console.error('Waiver submission error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Check if a participant has already signed a specific waiver
   */
  async hasSignedWaiver(email: string, waiverType: 'liability' | 'photo_release'): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('waiver_signatures')
        .select('id')
        .eq('participant_email', email.toLowerCase())
        .eq('waiver_type', waiverType)
        .limit(1);

      if (error) {
        console.error('Error checking waiver status:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking waiver status:', error);
      return false;
    }
  }

  /**
   * Get waiver signatures for a participant
   */
  async getParticipantWaivers(email: string) {
    try {
      const { data, error } = await supabase
        .from('waiver_signatures')
        .select('*')
        .eq('participant_email', email.toLowerCase())
        .order('signature_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching waivers:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching waivers:', error);
      return null;
    }
  }

  /**
   * Validate waiver data
   */
  private validateWaiverData(data: WaiverSignatureData): boolean {
    // Check required fields (only name, DOB, and signature are required now)
    const requiredFields = [
      data.participantName,
      data.participantDOB,
      data.digitalSignature
    ];

    if (requiredFields.some(field => !field || field.trim() === '')) {
      return false;
    }

    // Check acknowledgments
    if (!data.acknowledgeTerms || !data.voluntarySignature || !data.legalAgeCertification) {
      return false;
    }

    // Validate email format only if provided
    if (data.participantEmail && data.participantEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.participantEmail)) {
        return false;
      }
    }

    // Validate digital signature matches participant name
    if (data.digitalSignature.toLowerCase().trim() !== data.participantName.toLowerCase().trim()) {
      return false;
    }

    // Validate participant name is a full name (at least two words)
    const participantNameParts = data.participantName.trim().split(/\s+/);
    if (participantNameParts.length < 2 || participantNameParts.some(part => part.length < 1)) {
      return false;
    }

    // Validate digital signature is a full name (at least two words)
    const signatureParts = data.digitalSignature.trim().split(/\s+/);
    if (signatureParts.length < 2 || signatureParts.some(part => part.length < 1)) {
      return false;
    }

    // If minor, check guardian information
    if (data.isMinor) {
      if (!data.guardianName || !data.guardianRelation) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get client information for legal verification
   */
  private getClientInfo() {
    return {
      ipAddress: null, // Would be populated by backend in real implementation
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    };
  }

  /**
   * Generate a confirmation number
   */
  private generateConfirmationNumber(id: string): string {
    const prefix = 'OSL';
    const timestamp = Date.now().toString(36).toUpperCase();
    const idSuffix = id.slice(-6).toUpperCase();
    return `${prefix}-${timestamp}-${idSuffix}`;
  }
}

export const waiverService = new WaiverService();
