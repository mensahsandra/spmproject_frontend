# 🔔 Notification System - Complete Guide

## ✅ What's Been Implemented

### 1. **Notification Context** (`src/context/NotificationContext.tsx`)
A centralized notification system that:
- ✅ Stores notifications with types (attendance, assessment, quiz, deadline, general)
- ✅ Tracks unread count (total and by type)
- ✅ Shows browser notifications (if permission granted)
- ✅ Shows beautiful in-app toast notifications (green for attendance, blue for assessment, etc.)
- ✅ Persists notifications in localStorage
- ✅ Provides hooks for any component to add/read notifications

### 2. **Bell Icon with Live Count** (`AcademicHeader.tsx`)
- ✅ Shows real-time unread notification count
- ✅ Green badge with number (e.g., "3")
- ✅ Updates automatically when new notifications arrive
- ✅ Works across all pages

### 3. **Attendance Integration** (`AttendanceLogs.tsx`)
- ✅ Automatically detects new student check-ins
- ✅ Creates notifications with type "attendance"
- ✅ Shows browser + in-app notifications
- ✅ Updates bell icon count

### 4. **Enhanced Notifications Page** (`EnhancedNotificationsPage.tsx`)
- ✅ Shows all notifications grouped by type
- ✅ Tabs for: All, Attendance, Assessment, Quiz, Deadlines
- ✅ Shows unread count per type
- ✅ Mark as read / Mark all as read
- ✅ Clear all notifications
- ✅ Beautiful UI with icons and colors

---

## 🎨 Notification Colors & Icons

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| **Attendance** | 🟢 Green | 🎓 | Student check-ins, session alerts |
| **Assessment** | 🔵 Blue | 📝 | Grade submissions, assessment updates |
| **Quiz** | 🟣 Purple | 📋 | Quiz submissions, results |
| **Deadline** | 🔴 Red | ⏰ | Upcoming deadlines, overdue items |
| **General** | ⚪ Gray | 📢 | System messages, announcements |

---

## 📝 How to Use in Your Components

### Step 1: Import the Hook
```typescript
import { useNotifications } from '../context/NotificationContext';
```

### Step 2: Use in Component
```typescript
function MyComponent() {
  const { addNotification, unreadCount, unreadByType } = useNotifications();
  
  // Add a notification
  const handleNewGrade = (studentName: string) => {
    addNotification({
      type: 'assessment',
      title: '📝 New Grade Submitted',
      message: `Grade submitted for ${studentName}`,
      data: { studentName } // Optional extra data
    });
  };
  
  return (
    <div>
      <p>Unread notifications: {unreadCount}</p>
      <p>Unread assessments: {unreadByType.assessment}</p>
    </div>
  );
}
```

---

## 🎯 Example Use Cases

### For Attendance (Already Implemented ✅)
```typescript
// When student checks in
addNotification({
  type: 'attendance',
  title: '🎓 New Student Check-in',
  message: `${studentName} just checked in at ${time}`,
  data: { studentId, sessionCode }
});
```

### For Assessment/Grades
```typescript
// When grade is submitted
addNotification({
  type: 'assessment',
  title: '📝 Grade Submitted',
  message: `Grade submitted for ${studentName} in ${courseName}`,
  data: { studentId, courseCode, grade }
});

// When all grades are submitted
addNotification({
  type: 'assessment',
  title: '✅ All Grades Submitted',
  message: `Successfully submitted grades for ${count} students`,
  data: { courseCode, count }
});
```

### For Quizzes
```typescript
// When student submits quiz
addNotification({
  type: 'quiz',
  title: '📋 Quiz Submitted',
  message: `${studentName} submitted ${quizTitle}`,
  data: { studentId, quizId, score }
});
```

### For Deadlines
```typescript
// Deadline approaching
addNotification({
  type: 'deadline',
  title: '⏰ Deadline Approaching',
  message: `${assignmentName} is due in 2 hours`,
  data: { assignmentId, dueDate }
});
```

---

## 🔧 Adding Notifications to Assessment Component

Here's how to add it to your grade submission component:

```typescript
// In UpdateGrades.tsx or similar
import { useNotifications } from '../../context/NotificationContext';

function UpdateGrades() {
  const { addNotification } = useNotifications();
  
  const handleGradeSubmit = async (studentName: string, grade: number) => {
    try {
      // Submit grade to backend
      await submitGrade(studentName, grade);
      
      // Show notification
      addNotification({
        type: 'assessment',
        title: '📝 Grade Submitted',
        message: `Grade ${grade} submitted for ${studentName}`,
        data: { studentName, grade }
      });
    } catch (error) {
      // Error notification
      addNotification({
        type: 'general',
        title: '❌ Error',
        message: `Failed to submit grade for ${studentName}`,
        data: { error }
      });
    }
  };
  
  return (
    // Your component JSX
  );
}
```

---

## 🎨 What You'll See

### 1. **Bell Icon** (Top-right header)
```
🔔 (3)  ← Green badge with count
```

### 2. **Toast Notification** (Top-right corner, auto-disappears)
```
┌─────────────────────────────────┐
│ 🎓 New Student Check-in         │
│ John Doe just checked in at     │
│ 7:30 PM                          │
└─────────────────────────────────┘
```

### 3. **Browser Notification** (If permission granted)
```
🎓 New Student Check-in
John Doe just checked in at 7:30 PM
```

### 4. **Notifications Page** (Click bell icon)
```
┌─────────────────────────────────────────┐
│ 🔔 Notifications                        │
│ 3 unread notifications                  │
│                                         │
│ [All (5)] [Attendance (2)] [Assessment (1)] │
│                                         │
│ ● 🎓 New Student Check-in               │
│   John Doe just checked in              │
│   5 mins ago                            │
│                                         │
│ ● 📝 Grade Submitted                    │
│   Grade 85 submitted for Jane Smith    │
│   10 mins ago                           │
└─────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

### Test 1: Attendance Notifications
1. ✅ Generate session as lecturer
2. ✅ Have student check in
3. ✅ See bell icon count increase
4. ✅ See green toast notification
5. ✅ See browser notification (if permission granted)
6. ✅ Click bell → See notification in list

### Test 2: Bell Icon Count
1. ✅ Bell shows "0" initially
2. ✅ Student checks in → Bell shows "1"
3. ✅ Another student checks in → Bell shows "2"
4. ✅ Click notification → Mark as read → Count decreases

### Test 3: Notification Types
1. ✅ Attendance notifications are green
2. ✅ Assessment notifications are blue
3. ✅ Each type has correct icon
4. ✅ Can filter by type on notifications page

---

## 🚀 Next Steps

### To Add Assessment Notifications:
1. Find your grade submission component (e.g., `UpdateGrades.tsx`)
2. Import `useNotifications` hook
3. Call `addNotification` when grades are submitted
4. Use type `'assessment'` for grade-related notifications

### To Add Quiz Notifications:
1. Find quiz submission handler
2. Add notification when student submits quiz
3. Use type `'quiz'`

### To Add Deadline Notifications:
1. Create a deadline checker (runs periodically)
2. Add notifications for approaching deadlines
3. Use type `'deadline'`

---

## 🎉 What's Working Now

✅ **Notification Context** - Centralized system
✅ **Bell Icon Count** - Shows unread count (GREEN!)
✅ **Attendance Notifications** - Auto-detects check-ins
✅ **Browser Notifications** - If permission granted
✅ **In-App Toasts** - Beautiful colored notifications
✅ **Notifications Page** - View all with filtering
✅ **Type-Specific Counts** - See count per type
✅ **Persistent Storage** - Survives page refresh

---

## 📞 Need Help?

The notification system is fully functional! Just:
1. Import `useNotifications` hook
2. Call `addNotification()` with type and message
3. Bell icon updates automatically
4. Users see notifications everywhere

**Example:**
```typescript
addNotification({
  type: 'assessment',
  title: 'Your Title',
  message: 'Your message',
  data: { any: 'extra data' }
});
```

That's it! 🎉
