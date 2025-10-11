# Remaining Notification Integrations

## ✅ Completed
1. **Reset Button Error** - Fixed with graceful error handling
2. **Quiz Creation Notifications** - Sends to both student and lecturer
3. **Role-Based Storage** - Separate notifications for each role
4. **Notification Context** - Updated to support role-based loading
5. **Notification Pages** - Both student and lecturer pages updated

---

## 🔧 Ready to Integrate (Functions Created, Need Integration Points)

### 1. QR Code Scan Notifications (Issue #3)
**Status:** Function ready, needs integration

**Function Available:**
```typescript
notifyAttendanceCheckIn(studentName: string, courseCode: string, location: string)
```

**Where to Integrate:**
- Find the student QR scan component (likely in `src/components/` or `src/pages/`)
- After successful QR scan/check-in, add:
```typescript
import { notifyAttendanceCheckIn } from '../utils/notificationService';

// After successful check-in
notifyAttendanceCheckIn(studentName, courseCode, location);
```

**Search for:**
- Files containing "QR" or "scan" or "check-in"
- API calls to attendance endpoints
- Success handlers after attendance submission

---

### 2. Quiz Submission Notifications (Issue #5)
**Status:** Function ready, needs integration

**Function Available:**
```typescript
notifyQuizSubmission(studentName: string, quizTitle: string, courseCode: string)
```

**Where to Integrate:**
- Find the student quiz submission component
- After successful quiz submission, add:
```typescript
import { notifyQuizSubmission } from '../utils/notificationService';

// After successful submission
notifyQuizSubmission(studentName, quizTitle, courseCode);
```

**Search for:**
- Files in `src/components/` or `src/pages/` with "quiz" and "submit"
- API calls to quiz submission endpoints
- Success handlers after quiz submission

---

### 3. Grading Notifications (Issue #6)
**Status:** Functions ready, needs integration

**Functions Available:**
```typescript
// For single grade
notifyQuizGraded(studentName: string, quizTitle: string, score: number, maxScore: number)

// For bulk grading
notifyBulkGrading(lecturerName: string, quizTitle: string, studentCount: number, students: string[])
```

**Where to Integrate:**
- File: `src/components/Dashboard/UpdateGrades.tsx`
- After successful grade submission, add:
```typescript
import { notifyQuizGraded, notifyBulkGrading } from '../../utils/notificationService';

// For single student grade
notifyQuizGraded(studentName, quizTitle, score, maxScore);

// For bulk grading
notifyBulkGrading(lecturerName, quizTitle, studentCount, studentNames);
```

**Integration Point:**
- Look for the grade submission success handler
- Add notification calls after successful API response

---

## 🔔 Bell Icon Count Integration

**Current Status:** Context already tracks `unreadCount`

**What to Do:**
1. Find bell icon components (likely in header/navbar)
2. Import notification context:
```typescript
import { useNotification } from '../context/NotificationContext';

function BellIcon() {
  const { unreadCount } = useNotification();
  
  return (
    <div className="relative">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="badge">{unreadCount}</span>
      )}
    </div>
  );
}
```

**Search for:**
- Files with "bell" or "notification icon"
- Header/navbar components
- Top navigation components

---

## 📝 Step-by-Step Integration Guide

### Step 1: Find QR Scan Component
```powershell
# Search for QR scan related files
rg -i "qr|scan|check.*in" --type tsx --type ts
```

### Step 2: Find Quiz Submission Component
```powershell
# Search for quiz submission files
rg -i "submit.*quiz|quiz.*submit" --type tsx --type ts
```

### Step 3: Find Bell Icon Component
```powershell
# Search for bell icon
rg -i "bell|notification.*icon" --type tsx --type ts
```

### Step 4: Update UpdateGrades.tsx
- File already known: `src/components/Dashboard/UpdateGrades.tsx`
- Add imports and notification calls after grade submission

---

## 🧪 Testing After Integration

### Test QR Scan Notifications:
1. Login as student
2. Scan QR code for attendance
3. Check student notifications - should see "Attendance Recorded"
4. Login as lecturer
5. Check lecturer notifications - should see "Student Checked In"

### Test Quiz Submission Notifications:
1. Login as student
2. Submit a quiz
3. Check student notifications - should see "Quiz Submitted"
4. Login as lecturer
5. Check lecturer notifications - should see "New Quiz Submission"

### Test Grading Notifications:
1. Login as lecturer
2. Grade a student's quiz
3. Check lecturer notifications - should see "Grade Recorded"
4. Login as that student
5. Check student notifications - should see "Quiz Graded: X/Y"

---

## 🎯 Priority Order

1. **HIGH:** Bell icon count (most visible feature)
2. **HIGH:** Grading notifications (UpdateGrades.tsx is known)
3. **MEDIUM:** Quiz submission notifications
4. **MEDIUM:** QR scan notifications

---

## 📦 Files to Search/Modify

- [ ] QR scan component (location unknown)
- [ ] Quiz submission component (location unknown)
- [ ] Bell icon component (location unknown)
- [ ] `src/components/Dashboard/UpdateGrades.tsx` (known)

---

## ✨ Benefits After Full Integration

1. **Real-time feedback** - Students know when actions are recorded
2. **Lecturer awareness** - Lecturers see student activity immediately
3. **Two-way communication** - Grade feedback loop complete
4. **Visual indicators** - Bell icon shows unread count
5. **Role separation** - Each role sees only relevant notifications

---

**Next Action:** Search for the remaining component files and integrate the notification calls.