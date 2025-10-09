# Quick Test Guide - Attendance Notifications

## 🚀 Quick Test (5 minutes)

### Step 1: Start as Lecturer
1. Open: `https://spmproject-web.vercel.app/lecturer/login`
2. Login with lecturer credentials
3. Navigate to: **Attendance** page
4. **IMPORTANT:** Click "Allow" when browser asks for notification permission
5. Generate a QR code session (if not already active)
6. Keep this window open and visible

### Step 2: Start as Student (New Browser/Incognito)
1. Open: `https://spmproject-web.vercel.app/student-login` (in incognito or different browser)
2. Login with student credentials
3. Navigate to: **Record Attendance**
4. Scan the QR code OR enter the session code manually
5. Wait for success message

### Step 3: Watch Lecturer Page
**Within 2-4 seconds, you should see:**

✅ **Browser Notification** (top-right of screen)
```
🎓 New Student Check-in
[Student Name] just checked in at [Time]
```

✅ **In-App Notification** (green alert box, top-right of page)
```
🎓 New Check-in!
[Student Name] just scanned the QR code at [Time]
```

✅ **Attendance Table Updates**
- New row appears at top
- Row is highlighted in green
- Total attendees count increases

✅ **Console Logs** (Press F12 to see)
```
🔔 NEW ATTENDANCE DETECTED! 1 new students
📢 Showing notification for: [Student Name]
📱 Showing browser notification...
📢 Creating in-app notification...
```

## ❌ Troubleshooting

### No Notification Appears?

**Check 1: Browser Permission**
- Look for 🔔 icon in address bar
- Click it and select "Allow"
- Refresh the page

**Check 2: Console Logs**
- Press F12 to open console
- Look for `🔔 NEW ATTENDANCE DETECTED!`
- If you see it, notifications are working but browser blocked them

**Check 3: Try Different Browser**
- Chrome/Edge work best
- Firefox also works well
- Safari may require extra steps

**Check 4: Verify Real-Time Polling**
- Look for `🔍 Real-time check` logs every 2 seconds
- If missing, refresh the page

### Still Not Working?

1. **Hard Refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear Cache:** Browser settings → Clear browsing data
3. **Check Backend:** Use "Test Backend" button in debug panel
4. **Force Check:** Use "Force Check" button in debug panel

## 🎯 What to Look For

### On Lecturer Page:
- [ ] "Live Updates" indicator pulsing (bottom-right)
- [ ] Console logs every 2 seconds
- [ ] Notification permission prompt on first visit
- [ ] Real-time table updates

### When Student Scans:
- [ ] Browser notification appears
- [ ] In-app green alert appears
- [ ] Table updates within 2-4 seconds
- [ ] Total count increases
- [ ] New row highlighted

## 📱 Mobile Testing

**Note:** Mobile browsers have limited notification support

**iOS Safari:**
- No browser notifications
- In-app notifications work
- Table updates work

**Android Chrome:**
- Browser notifications work
- In-app notifications work
- Table updates work

## 🔧 Debug Panel

If issues persist, use the debug panel (only visible in development):

1. **Test Backend** - Verifies API connectivity
2. **Clear Cache** - Resets all local data
3. **Full Diagnosis** - Comprehensive system check
4. **Force Check** - Manually triggers attendance check

## ✅ Success Criteria

The system is working correctly if:
1. Lecturer sees notification within 2-4 seconds of student scan
2. Attendance table updates automatically
3. Console shows `🔔 NEW ATTENDANCE DETECTED!`
4. Total attendees count is accurate

## 📊 Performance

- **Polling Interval:** Every 2 seconds
- **Notification Delay:** 0-2 seconds after scan
- **Table Update:** Instant
- **Browser Notification:** Instant (if permission granted)

## 🎓 Best Practices

1. **Always allow notifications** when prompted
2. **Keep lecturer page open** during attendance sessions
3. **Check console logs** if something seems wrong
4. **Use Chrome/Edge** for best experience
5. **Test with one student first** before full class

---

**Quick Reference:**
- Lecturer Page: `/lecturer/attendance`
- Student Page: `/student/record-attendance`
- Polling: Every 2 seconds
- Notification: Browser + In-app
