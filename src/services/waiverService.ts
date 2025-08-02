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

      // Check if waiver already exists for this participant and waiver type
      const { data: existingWaivers, error: checkError } = await supabase
        .from('waiver_signatures')
        .select('id, acknowledge_terms')
        .eq('participant_name', data.participantName.trim())
        .eq('participant_dob', data.participantDOB)
        .eq('waiver_type', data.waiverType);

      if (checkError) {
        console.error('Error checking existing waiver:', checkError);
        return {
          success: false,
          message: 'Failed to check existing waiver. Please try again.'
        };
      }

      console.log('Existing waivers found:', existingWaivers);

      if (existingWaivers && existingWaivers.length > 0) {
        const existingWaiver = existingWaivers[0]; // Use the first match
        console.log('Found existing waiver:', existingWaiver);
        
        // Handle existing waiver based on type
        if (data.waiverType === 'liability') {
          // For liability waivers, don't allow resubmission
          console.log('Blocking liability waiver resubmission');
          return {
            success: false,
            message: 'You have already successfully submitted your liability waiver. No further action is needed.'
          };
        } else if (data.waiverType === 'photo_release') {
          // For photo release waivers, check if acknowledge_terms is changing
          console.log('Checking photo release waiver:', {
            existing_acknowledge_terms: existingWaiver.acknowledge_terms,
            new_acknowledge_terms: data.acknowledgeTerms
          });
          
          if (existingWaiver.acknowledge_terms === data.acknowledgeTerms) {
            // Same choice - don't allow duplicate
            const permissionType = data.acknowledgeTerms ? 'GRANT' : 'WITHHOLD';
            console.log('Blocking duplicate photo release submission with same permission:', permissionType);
            return {
              success: false,
              message: `You have already submitted your photo release waiver with permission ${permissionType}. No further action is needed.`
            };
          } else {
            // Different choice - delete the existing record and insert a new one
            console.log('Updating photo release waiver with new permission using delete+insert approach');
            console.log('Existing waiver ID:', existingWaiver.id, 'Type:', typeof existingWaiver.id);
            console.log('Current acknowledge_terms:', existingWaiver.acknowledge_terms);
            console.log('New acknowledge_terms:', data.acknowledgeTerms);
            
            // First, delete the existing record
            console.log('Attempting to delete existing waiver with criteria:', {
              participant_name: data.participantName.trim(),
              participant_dob: data.participantDOB,
              waiver_type: data.waiverType
            });

            const { data: deleteResult, error: deleteError } = await supabase
              .from('waiver_signatures')
              .delete()
              .eq('participant_name', data.participantName.trim())
              .eq('participant_dob', data.participantDOB)
              .eq('waiver_type', data.waiverType)
              .select();

            console.log('Delete result:', deleteResult);
            console.log('Delete error:', deleteError);

            if (deleteError) {
              console.error('Error deleting existing photo release waiver:', deleteError);
              return {
                success: false,
                message: `Failed to update photo permission. Error: ${deleteError.message}`
              };
            }

            if (!deleteResult || deleteResult.length === 0) {
              console.error('No records were deleted - the existing waiver was not found for deletion');
              return {
                success: false,
                message: 'Failed to update photo permission. Could not find existing record to update.'
              };
            }

            console.log('Successfully deleted', deleteResult.length, 'existing waiver(s), now inserting updated version');

            // Then insert the new record with updated values
            const { data: insertResult, error: insertError } = await supabase
              .from('waiver_signatures')
              .insert(dbData)
              .select('id')
              .single();

            if (insertError) {
              console.error('Error inserting updated photo release waiver:', insertError);
              return {
                success: false,
                message: `Failed to update photo permission. Error: ${insertError.message}`
              };
            }

            console.log('Successfully inserted updated waiver:', insertResult);

            const newPermissionType = data.acknowledgeTerms ? 'GRANT' : 'WITHHOLD';
            const oldPermissionType = existingWaiver.acknowledge_terms ? 'GRANT' : 'WITHHOLD';

            // Generate confirmation number for the new record
            const confirmationNumber = this.generateConfirmationNumber(insertResult.id);

            console.log('Successfully updated photo release waiver via delete+insert');
            return {
              success: true,
              id: insertResult.id,
              message: `Photo permission updated successfully! Changed from ${oldPermissionType} to ${newPermissionType}.`,
              confirmationNumber
            };
          }
        }
      }

      // No existing waiver found - proceed with fresh insert
      console.log('No existing waiver found, proceeding with new insert');
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
