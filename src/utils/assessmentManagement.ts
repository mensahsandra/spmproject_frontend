/**
 * Assessment Management Utilities
 * 
 * Utilities for lecturers to manage assessment archival and publishing states
 * according to backend guidance.
 */

import { apiFetch } from './api';

export interface AssessmentVisibilityUpdate {
  assessmentId: string;
  isArchived?: boolean;
  isPublished?: boolean;
}

/**
 * Update assessment visibility (archive/unarchive, publish/unpublish)
 * 
 * Backend guidance:
 * - Any assessment marked isArchived=true is hidden from students
 * - Backend treats missing isPublished as published
 * - Send explicit boolean values for intended behavior
 */
export const updateAssessmentVisibility = async (
  updates: AssessmentVisibilityUpdate
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    console.log('📝 Updating assessment visibility:', updates);
    
    const response = await apiFetch(`/api/assessments/${updates.assessmentId}/visibility`, {
      method: 'PATCH',
      role: 'lecturer',
      body: JSON.stringify({
        isArchived: updates.isArchived,
        isPublished: updates.isPublished
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.success) {
      const action = updates.isArchived ? 'archived' : 
                    updates.isArchived === false ? 'unarchived' :
                    updates.isPublished ? 'published' :
                    updates.isPublished === false ? 'unpublished' : 'updated';
      
      console.log(`✅ Assessment ${action} successfully`);
      
      return {
        success: true,
        message: `Assessment ${action} successfully. ${updates.isArchived ? 'Students will no longer see this assessment.' : ''}`
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to update assessment visibility'
    };

  } catch (error) {
    console.error('❌ Error updating assessment visibility:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Archive an assessment (hides from students immediately)
 */
export const archiveAssessment = async (assessmentId: string) => {
  return updateAssessmentVisibility({
    assessmentId,
    isArchived: true
  });
};

/**
 * Unarchive an assessment (makes visible to students again)
 */
export const unarchiveAssessment = async (assessmentId: string) => {
  return updateAssessmentVisibility({
    assessmentId,
    isArchived: false
  });
};

/**
 * Publish an assessment (makes visible to students)
 */
export const publishAssessment = async (assessmentId: string) => {
  return updateAssessmentVisibility({
    assessmentId,
    isPublished: true
  });
};

/**
 * Unpublish an assessment (hides from students)
 */
export const unpublishAssessment = async (assessmentId: string) => {
  return updateAssessmentVisibility({
    assessmentId,
    isPublished: false
  });
};

/**
 * Bulk update multiple assessments
 */
export const bulkUpdateAssessmentVisibility = async (
  updates: AssessmentVisibilityUpdate[]
): Promise<{ success: boolean; results: any[]; errors: string[] }> => {
  const results: any[] = [];
  const errors: string[] = [];

  for (const update of updates) {
    try {
      const result = await updateAssessmentVisibility(update);
      results.push({ assessmentId: update.assessmentId, ...result });
      
      if (!result.success) {
        errors.push(`${update.assessmentId}: ${result.error}`);
      }
    } catch (error) {
      const errorMsg = `${update.assessmentId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      results.push({ assessmentId: update.assessmentId, success: false, error: errorMsg });
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors
  };
};

/**
 * Get assessment visibility status
 */
export const getAssessmentVisibility = async (assessmentId: string) => {
  try {
    const response = await apiFetch(`/api/assessments/${assessmentId}/visibility`, {
      method: 'GET',
      role: 'lecturer'
    });

    if (response.success) {
      return {
        success: true,
        data: {
          isArchived: response.isArchived || false,
          isPublished: response.isPublished !== false // Default to published if missing
        }
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to get assessment visibility'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};