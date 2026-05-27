# Admin Panel Login Credentials

## Current Credentials

**Username**: (No username field, password-only)  
**Password**: `Admin@123`

## How to Change Admin Password

### Option 1: Update .env.local (Recommended)

1. Open `.env.local` in the project root
2. Find this line:
   ```
   ADMIN_PASSWORD=Admin@123
   ```
3. Replace `Admin@123` with your desired password:
   ```
   ADMIN_PASSWORD=YourNewPassword123
   ```
4. Save the file
5. Restart your development server or redeploy
6. Login with the new password

### Option 2: Update .env.example

For team sharing or deployment:

1. Open `.env.example`
2. Update:
   ```
   ADMIN_PASSWORD=change-this-strong-password
   ```
3. Share instructions with team

## Environment Variables

### ADMIN_PASSWORD
- **Purpose**: Sets the admin login password
- **Default**: `admin123` (if not set)
- **Current**: `Admin@123`
- **Type**: String
- **How to use**: Set in `.env.local` or during deployment

### ADMIN_TOKEN
- **Purpose**: Secure session cookie token
- **Current**: `dt_admin_secure_token_daily_tutors_2026`
- **Type**: String
- **How to use**: Set in `.env.local` or during deployment
- **Note**: Used internally for session management

## Security Tips

✅ Use a **strong password** with:
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*)

❌ Avoid:
- Simple passwords like "admin123"
- Passwords matching usernames
- Passwords in git commits (use .env.local, not .env)

## Login Page Location

- **URL**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Auto-redirect**: If not logged in, you'll be redirected to login page

## Session Duration

- Login session lasts **7 days**
- Cookies are httpOnly (secure against XSS)
- Auto-logout available in admin sidebar

## Example Setup

```bash
# Generate a random secure token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e

# Update .env.local
ADMIN_PASSWORD=SecurePassword@2026
ADMIN_TOKEN=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e
```

---
**Note**: The login system is designed for single-admin access. For multi-user admin roles, consider implementing NextAuth.js or Supabase Authentication.
