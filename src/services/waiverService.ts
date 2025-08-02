import { supabase } from '../lib/supabase';

export interface WaiverSignatureData {
  waiverType: 'liability' | 'photo_release';
  participantName: string;
  participantDOB: string;
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
        participant_dob: data.participantDOB,
        digital_signature: data.digitalSignature.trim(),
        acknowledge_terms: data.acknowledgeTerms,
        voluntary_signature: data.voluntarySignature,
        legal_age_certification: data.legalAgeCertification,
        ip_address: clientInfo.ipAddress,
        user_agent: clientInfo.userAgent,
        signature_timestamp: new Date().toISOString()
      };

      // Try to delete any existing waiver first, then insert the new one
      // This ensures we don't have duplicates and always have the latest data
      console.log('Deleting existing waivers for:', {
        participant_name: data.participantName.trim(),
        participant_dob: data.participantDOB,
        waiver_type: data.waiverType
      });

      const { data: deletedRows, error: deleteError } = await supabase
        .from('waiver_signatures')
        .delete()
        .eq('participant_name', data.participantName.trim())
        .eq('participant_dob', data.participantDOB)
        .eq('waiver_type', data.waiverType)
        .select('id');

      if (deleteError) {
        console.error('Error deleting existing waiver:', deleteError);
        return {
          success: false,
          message: `Failed to remove existing waiver. Error: ${deleteError.message}`
        };
      }

      console.log('Deleted existing waivers:', deletedRows);

      // Insert the new waiver (this will always be a fresh insert)
      console.log('Inserting new waiver:', dbData);
      const { data: result, error } = await supabase
        .from('waiver_signatures')
        .insert(dbData)
        .select('id')
        .single();

      if (error) {
        console.error('Database insert error:', error);
        console.error('Data being inserted:', dbData);
        return {
          success: false,
          message: `Failed to submit waiver. Error: ${error.message}`
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
  async hasSignedWaiver(participantName: string, participantDOB: string, waiverType: 'liability' | 'photo_release'): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('waiver_signatures')
        .select('id')
        .eq('participant_name', participantName)
        .eq('participant_dob', participantDOB)
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
  async getParticipantWaivers(participantName: string, participantDOB: string) {
    try {
      const { data, error } = await supabase
        .from('waiver_signatures')
        .select('*')
        .eq('participant_name', participantName)
        .eq('participant_dob', participantDOB)
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

    // Check acknowledgments - for photo release, acknowledgeTerms can be false (withhold permission)
    // For liability waiver, acknowledgeTerms must be true
    if (data.waiverType === 'liability' && !data.acknowledgeTerms) {
      return false;
    }
    
    // These must always be true regardless of waiver type
    if (!data.voluntarySignature || !data.legalAgeCertification) {
      return false;
    }

    // Validate digital signature matches participant name EXACTLY
    if (data.digitalSignature.trim() !== data.participantName.trim()) {
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
