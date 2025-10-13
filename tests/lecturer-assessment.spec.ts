import { test, expect, type Page } from '@playwright/test';

test.describe('Lecturer Assessment Management System', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Navigate to the test route that bypasses authentication
    await page.goto('/test-lecturer-assessment');
    // Wait for the page to load and components to render
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Section 1: Course Selection', () => {
    test('should display all 5 BIT courses in dropdown', async () => {
      // Wait for the course selection dropdown to be visible
      await expect(page.locator('[data-testid="course-select"]')).toBeVisible();
      
      // Click to open dropdown
      await page.locator('[data-testid="course-select"]').click();
      
      // Check for all 5 BIT courses
      const expectedCourses = [
        'BIT 101 - Programming Fundamentals',
        'BIT 102 - Data Structures',
        'BIT 201 - Database Systems',
        'BIT 202 - Web Development',
        'BIT 301 - Software Engineering'
      ];
      
      for (const course of expectedCourses) {
        await expect(page.locator(`text=${course}`)).toBeVisible();
      }
    });

    test('should display real-time date and time', async () => {
      const timeElement = page.locator('[data-testid="current-time"]');
      await expect(timeElement).toBeVisible();
      
      // Get initial time
      const initialTime = await timeElement.textContent();
      
      // Wait for 2 seconds and check if time has updated
      await page.waitForTimeout(2000);
      const updatedTime = await timeElement.textContent();
      
      expect(updatedTime).not.toBe(initialTime);
    });

    test('should display academic year 2024/2025', async () => {
      await expect(page.locator('text=2024/2025')).toBeVisible();
    });

    test('should enable semester selection (1-2)', async () => {
      const semesterSelect = page.locator('[data-testid="semester-select"]');
      await expect(semesterSelect).toBeVisible();
      
      await semesterSelect.click();
      await expect(page.locator('option[value="1"]')).toBeVisible();
      await expect(page.locator('option[value="2"]')).toBeVisible();
    });

    test('should enable block selection (1-3)', async () => {
      const blockSelect = page.locator('[data-testid="block-select"]');
      await expect(blockSelect).toBeVisible();
      
      await blockSelect.click();
      await expect(page.locator('option[value="1"]')).toBeVisible();
      await expect(page.locator('option[value="2"]')).toBeVisible();
      await expect(page.locator('option[value="3"]')).toBeVisible();
    });

    test('should enable subsequent sections after course selection', async () => {
      // Initially, sections 2 and 3 should be disabled
      await expect(page.locator('[data-testid="section-2"]')).toHaveClass(/disabled/);
      await expect(page.locator('[data-testid="section-3"]')).toHaveClass(/disabled/);
      
      // Select a course
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      
      // Sections should now be enabled
      await expect(page.locator('[data-testid="section-2"]')).not.toHaveClass(/disabled/);
      await expect(page.locator('[data-testid="section-3"]')).not.toHaveClass(/disabled/);
    });
  });

  test.describe('Section 2: Assessment Creation', () => {
    test.beforeEach(async () => {
      // Enable sections by selecting course details
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      await page.waitForTimeout(500);
    });

    test('should create Class Assessment', async () => {
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('Test Class Assessment');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Verify assessment card appears
      await expect(page.locator('[data-testid="assessment-card"]').first()).toBeVisible();
      await expect(page.locator('text=Test Class Assessment')).toBeVisible();
      await expect(page.locator('text=Class Assessment')).toBeVisible();
    });

    test('should create Mid Semester assessment', async () => {
      await page.locator('[data-testid="assessment-type"]').selectOption('Mid Semester');
      await page.locator('[data-testid="assessment-title"]').fill('Test Mid Semester');
      await page.locator('[data-testid="assessment-format"]').selectOption('Description/Typing');
      await page.locator('[data-testid="total-marks"]').fill('50');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      await expect(page.locator('text=Test Mid Semester')).toBeVisible();
      await expect(page.locator('text=Mid Semester')).toBeVisible();
    });

    test('should create End of Semester assessment', async () => {
      await page.locator('[data-testid="assessment-type"]').selectOption('End of Semester');
      await page.locator('[data-testid="assessment-title"]').fill('Final Exam');
      await page.locator('[data-testid="assessment-format"]').selectOption('File Upload');
      await page.locator('[data-testid="total-marks"]').fill('100');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      await expect(page.locator('text=Final Exam')).toBeVisible();
      await expect(page.locator('text=End of Semester')).toBeVisible();
    });

    test('should support Multiple Choice question creation', async () => {
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('MC Test');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Add multiple choice question
      await page.locator('[data-testid="add-mc-question"]').click();
      await page.locator('[data-testid="mc-question-text"]').fill('What is 2 + 2?');
      await page.locator('[data-testid="mc-option-0"]').fill('3');
      await page.locator('[data-testid="mc-option-1"]').fill('4');
      await page.locator('[data-testid="mc-option-2"]').fill('5');
      await page.locator('[data-testid="mc-option-3"]').fill('6');
      await page.locator('[data-testid="mc-correct-answer"]').selectOption('1');
      await page.locator('[data-testid="save-mc-question"]').click();
      
      await expect(page.locator('text=What is 2 + 2?')).toBeVisible();
    });

    test('should display assessment cards with proper information', async () => {
      // Create an assessment
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('Test Assessment');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('25');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      const assessmentCard = page.locator('[data-testid="assessment-card"]').first();
      await expect(assessmentCard).toBeVisible();
      await expect(assessmentCard.locator('text=Test Assessment')).toBeVisible();
      await expect(assessmentCard.locator('text=25 marks')).toBeVisible();
      await expect(assessmentCard.locator('[data-testid="grade-btn"]')).toBeVisible();
    });
  });

  test.describe('Section 3: Student Management', () => {
    test.beforeEach(async () => {
      // Enable sections and create an assessment
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('Test Assessment');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      await page.waitForTimeout(500);
    });

    test('should display student performance table with correct headers', async () => {
      const table = page.locator('[data-testid="student-performance-table"]');
      await expect(table).toBeVisible();
      
      await expect(table.locator('th:has-text("Student ID")')).toBeVisible();
      await expect(table.locator('th:has-text("Name")')).toBeVisible();
      await expect(table.locator('th:has-text("Test Assessment")')).toBeVisible();
    });

    test('should show dashes for ungraded assessments', async () => {
      const table = page.locator('[data-testid="student-performance-table"]');
      await expect(table).toBeVisible();
      
      // Check for dashes in grade columns (ungraded assessments)
      const dashCells = page.locator('td:has-text("-")');
      await expect(dashCells.first()).toBeVisible();
    });

    test('should open individual grading modal', async () => {
      const gradeBtn = page.locator('[data-testid="individual-grade-btn"]').first();
      await gradeBtn.click();
      
      const modal = page.locator('[data-testid="grading-modal"]');
      await expect(modal).toBeVisible();
      await expect(modal.locator('[data-testid="student-name"]')).toBeVisible();
      await expect(modal.locator('[data-testid="grade-input"]')).toBeVisible();
      await expect(modal.locator('[data-testid="save-grade-btn"]')).toBeVisible();
    });

    test('should save individual grades and update table', async () => {
      // Open grading modal
      const gradeBtn = page.locator('[data-testid="individual-grade-btn"]').first();
      await gradeBtn.click();
      
      // Enter grade
      await page.locator('[data-testid="grade-input"]').fill('18');
      await page.locator('[data-testid="save-grade-btn"]').click();
      
      // Modal should close
      await expect(page.locator('[data-testid="grading-modal"]')).not.toBeVisible();
      
      // Table should update with the grade
      await expect(page.locator('td:has-text("18")')).toBeVisible();
    });

    test('should support bulk grading functionality', async () => {
      const bulkGradeBtn = page.locator('[data-testid="bulk-grade-btn"]');
      await expect(bulkGradeBtn).toBeVisible();
      await bulkGradeBtn.click();
      
      const bulkModal = page.locator('[data-testid="bulk-grading-modal"]');
      await expect(bulkModal).toBeVisible();
      await expect(bulkModal.locator('[data-testid="bulk-grade-input"]')).toBeVisible();
      await expect(bulkModal.locator('[data-testid="apply-bulk-grade-btn"]')).toBeVisible();
    });

    test('should apply bulk grades to all students', async () => {
      // Open bulk grading modal
      await page.locator('[data-testid="bulk-grade-btn"]').click();
      
      // Enter bulk grade
      await page.locator('[data-testid="bulk-grade-input"]').fill('15');
      await page.locator('[data-testid="apply-bulk-grade-btn"]').click();
      
      // Modal should close
      await expect(page.locator('[data-testid="bulk-grading-modal"]')).not.toBeVisible();
      
      // All grade cells should show the bulk grade
      const gradeCells = page.locator('td:has-text("15")');
      const count = await gradeCells.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display proper grade vs dash based on grading status', async () => {
      // Initially should show dashes
      await expect(page.locator('td:has-text("-")').first()).toBeVisible();
      
      // Grade one student
      await page.locator('[data-testid="individual-grade-btn"]').first().click();
      await page.locator('[data-testid="grade-input"]').fill('16');
      await page.locator('[data-testid="save-grade-btn"]').click();
      
      // That cell should now show grade, others should still show dashes
      await expect(page.locator('td:has-text("16")')).toBeVisible();
      await expect(page.locator('td:has-text("-")').first()).toBeVisible(); // Other students
    });

    test('should trigger notifications after grading', async () => {
      // Mock notification service or check for notification calls
      // This would depend on how notifications are implemented
      
      // Grade a student
      await page.locator('[data-testid="individual-grade-btn"]').first().click();
      await page.locator('[data-testid="grade-input"]').fill('19');
      await page.locator('[data-testid="save-grade-btn"]').click();
      
      // Check for success message or notification indicator
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });

  test.describe('Integration Tests', () => {
    test('should complete full workflow: course selection → assessment creation → student grading', async () => {
      // Step 1: Course Selection
      await page.locator('[data-testid="course-select"]').selectOption('BIT 102');
      await page.locator('[data-testid="semester-select"]').selectOption('2');
      await page.locator('[data-testid="block-select"]').selectOption('2');
      
      // Verify sections are enabled
      await expect(page.locator('[data-testid="section-2"]')).not.toHaveClass(/disabled/);
      
      // Step 2: Assessment Creation
      await page.locator('[data-testid="assessment-type"]').selectOption('Mid Semester');
      await page.locator('[data-testid="assessment-title"]').fill('Data Structures Midterm');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('40');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Verify assessment created
      await expect(page.locator('text=Data Structures Midterm')).toBeVisible();
      
      // Step 3: Student Grading
      await page.locator('[data-testid="individual-grade-btn"]').first().click();
      await page.locator('[data-testid="grade-input"]').fill('35');
      await page.locator('[data-testid="save-grade-btn"]').click();
      
      // Verify grade saved
      await expect(page.locator('td:has-text("35")')).toBeVisible();
    });

    test('should maintain state when switching between courses', async () => {
      // Create assessment for first course
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('Programming Quiz');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('15');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Switch to another course
      await page.locator('[data-testid="course-select"]').selectOption('BIT 201');
      
      // Switch back to first course
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      
      // Assessment should still be there
      await expect(page.locator('text=Programming Quiz')).toBeVisible();
    });

    test('should handle multiple assessments for same course', async () => {
      // Setup course
      await page.locator('[data-testid="course-select"]').selectOption('BIT 202');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('3');
      
      // Create first assessment
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('HTML/CSS Quiz');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Create second assessment
      await page.locator('[data-testid="assessment-type"]').selectOption('Mid Semester');
      await page.locator('[data-testid="assessment-title"]').fill('JavaScript Project');
      await page.locator('[data-testid="assessment-format"]').selectOption('File Upload');
      await page.locator('[data-testid="total-marks"]').fill('50');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Both assessments should be visible
      await expect(page.locator('text=HTML/CSS Quiz')).toBeVisible();
      await expect(page.locator('text=JavaScript Project')).toBeVisible();
      
      // Student table should have columns for both
      const table = page.locator('[data-testid="student-performance-table"]');
      await expect(table.locator('th:has-text("HTML/CSS Quiz")')).toBeVisible();
      await expect(table.locator('th:has-text("JavaScript Project")')).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should validate required fields in assessment creation', async () => {
      // Enable sections
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      
      // Try to create assessment without title
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Should show validation error
      await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    });

    test('should validate grade input ranges', async () => {
      // Setup assessment
      await page.locator('[data-testid="course-select"]').selectOption('BIT 101');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      await page.locator('[data-testid="assessment-type"]').selectOption('Class Assessment');
      await page.locator('[data-testid="assessment-title"]').fill('Test');
      await page.locator('[data-testid="assessment-format"]').selectOption('Multiple Choice');
      await page.locator('[data-testid="total-marks"]').fill('20');
      await page.locator('[data-testid="create-assessment-btn"]').click();
      
      // Try to enter invalid grade
      await page.locator('[data-testid="individual-grade-btn"]').first().click();
      await page.locator('[data-testid="grade-input"]').fill('25'); // Above max
      await page.locator('[data-testid="save-grade-btn"]').click();
      
      // Should show validation error
      await expect(page.locator('[data-testid="grade-error"]')).toBeVisible();
    });

    test('should handle empty student lists gracefully', async () => {
      // This test would depend on how empty student lists are handled
      // For now, verify the table structure exists
      await page.locator('[data-testid="course-select"]').selectOption('BIT 301');
      await page.locator('[data-testid="semester-select"]').selectOption('1');
      await page.locator('[data-testid="block-select"]').selectOption('1');
      
      const table = page.locator('[data-testid="student-performance-table"]');
      await expect(table).toBeVisible();
      await expect(table.locator('th:has-text("Student ID")')).toBeVisible();
    });
  });

  test.describe('UI Responsiveness and Accessibility', () => {
    test('should be accessible with proper ARIA labels', async () => {
      // Check for proper labeling
      await expect(page.locator('[data-testid="course-select"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="semester-select"]')).toHaveAttribute('aria-label');
      await expect(page.locator('[data-testid="block-select"]')).toHaveAttribute('aria-label');
    });

    test('should be keyboard navigable', async () => {
      // Test tab navigation through form elements
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="course-select"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="semester-select"]')).toBeFocused();
    });

    test('should work on mobile viewports', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Sections should still be visible and functional
      await expect(page.locator('[data-testid="section-1"]')).toBeVisible();
      await expect(page.locator('[data-testid="course-select"]')).toBeVisible();
    });
  });
});