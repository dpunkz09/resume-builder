# Phase 1 Testing Guide

## Prerequisites

1. **Database Setup** - You have two options:

### Option A: Apply Migration SQL (Recommended)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project: `bpedtbidtahyqvodijvz`
3. Navigate to SQL Editor
4. Copy contents from `db/migrations/0000_chilly_nocturne.sql`
5. Paste and run the SQL

### Option B: Use Seed Script (Alternative)

If the migration doesn't work, you can manually create tables using the seed script which will show you the schema structure.

## Testing Steps

### 1. Start the Development Server

```bash
npm run dev
```

The app should start at http://localhost:3000

### 2. Test Authentication Flow

#### A. Sign Up with Email

1. Navigate to http://localhost:3000 (should redirect to `/login`)
2. Click "Sign up" link
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Create account"
5. **Expected**: Redirects to `/dashboard`
6. **Expected**: Dashboard shows "Welcome back, Test User"
7. **Expected**: Empty state with "No resumes" message

#### B. Test Sign Out

1. Click "Sign out" button
2. **Expected**: Redirects to `/login`
3. **Expected**: Cannot access `/dashboard` without auth

#### C. Test Sign In

1. On login page, enter:
   - Email: "test@example.com"
   - Password: "password123"
2. Click "Sign in"
3. **Expected**: Redirects to `/dashboard`

### 3. Test Resume CRUD Operations

#### A. Create Resume

1. Click "+ New Resume" button
2. **Expected**: New resume appears with title "Untitled Resume"
3. **Expected**: Shows current date as "Last updated"
4. Try clicking "+ New Resume" again
5. **Expected**: Error message "Free plan limit: 1 resume. Upgrade to Pro for unlimited resumes."

#### B. Rename Resume

1. Click the pencil (✏️) icon on the resume card
2. **Expected**: Title becomes editable input field
3. Change title to "My Professional Resume"
4. Press Enter or click "Save"
5. **Expected**: Title updates and input closes
6. **Test Cancel**: Click pencil again, edit text, then press Escape or click "Cancel"
7. **Expected**: Changes are discarded

#### C. View Resume Details

1. **Expected**: Each resume card shows:
   - Title
   - Last updated date
   - Edit button
   - Rename icon (✏️)
   - Duplicate icon (📄)
   - Delete icon (🗑️)

#### D. Delete Resume

1. Click the trash (🗑️) icon
2. **Expected**: Confirmation dialog "Are you sure you want to delete this resume?"
3. Click OK/Yes
4. **Expected**: Resume is removed from list
5. **Expected**: Back to empty state
6. Create a new resume again (should work since you deleted the first one)

#### E. Duplicate Resume (Test Limits)

1. With one resume in the list, click duplicate icon (📄)
2. **Expected**: Error "Free plan limit: 1 resume. Upgrade to Pro for unlimited resumes."
3. Delete the existing resume
4. Create a new one
5. Now duplicate should also fail because it would create a 2nd resume

### 4. Test Authorization (Multi-User)

#### A. Create Second User

1. Sign out
2. Sign up with different email: "user2@example.com"
3. **Expected**: New dashboard with no resumes

#### B. Verify Isolation

1. Create a resume for user2
2. Sign out and sign in as first user ("test@example.com")
3. **Expected**: Only see your own resumes, not user2's resumes

### 5. Test Google OAuth (Optional - if configured)

1. On login or signup page, click "Sign in with Google"
2. **Expected**: Redirects to Google consent screen
3. Authorize the app
4. **Expected**: Redirects back to `/dashboard`
5. **Expected**: User name from Google profile appears in header

### 6. Test Protected Routes

1. Sign out completely
2. Try to access http://localhost:3000/dashboard directly
3. **Expected**: Redirects to `/login`
4. Try to access http://localhost:3000/resumes/any-id/edit
5. **Expected**: Redirects to `/login`

## Expected Behavior Summary

### ✅ Authentication

- [x] Sign up creates new user
- [x] Login with correct credentials works
- [x] Login with wrong credentials fails
- [x] Sign out clears session
- [x] Protected routes redirect to login

### ✅ Dashboard

- [x] Shows user name in header
- [x] Lists user's resumes
- [x] Empty state when no resumes
- [x] Sign out button works

### ✅ Resume Operations

- [x] Create resume (with limit check)
- [x] Rename resume (inline edit)
- [x] Delete resume (with confirmation)
- [x] Duplicate blocked by free limit
- [x] Timestamps update correctly

### ✅ Plan Limits

- [x] Free plan: Maximum 1 resume
- [x] Error message when limit reached
- [x] Create and duplicate both check limits

### ✅ Authorization

- [x] Users see only their own resumes
- [x] Cannot access other users' data
- [x] Session required for all operations

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution**:

1. Verify `DATABASE_URL` in `.env` is correct
2. Check Supabase project is running
3. Ensure IP is allowed in Supabase (check connection pooler)

### Issue: "Session not found" or constant redirects

**Solution**:

1. Clear browser cookies
2. Check `BETTER_AUTH_SECRET` is set in `.env`
3. Restart dev server

### Issue: Tables don't exist

**Solution**:

1. Run the migration SQL in Supabase SQL Editor
2. Or use `npm run db:push` (may need to wait/retry)

### Issue: Google OAuth doesn't work

**Solution**:

1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check redirect URI in Google Console: `http://localhost:3000/api/auth/callback/google`
3. Make sure the OAuth app is not restricted

## Database Verification

You can check the tables were created in Supabase:

1. Go to Table Editor in Supabase Dashboard
2. You should see these tables:
   - `user` (Better Auth)
   - `session` (Better Auth)
   - `account` (Better Auth)
   - `verification` (Better Auth)
   - `subscriptions` (Our app)
   - `resumes` (Our app)
   - `ai_usage` (Our app - for Phase 5)

3. After testing, check data:
   - `user` table should have your test users
   - `subscriptions` should have matching entries with `plan='free'`
   - `resumes` should have the resumes you created

## Next Steps

Once all tests pass:

- ✅ Phase 1 is confirmed working
- ✅ Ready to proceed to Phase 2: Editor + Preview

If any tests fail, note the specific error and we can debug before continuing.
