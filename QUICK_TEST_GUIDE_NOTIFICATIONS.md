# Quick Test Guide - Notification Fixes

## 🚀 Quick Test (5 minutes)

### Test 1: Reset Button (1 min)
1. Go to: `https://spmproject-web.vercel.app/lecturer/attendance`
2. Click **"Reset Attendance"** button
3. ✅ **Expected:** No error, shows success/warning message

---

### Test 2: Quiz Creation Notifications (2 min)
1. Go to: `https://spmproject-web.vercel.app/lecturer/assessment`
2. Select course: **BIT364**
3. Click **"Create Quiz"**
4. Fill in:
   - Title: "Test Quiz"
   - Description: "Testing notifications"
   - Click **"Create Quiz"**
5. ✅ **Expected:** Success message + notification appears
6. Click bell icon (top right)
7. ✅ **Expected:** See "Quiz Created" notification

---

### Test 3: Separate Student/Lecturer Notifications (2 min)
1. **As Lecturer:**
   - Go to: `https://spmproject-web.vercel.app/lecturer/notifications`
   - ✅ **Expected:** See lecturer-specific notifications (quiz created, attendance, etc.)

2. **Logout and login as Student:**
   - Go to: `https://spmproject-web.vercel.app/student/notifications?tab=notifications`
   - ✅ **Expected:** See student-specific notifications (new quiz available, etc.)
   - Should be DIFFERENT from lecturer notifications

---

## 🔍 What to Look For

### ✅ Success Indicators:
- Reset button works without "Route not found" error
- Quiz creation shows success message
- Bell icon shows notification count
- Lecturer and student see different notifications
- Notifications persist after page refresh

### ❌ Issues to Report:
- Any "Route not found" errors
- Notifications not appearing
- Same notifications for both roles
- Notifications disappear after refresh

---

## 📱 Browser Console Check

Open browser console (F12) and look for:
```
📱 [NotificationContext] Loaded X notifications for notifications_lecturer
📱 [NotificationService] Stored notification for students
📱 [LecturerNotifications] Loaded X total notifications
```

---

## 🎯 Key Features Implemented

1. **Reset Button** - Now handles missing backend route gracefully
2. **Role-Based Notifications** - Students and lecturers have separate notifications
3. **Quiz Creation** - Sends notifications to both students and lecturer
4. **Persistent Storage** - Notifications survive page refresh
5. **Bell Icon Count** - Shows unread notification count

---

## 🔧 Troubleshooting

### Notifications not showing?
1. Check localStorage in browser DevTools
2. Look for keys: `notifications_student` and `notifications_lecturer`
3. Clear localStorage and try again

### Same notifications for both roles?
1. Logout completely
2. Clear browser cache
3. Login again with correct role

---

## 📊 Test Results Template

```
Test 1 - Reset Button: [ ] Pass [ ] Fail
Test 2 - Quiz Creation: [ ] Pass [ ] Fail
Test 3 - Separate Notifications: [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
_________________________________
```

---

**Ready to test!** 🎉