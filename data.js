/**
 * NGO FUND MANAGEMENT SYSTEM - DATA & STATE MANAGER
 * Persistent LocalStorage Store with Rich Realistic Initial Seed Data
 */

const STORAGE_KEYS = {
  DONATIONS: 'ngo_donations_data',
  EXPENSES: 'ngo_expenses_data',
  REQUESTS: 'ngo_requests_data',
  MESSAGES: 'ngo_messages_data',
  USER: 'ngo_current_user',
  SETTINGS: 'ngo_system_settings'
};

// Seed Data
const INITIAL_DONATIONS = [
  { id: 'DON-9481', donorName: 'Aarav Patel', email: 'aarav.patel@example.com', amount: 500, category: 'Healthcare Camps', method: 'UPI / QR Code', date: '2026-08-20', status: 'Completed', tax80G: true },
  { id: 'DON-9480', donorName: 'Elena Rostova', email: 'elena.r@example.org', amount: 1200, category: 'Child Education', method: 'Card / Stripe', date: '2026-08-19', status: 'Completed', tax80G: true },
  { id: 'DON-9479', donorName: 'Michael Chen', email: 'mchen@techreach.com', amount: 2500, category: 'Disaster Relief', method: 'Bank Wire', date: '2026-08-18', status: 'Completed', tax80G: true },
  { id: 'DON-9478', donorName: 'Priya Sharma', email: 'priya.s@gmail.com', amount: 150, category: 'Food & Nutrition', method: 'UPI / QR Code', date: '2026-08-17', status: 'Completed', tax80G: false },
  { id: 'DON-9477', donorName: 'David Miller', email: 'dmiller@outlook.com', amount: 750, category: 'Child Education', method: 'Card / Stripe', date: '2026-08-16', status: 'Completed', tax80G: true },
  { id: 'DON-9476', donorName: 'Sophia Ananya', email: 'sophia@globalaid.org', amount: 3000, category: 'Healthcare Camps', method: 'Bank Wire', date: '2026-08-15', status: 'Completed', tax80G: true },
  { id: 'DON-9475', donorName: 'Anonymous Donor', email: 'anonymous@ngo.org', amount: 100, category: 'General Fund', method: 'UPI / QR Code', date: '2026-08-14', status: 'Completed', tax80G: false }
];

const INITIAL_EXPENSES = [
  { id: 'EXP-401', title: 'Medical Kits & Mobile Ambulance Fuel', category: 'Healthcare Camps', amount: 1450, vendor: 'City Health Supplies', date: '2026-08-19', status: 'Disbursed', approvedBy: 'Finance Board' },
  { id: 'EXP-402', title: 'School Textbooks & Uniforms (50 Kids)', category: 'Child Education', amount: 820, vendor: 'Vidya Publications', date: '2026-08-18', status: 'Disbursed', approvedBy: 'Audit Lead' },
  { id: 'EXP-403', title: 'Ration Kits (200 Families Flood Relief)', category: 'Food & Nutrition', amount: 2100, vendor: 'Grain & Grocery Hub', date: '2026-08-17', status: 'Disbursed', approvedBy: 'Board Director' },
  { id: 'EXP-404', title: 'Emergency Waterproof Tents (40 units)', category: 'Disaster Relief', amount: 1600, vendor: 'Apex Shelter Equip', date: '2026-08-15', status: 'Approved', approvedBy: 'Audit Lead' },
  { id: 'EXP-405', title: 'Annual Third-Party Financial Audit Fee', category: 'Administrative & Audit', amount: 650, vendor: 'Grant Thornton Auditors', date: '2026-08-12', status: 'Disbursed', approvedBy: 'Finance Board' },
  { id: 'EXP-406', title: 'Community Water Filtration System', category: 'Healthcare Camps', amount: 950, vendor: 'AquaPure Systems', date: '2026-08-10', status: 'Under Review', approvedBy: 'Pending' }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-2026-8941', applicantName: 'Ramesh Kumar', organization: 'Greenfield Village Council', purpose: 'Community Clinic Solar Refrigeration for Vaccines', amount: 1200, category: 'Healthcare', urgency: 'Urgent', date: '2026-08-19', status: 'Approved', comments: 'Verified by field volunteer team. Funds queued.' },
  { id: 'REQ-2026-7812', applicantName: 'Sister Teresa Memorial School', organization: 'STMS Rural Academy', purpose: 'Digital Learning Tablets for Grade 8 Students', amount: 1800, category: 'Education', urgency: 'Normal', date: '2026-08-18', status: 'Under Review', comments: 'Documentation under audit.' },
  { id: 'REQ-2026-6523', applicantName: 'Fatima Begum', organization: 'Coastal Fishermen Relief Group', purpose: 'Emergency Ration Kits Post Cyclone Alert', amount: 2500, category: 'Disaster Relief', urgency: 'Emergency', date: '2026-08-16', status: 'Disbursed', comments: 'Ration supplies delivered to 150 families.' }
];

const INITIAL_MESSAGES = [
  { id: 'MSG-101', sender: 'Siddharth Rao', email: 'siddharth@csrnetwork.com', subject: 'Corporate CSR Partnership for 2026-27', body: 'Greetings! Our corporation wants to allocate $50,000 for your rural child education programs. Could you share your verified tax exemption certificates?', date: '2026-08-20', unread: true },
  { id: 'MSG-102', sender: 'Ananya Deshmukh', email: 'ananya@volunteers.org', subject: 'Volunteer Doctor Support for Weekend Camps', body: 'Hello team, we have a group of 12 certified pediatricians willing to volunteer for your mobile medical camps next month.', date: '2026-08-19', unread: true },
  { id: 'MSG-103', sender: 'Robert Jenkins', email: 'rjenkins@aidfoundation.org', subject: 'Inquiry on 80G Tax Exemption Receipt DON-9477', body: 'Received the automatic receipt. Just wanted to double check if the certificate is eligible for international tax deductible claims. Thank you!', date: '2026-08-17', unread: false }
];

const INITIAL_SETTINGS = {
  ngoName: 'NGO Fund Management System',
  regNumber: 'NGO-REG-2018-IND-9941',
  tax80GNumber: 'AAATF1829RF89',
  currency: '$',
  currencyCode: 'USD',
  upiId: 'ngofunds@sbi',
  contactEmail: 'contact@ngofunds.org',
  contactPhone: '+1 (800) 456-7890 / +91 98765 43210',
  officeAddress: 'Global NGO Tower, Suite 400, Financial District, NY & MG Road, New Delhi',
  enableUpiGateway: true,
  enableCardGateway: true,
  autoReceipt: true
};

const INITIAL_USER = {
  name: 'Dr. Sarah Jenkins',
  email: 'admin@ngofunds.org',
  role: 'Administrator & Fund Director',
  phone: '+1 (555) 234-5678',
  bio: 'Certified Non-Profit Financial Director overseeing transparent fund allocation and global impact programs.',
  avatarInitials: 'SJ',
  kycStatus: 'Verified',
  joinDate: 'March 2021'
};

// Data Service Class
class DataService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    }
  }

  // Getters
  getDonations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS)) || [];
  }

  getExpenses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES)) || [];
  }

  getRequests() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS)) || [];
  }

  getMessages() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || [];
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_SETTINGS;
  }

  getUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || INITIAL_USER;
  }

  // Mutations
  addDonation(donation) {
    const list = this.getDonations();
    const newDonation = {
      id: 'DON-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...donation
    };
    list.unshift(newDonation);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));
    return newDonation;
  }

  addExpense(expense) {
    const list = this.getExpenses();
    const newExpense = {
      id: 'EXP-' + Math.floor(400 + Math.random() * 600),
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
      approvedBy: this.getUser().name,
      ...expense
    };
    list.unshift(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
    return newExpense;
  }

  addRequest(request) {
    const list = this.getRequests();
    const newReq = {
      id: 'REQ-2026-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      comments: 'Application received and registered for field verification.',
      ...request
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
    return newReq;
  }

  addMessage(msg) {
    const list = this.getMessages();
    const newMsg = {
      id: 'MSG-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      unread: true,
      ...msg
    };
    list.unshift(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
    return newMsg;
  }

  updateUser(userData) {
    const current = this.getUser();
    const updated = { ...current, ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  }

  updateSettings(settingsData) {
    const current = this.getSettings();
    const updated = { ...current, ...settingsData };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // Financial KPI Aggregations
  getFinancialSummary() {
    const donations = this.getDonations();
    const expenses = this.getExpenses();
    const requests = this.getRequests();
    const totalRaised = donations.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = totalRaised - totalExpenses;
    const pendingRequestsCount = requests.filter(r => r.status === 'Under Review' || r.status === 'Pending').length;
    const donorsCount = new Set(donations.map(d => d.email || d.donorName)).size;

    return {
      totalRaised,
      totalExpenses,
      balance,
      pendingRequestsCount,
      donorsCount,
      totalTransactions: donations.length + expenses.length
    };
  }

  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
  }
}

// Instantiate global instance
window.dataService = new DataService();
