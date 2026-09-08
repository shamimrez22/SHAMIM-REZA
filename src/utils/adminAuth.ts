/**
 * Admin Authentication & Security Utility
 * Manages admin access credentials, login sessions, and credential updates.
 * Default credentials:
 *   Username: SHAMIM
 *   Password: 321
 * Credentials can be modified anytime from the Admin Panel.
 */

export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

export const DEFAULT_ADMIN_USERNAME = 'SHAMIM';
export const DEFAULT_ADMIN_PASSWORD = '321';

const CREDENTIALS_STORAGE_KEY = 'portfolio_admin_credentials';
const SESSION_STORAGE_KEY = 'portfolio_admin_session_auth';
const REMEMBER_STORAGE_KEY = 'portfolio_admin_remember_auth';

/**
 * Retrieves the currently configured admin credentials.
 * Defaults to SHAMIM / 321 if not previously customized.
 */
export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.username === 'string' && typeof parsed.password === 'string') {
        return {
          username: parsed.username.trim() || DEFAULT_ADMIN_USERNAME,
          password: parsed.password || DEFAULT_ADMIN_PASSWORD,
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {
    console.warn('Error reading admin credentials from storage:', e);
  }

  return {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
  };
}

/**
 * Checks if the current user session is authenticated.
 * Returns false by default to ensure username & password are required every time entering the admin panel.
 */
export function isUserAdminAuthenticated(): boolean {
  return false;
}

/**
 * Attempts to log in with provided username and password.
 * Username comparison is case-insensitive for user convenience (e.g., 'shamim' or 'SHAMIM').
 * Password must match exactly.
 */
export function verifyAdminLogin(
  inputUsername: string,
  inputPassword: string
): { success: boolean; message: string; username?: string } {
  const cleanUser = inputUsername.trim();
  const cleanPass = inputPassword.trim();

  if (!cleanUser) {
    return { success: false, message: 'অনুগ্রহ করে ইউজারনেম প্রবেশ করান।' };
  }

  if (!cleanPass) {
    return { success: false, message: 'অনুগ্রহ করে পাসওয়ার্ড প্রবেশ করান।' };
  }

  const currentCreds = getAdminCredentials();

  const isUsernameMatch =
    cleanUser.toLowerCase() === currentCreds.username.toLowerCase();
  const isPasswordMatch = cleanPass === currentCreds.password;

  if (isUsernameMatch && isPasswordMatch) {
    try {
      localStorage.setItem('portfolio_admin_logged_user', currentCreds.username);
    } catch {
      // Storage unavailable or quota exceeded
    }

    return {
      success: true,
      message: 'সফলভাবে লগইন হয়েছে! অ্যাডমিন প্যানেলে স্বাগতম।',
      username: currentCreds.username,
    };
  }

  return {
    success: false,
    message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।',
  };
}

/**
 * Updates the admin credentials with a new username and password.
 * Requires verification of current password.
 */
export function updateAdminCredentials(
  currentPasswordInput: string,
  newUsername: string,
  newPassword: string
): { success: boolean; message: string } {
  const currentCreds = getAdminCredentials();

  if (currentPasswordInput.trim() !== currentCreds.password) {
    return {
      success: false,
      message: 'বর্তমান পাসওয়ার্ডটি ভুল হয়েছে! যাচাই করে আবার চেষ্টা করুন।',
    };
  }

  const cleanNewUser = newUsername.trim();
  const cleanNewPass = newPassword.trim();

  if (!cleanNewUser) {
    return {
      success: false,
      message: 'নতুন ইউজারনেম খালি রাখা যাবে না।',
    };
  }

  if (!cleanNewPass) {
    return {
      success: false,
      message: 'নতুন পাসওয়ার্ড খালি রাখা যাবে না।',
    };
  }

  if (cleanNewPass.length < 3) {
    return {
      success: false,
      message: 'পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে।',
    };
  }

  try {
    const updated: AdminCredentials = {
      username: cleanNewUser,
      password: cleanNewPass,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('portfolio_admin_logged_user', cleanNewUser);

    return {
      success: true,
      message: 'Admin credentials successfully updated! (ইউজারনেম ও পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে)',
    };
  } catch (err) {
    return {
      success: false,
      message: 'Failed to save credentials to local storage. Please try again.',
    };
  }
}

/**
 * Resets admin credentials back to default:
 *   Username: SHAMIM
 *   Password: 321
 */
export function resetAdminCredentialsToDefault(): { success: boolean; message: string } {
  try {
    const defaultCreds: AdminCredentials = {
      username: DEFAULT_ADMIN_USERNAME,
      password: DEFAULT_ADMIN_PASSWORD,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(defaultCreds));
    localStorage.setItem('portfolio_admin_logged_user', DEFAULT_ADMIN_USERNAME);

    return {
      success: true,
      message: 'Credentials reset to default (Username: SHAMIM | Password: 321)',
    };
  } catch {
    return {
      success: false,
      message: 'Reset failed. Please try again.',
    };
  }
}

/**
 * Logs out the admin by clearing all authentication sessions.
 */
export function logoutAdminUser(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_STORAGE_KEY);
    localStorage.removeItem('portfolio_admin_logged_user');
  } catch {
    // Ignore storage errors
  }
}
