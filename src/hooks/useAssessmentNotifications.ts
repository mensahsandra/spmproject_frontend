/**
 * Custom hook for assessment-related notifications
 * Makes it easy to add notifications when grades are submitted, updated, etc.
 */

import { useNotifications } from '../context/NotificationContext';

export const useAssessmentNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyGradeSubmitted = (studentName: string, courseName: string, grade: number | string, options: { skip?: boolean } = {}) => {
    if (!studentName || !courseName || options.skip) return;

    addNotification({
      type: 'assessment',
      title: '📝 Grade Submitted',
      message: `Grade ${grade} submitted for ${studentName} in ${courseName}`,
      data: { studentName, courseName, grade }
    });
  };

  const notifyBulkGradesSubmitted = (count: number, courseName: string, options: { force?: boolean } = {}) => {
    const hasMeaningfulUpdate = Number.isFinite(count) && count > 0;
    if (!hasMeaningfulUpdate && !options.force) return;

    addNotification({
      type: 'assessment',
      title: '✅ Grades Submitted',
      message: `Successfully submitted grades for ${count} student${count > 1 ? 's' : ''} in ${courseName}`,
      data: { count, courseName, options }
    });
  };

  const notifyGradeUpdated = (studentName: string, courseName: string, oldGrade: number | string, newGrade: number | string, options: { skip?: boolean } = {}) => {
    if (!studentName || !courseName || options.skip) return;
    const didChange = oldGrade !== newGrade;
    if (!didChange) return;

    addNotification({
      type: 'assessment',
      title: '📝 Grade Updated',
      message: `${studentName}'s grade in ${courseName} updated from ${oldGrade} to ${newGrade}`,
      data: { studentName, courseName, oldGrade, newGrade }
    });
  };

  const notifyGradeError = (studentName: string, error: string, options: { skip?: boolean } = {}) => {
    if ((!studentName && !error) || options.skip) return;

    addNotification({
      type: 'general',
      title: '❌ Grade Submission Failed',
      message: `Failed to submit grade for ${studentName || 'the selected student'}: ${error}`,
      data: { studentName, error }
    });
  };

  const notifyAssessmentCreated = (assessmentName: string, courseName: string, options: { skip?: boolean } = {}) => {
    if (!assessmentName || !courseName || options.skip) return;

    addNotification({
      type: 'assessment',
      title: '📋 Assessment Created',
      message: `New assessment "${assessmentName}" created for ${courseName}`,
      data: { assessmentName, courseName }
    });
  };

  const notifyAssessmentDeleted = (assessmentName: string, options: { skipNotification?: boolean } = {}) => {
    if (!assessmentName || options.skipNotification) return;

    addNotification({
      type: 'assessment',
      title: '🗑️ Assessment Deleted',
      message: `Assessment "${assessmentName}" has been deleted`,
      data: { assessmentName }
    });
  };

  return {
    notifyGradeSubmitted,
    notifyBulkGradesSubmitted,
    notifyGradeUpdated,
    notifyGradeError,
    notifyAssessmentCreated,
    notifyAssessmentDeleted,
  };
};
