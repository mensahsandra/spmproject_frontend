# 🔍 Notification Debugging Guide

## Issue: Notifications Not Showing

### Step 1: Check Browser Console

After deployment, open browser console (F12) and look for these logs:

#### When Student Checks In:

**Expected logs:**
```
🔍 Real-time check - Lecturer ID: 68e7b7fe871c602ac21b9eb6
🔍 Real-time check - Records: 2, Last count: 1
🔔 NEW ATTENDANCE DETECTED! 1 new students
📢 Showing notification for: John Doe
🔔 [NotificationContext] addNotification called: {type: 'attendance', title: '🎓 New Student Check-in', ...}
🔔 [NotificationContext] New notification created: {...}
🔔 [NotificationContext] Notifications updated. Total: 1
🔔 [NotificationContext] Browser notification permission: granted
🔔 [NotificationContext] Showing browser notification
🔔 [NotificationContext] Showing toast notification
✅ [NotificationContext] Notification added: [attendance] 🎓 New Student Check-in
🔔 [AcademicHeader] Notification counts: {unreadCount: 1, propNotificationCount: 0, finalCount: 1}
```

**If you see:**
- ❌ No logs at all → NotificationProvider not loaded
- ❌ "addNotification is not a function" → Context not properly connected
- ❌ "Browser notifications not granted" → Permission issue
- ❌ unreadCount: 0 → Notifications not being added to state

---

### Step 2: Test Notification Context Manually

Open browser console and run:

```javascript
// Test 1: Check if context is available
console.log('Notification permission:', Notification.permission);

// Test 2: Request permission if needed
if (Notification.permission === 'default') {
  Notification.requestPermission().then(p => console.log('Permission:', p));
}

// Test 3: Test browser notification directly
if (Notification.permission === 'granted') {
  new Notification('Test', { body: 'This is a test notification' });
}

// Test 4: Check localStorage
console.log('Stored notifications:', localStorage.getItem('notifications'));
```

---

### Step 3: Check Session Timing Issue

The session expiry issue might be due to:

1. **Server time vs Client time mismatch**
2. **Timezone differences**
3. **Duration calculation error**

**To test:**

```javascript
// In browser console when session is created:
const session = {
  issuedAt: '2025-10-10T07:00:00.000Z',
  expiresAt: '2025-10-10T07:05:00.000Z',
  durationMinutes: 5
};

const now = new Date();
const expires = new Date(session.expiresAt);
const remaining = (expires - now) / 1000 / 60; // minutes

console.log('Now:', now);
console.log('Expires:', expires);
console.log('Remaining minutes:', remaining);
```

---

### Step 4: Common Issues & Solutions

#### Issue: Bell icon shows 0 even after notification

**Possible causes:**
1. NotificationProvider not wrapping the component
2. AcademicHeader not using the hook
3. State not updating

**Solution:**
```javascript
// Check in console:
console.log('React DevTools → Components → NotificationProvider → hooks → State');
// Should show notifications array
```

#### Issue: Toast notification doesn't appear

**Possible causes:**
1. CSS not loaded
2. Toast element not appended to DOM
3. Z-index issue

**Solution:**
```javascript
// Check in console after notification:
console.log('Toast elements:', document.querySelectorAll('[class*="fixed top-"]'));
// Should show toast divs
```

#### Issue: Browser notification doesn't show

**Possible causes:**
1. Permission not granted
2. Browser doesn't support notifications
3. Site settings blocking

**Solution:**
1. Check: `chrome://settings/content/notifications`
2. Ensure your site is allowed
3. Try in incognito mode

---

### Step 5: Force Test Notification

Add this to your console to manually trigger a notification:

```javascript
// This simulates what happens when a student checks in
const event = new CustomEvent('test-notification');
window.dispatchEvent(event);

// Or directly call if you have access:
// (This won't work unless you expose it, but shows the pattern)
```

---

### Step 6: Check Network Tab

1. Open Network tab (F12)
2. Filter: `/api/attendance/lecturer/`
3. When student checks in, you should see:
   - Request to `/api/attendance/lecturer/{id}`
   - Status: 200
   - Response: `{success: true, records: [...]}`

If you see:
- ❌ 404 → Lecturer ID is undefined
- ❌ 401 → Token missing/invalid
- ❌ 500 → Server error

---

### Step 7: Verify Real-Time Polling

The AttendanceLogs component polls every 2 seconds. Check console for:

```
🔍 Real-time check - Lecturer ID: ...
🔍 Real-time check - Records: X, Last count: Y
```

If you DON'T see these logs:
1. Component not mounted
2. useEffect not running
3. Error in polling function

---

### Step 8: Session Timing Debug

Add this to check session expiry:

```javascript
// When you generate a session, log:
const session = /* your session object */;
console.log('Session timing:', {
  issued: new Date(session.issuedAt),
  expires: new Date(session.expiresAt),
  duration: session.durationMinutes,
  calculatedExpiry: new Date(new Date(session.issuedAt).getTime() + session.durationMinutes * 60000),
  serverTime: new Date(),
  clientTime: new Date()
});
```

If `calculatedExpiry` doesn't match `expires`, there's a calculation bug.

---

## Quick Fixes

### Fix 1: Clear Everything and Start Fresh

```javascript
// Clear all stored data
localStorage.removeItem('notifications');
localStorage.clear();
// Hard refresh: Ctrl+Shift+R
```

### Fix 2: Force Notification Permission

```javascript
// Request permission again
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
  if (permission === 'granted') {
    new Notification('Test', { body: 'Notifications enabled!' });
  }
});
```

### Fix 3: Check if Context is Loaded

```javascript
// In React DevTools:
// 1. Select any component
// 2. In console, type: $r
// 3. Check if NotificationProvider is in tree
```

---

## Expected Behavior

### When Student Checks In:
1. ✅ API call to `/api/attendance/check-in` (200)
2. ✅ Real-time polling detects new record
3. ✅ `addNotification()` called
4. ✅ Toast appears (green, top-right)
5. ✅ Browser notification (if granted)
6. ✅ Bell icon count increases
7. ✅ Notification stored in localStorage

### When Grades Submitted:
1. ✅ API call to `/api/grades/bulk-update` (200)
2. ✅ `notifyBulkGradesSubmitted()` called
3. ✅ Toast appears (blue, top-right)
4. ✅ Browser notification (if granted)
5. ✅ Bell icon count increases

---

## After Deployment

1. **Wait 2-3 minutes** for Vercel to deploy
2. **Hard refresh** (Ctrl+Shift+R)
3. **Open console** (F12)
4. **Generate NEW session**
5. **Have student check in**
6. **Watch console for logs**

If you see all the expected logs but still no visual notification, it's likely a CSS/DOM issue.

If you don't see the logs, the context isn't being called.

---

## Report Back

After testing, report:
1. What logs do you see in console?
2. Does bell icon show any number?
3. Do you see toast notifications?
4. What's the value of `Notification.permission`?
5. Any errors in console?

This will help pinpoint the exact issue!
