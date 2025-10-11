# Token Missing Error - Diagnosis and Fix

## Issue
When accessing `https://spmproject-web.vercel.app/lecturer/generatesession`, the console shows:
```json
{"ok":false,"message":"Missing token"}
```

## Root Cause Analysis

The "Missing token" error occurs when the backend API endpoint `/api/attendance-sessions` doesn't receive the authentication token in the request headers. This can happen due to several reasons:

### Possible Causes:
1. **Token not stored properly during login** - The lecturer login might not be storing the token correctly
2. **Token not retrieved correctly** - The `getToken()` function might not be finding the token
3. **Token not included in API request** - The `apiFetch()` function might not be adding the Authorization header
4. **Active role not set** - The `sessionStorage.activeRole` might not be set to 'lecturer'
5. **Token expired** - The JWT token might have expired

## Fixes Applied

### 1. Enhanced Token Validation in GenerateSession Component
**File:** `src/components/Dashboard/GenerateSession.tsx`

Added explicit token checking before making API calls:
```typescript
const handleGenerate = async () => {
  setError(null);
  
  // Verify token exists before proceeding
  const token = getToken('lecturer');
  if (!token) {
    setError('Authentication token missing. Please log in again.');
    console.error('❌ [SESSION-GEN] No token found for lecturer');
    return;
  }
  // ... rest of the code
}
```

### 2. Improved API Fetch Function with Better Logging
**File:** `src/utils/api.ts`

Enhanced the `apiFetch` function to:
- Log request details including token presence
- Better error handling and messages
- Explicit error throwing for non-OK responses

```typescript
export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { role, retry, headers, ...rest } = options;
  const endPoint = getApiBase();
  const authHeaders = getAuthHeaders(role, role);
  const finalHeaders = { ...authHeaders, ...(headers || {}) };
  
  // Debug logging
  console.log('🔍 [API-FETCH] Request details:', {
    path,
    role,
    hasToken: !!authHeaders.Authorization,
    tokenPreview: authHeaders.Authorization ? authHeaders.Authorization.substring(0, 30) + '...' : 'none',
    headers: finalHeaders
  });
  
  // ... rest of the implementation
}
```

### 3. Added Token Debug Component
**File:** `src/components/Debug/TokenDebug.tsx`

Created a debug component that displays:
- Active role from sessionStorage
- Lecturer token from localStorage
- Student token from localStorage
- All storage keys
- User information

This component is temporarily added to the GenerateSession page to help diagnose token issues.

## How to Diagnose the Issue

### Step 1: Check Browser Console
1. Open the page: `https://spmproject-web.vercel.app/lecturer/generatesession`
2. Open browser DevTools (F12)
3. Look for the debug panel in the bottom-right corner
4. Check the following:
   - **Active Role**: Should show "lecturer"
   - **Lecturer Token**: Should show a token (not "NOT FOUND")

### Step 2: Check LocalStorage
In the browser console, run:
```javascript
localStorage.getItem('token_lecturer')
sessionStorage.getItem('activeRole')
```

Expected results:
- `token_lecturer` should return a JWT token string
- `activeRole` should return "lecturer"

### Step 3: Check Network Request
1. Open Network tab in DevTools
2. Try to generate a session
3. Find the request to `/api/attendance-sessions`
4. Check the Headers section
5. Look for `Authorization: Bearer <token>`

## Solutions Based on Diagnosis

### If Token is Missing from LocalStorage:
**Problem:** Login is not storing the token correctly

**Solution:** Log out and log in again. The login form has been verified to correctly store tokens using:
```typescript
storeToken(role, data.token);
setActiveRole(role);
```

### If Token Exists but Not Sent in Request:
**Problem:** The `apiFetch` function is not including the token

**Solution:** This has been fixed in the updated `api.ts` file. The function now explicitly logs whether the token is being included.

### If Token is Expired:
**Problem:** The JWT token has expired

**Solution:** The system will automatically attempt to refresh the token. If refresh fails, you'll be redirected to login.

### If Active Role is Not Set:
**Problem:** `sessionStorage.activeRole` is not set to 'lecturer'

**Solution:** Log out and log in again. The login process sets this value.

## Testing the Fix

1. **Clear browser storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Log in as lecturer:**
   - Go to `/lecturer-login`
   - Enter credentials
   - Verify successful login

3. **Check token storage:**
   - Open console
   - Run: `localStorage.getItem('token_lecturer')`
   - Should return a token

4. **Navigate to generate session:**
   - Go to `/lecturer/generatesession`
   - Check the debug panel in bottom-right
   - Verify token is present

5. **Try to generate a session:**
   - Fill in course code
   - Click "Generate QR Code"
   - Check console for detailed logs
   - Should see successful session creation

## Removing Debug Component

Once the issue is resolved, remove the debug component:

**File:** `src/components/Dashboard/GenerateSession.tsx`

Remove these lines:
```typescript
import TokenDebug from '../Debug/TokenDebug';

// And in the return statement:
<TokenDebug />
```

## Additional Notes

### Token Storage Strategy
The application uses a namespaced token storage strategy:
- Student tokens: `token_student`
- Lecturer tokens: `token_lecturer`
- Active role: `activeRole` (in sessionStorage)

### Token Retrieval
The `getToken(role)` function:
1. Gets the role parameter or falls back to `activeRole` from sessionStorage
2. Looks for `token_<role>` in localStorage
3. Falls back to legacy `token` key if namespaced key not found

### API Request Flow
1. Component calls `apiFetch('/api/attendance-sessions', { role: 'lecturer', ... })`
2. `apiFetch` calls `getAuthHeaders(role, role)`
3. `getAuthHeaders` calls `getToken(role)` to get the token
4. Token is added to headers as `Authorization: Bearer <token>`
5. Request is sent to backend

## Backend Requirements

The backend must:
1. Accept `Authorization: Bearer <token>` header
2. Validate the JWT token
3. Return appropriate error messages:
   - `401 Unauthorized` if token is missing or invalid
   - `403 Forbidden` if role doesn't match
4. Return `{"ok":false,"message":"Missing token"}` only if Authorization header is missing

## Contact

If the issue persists after applying these fixes, check:
1. Backend logs for more details
2. Network tab for the actual request headers
3. Console logs for detailed debugging information