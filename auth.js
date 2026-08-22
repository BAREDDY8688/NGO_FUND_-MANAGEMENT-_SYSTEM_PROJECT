/**
 * NGO FUND MANAGEMENT SYSTEM - AUTHENTICATION MANAGER
 * Handles Login, Registration, 1-Click Demo Logins, Role Session, & Logout
 */

const AUTH_STORAGE_KEY = 'ngo_auth_session';

class AuthService {
  constructor() {
    this.session = this.getSession();
  }

  getSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  isAuthenticated() {
    return this.getSession() !== null;
  }

  getCurrentUser() {
    const session = this.getSession();
    if (session) return session;
    return window.dataService.getUser();
  }

  login(email, password, role = 'Administrator') {
    // Validate demo/custom login
    const user = {
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email,
      role: role,
      phone: '+1 (555) 019-2834',
      bio: `Logged in as authorized ${role} for NGO Fund Management System.`,
      avatarInitials: email.substring(0, 2).toUpperCase(),
      kycStatus: 'Verified',
      loginTime: new Date().toISOString()
    };

    // If logging in as primary admin, use system user profile
    if (email.toLowerCase().includes('admin')) {
      const defaultUser = window.dataService.getUser();
      user.name = defaultUser.name;
      user.role = defaultUser.role;
      user.phone = defaultUser.phone;
      user.bio = defaultUser.bio;
      user.avatarInitials = defaultUser.avatarInitials;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    this.session = user;
    return { success: true, user };
  }

  register(fullName, email, phone, role, password) {
    if (!fullName || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    const initials = fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'NU';

    const newUser = {
      name: fullName,
      email: email,
      phone: phone || '+1 (555) 000-0000',
      role: role || 'Donor Member',
      bio: `Registered member of NGO Fund Network.`,
      avatarInitials: initials,
      kycStatus: 'Pending Verification',
      registeredAt: new Date().toISOString()
    };

    // Auto update in data service
    window.dataService.updateUser(newUser);

    return { success: true, user: newUser };
  }

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.session = null;
  }
}

// Global Auth instance
window.authService = new AuthService();
