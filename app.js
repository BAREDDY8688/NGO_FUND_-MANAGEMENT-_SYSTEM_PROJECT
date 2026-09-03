/**
 * NGO FUND MANAGEMENT SYSTEM - CORE APPLICATION LOGIC
 * Router, Event Handlers, Modals, Forms, and Live UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Router
  initRouter();

  // Initialize UI Events
  initPublicEvents();
  initAuthEvents();
  initDashboardEvents();

  // Initial Data & UI Sync
  refreshAllDashboardData();
});

/* ==========================================================================
   ROUTING SYSTEM
   ========================================================================== */
function navigateTo(route) {
  window.location.hash = route;
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  // Default route if empty
  if (!window.location.hash) {
    window.location.hash = '#home';
  } else {
    handleRoute();
  }
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';
  
  const publicNavbar = document.getElementById('publicNavbar');
  const publicFooter = document.getElementById('publicFooter');
  const publicContainer = document.getElementById('publicViewsContainer');
  const portalContainer = document.getElementById('portalWrapper');

  const authenticatedRoutes = ['dashboard', 'profile', 'donations', 'expenses', 'messages', 'settings'];
  const publicRoutes = ['home', 'about', 'donate', 'request', 'contact', 'login', 'register'];

  if (authenticatedRoutes.includes(hash)) {
    // Check Auth State
    if (!window.authService.isAuthenticated()) {
      showToast('Please login to access the management portal.', 'warning');
      window.location.hash = '#login';
      return;
    }

    // Hide Public UI, Show Portal UI
    if (publicNavbar) publicNavbar.style.display = 'none';
    if (publicFooter) publicFooter.style.display = 'none';
    if (publicContainer) publicContainer.style.display = 'none';
    if (portalContainer) portalContainer.style.display = 'flex';

    // Activate Dashboard Sub-View
    document.querySelectorAll('.dash-view').forEach(view => view.classList.remove('active-dash-view'));
    const targetDashView = document.getElementById(`${hash}View`);
    if (targetDashView) {
      targetDashView.classList.add('active-dash-view');
    }

    // Update Sidebar active state
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.target === hash) {
        item.classList.add('active');
      }
    });

    // Update Topbar Title
    const titleEl = document.getElementById('topbarPageTitle');
    if (titleEl) {
      const titleMap = {
        dashboard: '📊 Financial Overview & Analytics',
        profile: '👤 User Profile & Access Control',
        donations: '💰 Inflow Donations Ledger',
        expenses: '📉 Fund Disbursements & Expenses',
        messages: '✉️ Communications & Donor Inquiries',
        settings: '⚙️ NGO System Settings'
      };
      titleEl.innerHTML = titleMap[hash] || 'Dashboard';
    }

    // Sync views
    if (hash === 'dashboard') {
      refreshAllDashboardData();
      if (window.initDashboardCharts) window.initDashboardCharts();
    } else if (hash === 'donations') {
      renderDonationsTable();
    } else if (hash === 'expenses') {
      renderExpensesTable();
    } else if (hash === 'messages') {
      renderMessagesInbox();
    } else if (hash === 'profile') {
      populateProfileForm();
    } else if (hash === 'settings') {
      populateSettingsForm();
    }

  } else {
    // Public Flow
    if (publicNavbar) publicNavbar.style.display = 'block';
    if (publicFooter) publicFooter.style.display = 'block';
    if (publicContainer) publicContainer.style.display = 'block';
    if (portalContainer) portalContainer.style.display = 'none';

    // Show active public view
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active-view'));
    const targetView = document.getElementById(`${hash}View`);
    if (targetView) {
      targetView.classList.add('active-view');
    }

    // Update Public Nav links active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${hash}`) {
        link.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ==========================================================================
   PUBLIC PAGES EVENTS & LOGIC
   ========================================================================== */
function initPublicEvents() {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('publicNavMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Public Notifications Dropdown Toggle
  const notifBtn = document.getElementById('publicNotifBtn');
  const notifDropdown = document.getElementById('publicNotifDropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove('active');
      }
    });
  }

  // Preset Amount Buttons in Donation Page
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('customDonationAmount');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (customAmountInput) {
        customAmountInput.value = btn.dataset.amount;
      }
      updateQrCodeAmount(btn.dataset.amount);
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      updateQrCodeAmount(e.target.value || 0);
    });
  }

  // Payment Tab Switcher (UPI vs Card)
  const paymentTabs = document.querySelectorAll('.payment-tab-btn');
  const upiSection = document.getElementById('upiPaymentSection');
  const cardSection = document.getElementById('cardPaymentSection');

  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const method = tab.dataset.method;
      if (method === 'upi') {
        if (upiSection) upiSection.style.display = 'block';
        if (cardSection) cardSection.style.display = 'none';
      } else {
        if (upiSection) upiSection.style.display = 'none';
        if (cardSection) cardSection.style.display = 'block';
      }
    });
  });

  // Copy UPI ID button
  const copyUpiBtn = document.getElementById('copyUpiIdBtn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      const upiText = document.getElementById('displayUpiId').innerText;
      navigator.clipboard.writeText(upiText);
      showToast('UPI ID copied to clipboard: ' + upiText, 'info');
    });
  }

  // Simulate UPI Pay / Complete Donation Form
  const donationForm = document.getElementById('publicDonationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleDonationSubmission();
    });
  }

  // Fund Request Form Submission
  const requestForm = document.getElementById('fundRequestForm');
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRequestSubmission();
    });
  }

  // Application Tracking Lookup Tool
  const trackBtn = document.getElementById('trackRequestBtn');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      handleRequestLookup();
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('publicContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContactSubmission();
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('open');
    });
  });
}

function updateQrCodeAmount(amt) {
  const qrAmtLabel = document.getElementById('qrCodeDisplayAmount');
  if (qrAmtLabel) {
    qrAmtLabel.innerText = `$${Number(amt || 0).toLocaleString()}`;
  }
}

function handleDonationSubmission() {
  const donorName = document.getElementById('donorFullName').value.trim() || 'Generous Donor';
  const donorEmail = document.getElementById('donorEmail').value.trim() || 'donor@example.com';
  const amount = Number(document.getElementById('customDonationAmount').value) || 50;
  const category = document.getElementById('donationCategorySelect').value || 'General Fund';
  const isAnonymous = document.getElementById('anonymousDonationCheck').checked;
  const tax80G = document.getElementById('taxExemptionCheck').checked;

  const activeTab = document.querySelector('.payment-tab-btn.active');
  const method = activeTab && activeTab.dataset.method === 'card' ? 'Credit/Debit Card' : 'UPI / QR Code';

  const newDonation = window.dataService.addDonation({
    donorName: isAnonymous ? 'Anonymous Donor' : donorName,
    email: donorEmail,
    amount: amount,
    category: category,
    method: method,
    tax80G: tax80G
  });

  // Show Success Receipt Modal
  showDonationReceiptModal(newDonation);

  // Clear form
  document.getElementById('publicDonationForm').reset();
  document.getElementById('customDonationAmount').value = '100';
  updateQrCodeAmount(100);

  // Refresh data
  refreshAllDashboardData();
  showToast(`Donation of $${amount} received! Thank you for your support.`, 'success');
}

function showDonationReceiptModal(donation) {
  const settings = window.dataService.getSettings();
  const receiptBody = document.getElementById('receiptModalContent');
  if (receiptBody) {
    receiptBody.innerHTML = `
      <div style="text-align: center; padding: 1rem 0; border-bottom: 2px dashed var(--border-color); margin-bottom: 1.5rem;">
        <div style="font-size: 2.5rem; color: var(--success); margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-check"></i></div>
        <h3 style="color: var(--primary-dark); font-size: 1.4rem;">Payment Successful &amp; Verified</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Tax Deductible Exemption Receipt under 80G</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.5rem;">
        <div><strong>Receipt No:</strong> <span style="color: var(--primary); font-weight: 700;">${donation.id}</span></div>
        <div><strong>Date:</strong> ${donation.date}</div>
        <div><strong>Donor Name:</strong> ${donation.donorName}</div>
        <div><strong>Donor Email:</strong> ${donation.email}</div>
        <div><strong>Cause / Project:</strong> ${donation.category}</div>
        <div><strong>Payment Method:</strong> ${donation.method}</div>
        <div><strong>NGO 80G Tax Reg:</strong> ${settings.tax80GNumber}</div>
        <div><strong>Status:</strong> <span class="badge badge-success">COMPLETED</span></div>
      </div>

      <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-color);">
        <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Amount Contributed</span>
        <h2 style="color: var(--primary); font-size: 2.2rem; font-weight: 800;">$${Number(donation.amount).toLocaleString()} USD</h2>
      </div>
    `;
  }
  openModal('donationReceiptModal');
}

function handleRequestSubmission() {
  const applicantName = document.getElementById('applicantName').value.trim();
  const organization = document.getElementById('applicantOrg').value.trim() || 'Individual';
  const category = document.getElementById('requestCategory').value;
  const amount = Number(document.getElementById('requestAmount').value);
  const urgency = document.getElementById('requestUrgency').value;
  const purpose = document.getElementById('requestPurpose').value.trim();

  if (!applicantName || !amount || !purpose) {
    showToast('Please fill all required fields in the request form.', 'warning');
    return;
  }

  const newReq = window.dataService.addRequest({
    applicantName,
    organization,
    category,
    amount,
    urgency,
    purpose
  });

  document.getElementById('fundRequestForm').reset();

  // Show Tracking ID feedback
  const resultModal = document.getElementById('requestSuccessResult');
  if (resultModal) {
    resultModal.innerHTML = `
      <div style="text-align: center; padding: 1.5rem;">
        <div style="font-size: 3rem; color: var(--primary); margin-bottom: 0.75rem;"><i class="fa-solid fa-file-circle-check"></i></div>
        <h3 style="margin-bottom: 0.5rem;">Fund Request Registered Successfully!</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
          Your application has been assigned a unique reference ID. Our audit and field volunteer team will review it within 24-48 hours.
        </p>
        <div style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-md); border: 2px dashed var(--primary); margin-bottom: 1rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-hover);">APPLICATION TRACKING ID</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary-dark); letter-spacing: 1px;">${newReq.id}</div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Please save this code to track your verification and disbursement status anytime.</p>
      </div>
    `;
  }
  openModal('requestSuccessModal');
  refreshAllDashboardData();
}

function handleRequestLookup() {
  const query = document.getElementById('trackingInputCode').value.trim().toUpperCase();
  const resultBox = document.getElementById('trackingResultDisplay');

  if (!query) {
    showToast('Please enter an application tracking code (e.g. REQ-2026-8941)', 'warning');
    return;
  }

  const requests = window.dataService.getRequests();
  const found = requests.find(r => r.id.toUpperCase() === query || r.id.toUpperCase().includes(query));

  if (resultBox) {
    resultBox.classList.add('active');
    if (found) {
      const badgeClass = found.status === 'Disbursed' ? 'badge-success' : (found.status === 'Approved' ? 'badge-primary' : 'badge-warning');
      resultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-weight: 800; font-size: 1.05rem; color: #ffffff;">${found.id}</span>
          <span class="badge ${badgeClass}">${found.status}</span>
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1; display: grid; gap: 0.35rem;">
          <div><strong>Applicant:</strong> ${found.applicantName} (${found.organization})</div>
          <div><strong>Requested Amount:</strong> $${Number(found.amount).toLocaleString()}</div>
          <div><strong>Purpose:</strong> ${found.purpose}</div>
          <div><strong>Urgency:</strong> ${found.urgency}</div>
          <div><strong>Date Logged:</strong> ${found.date}</div>
          <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.08); border-radius: 6px; border-left: 3px solid var(--accent);">
            <strong>Field Audit Note:</strong> ${found.comments || 'Application under assessment.'}
          </div>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div style="text-align: center; color: #f87171; padding: 1rem;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
          <p>No request record found for ID: <strong>${query}</strong>. Please verify the code.</p>
        </div>
      `;
    }
  }
}

function handleContactSubmission() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill all required contact fields.', 'warning');
    return;
  }

  window.dataService.addMessage({
    sender: name,
    email: email,
    subject: subject || 'General Inquiry',
    body: message
  });

  document.getElementById('publicContactForm').reset();
  showToast('Your message has been sent to the NGO management team!', 'success');
  refreshAllDashboardData();
}

/* ==========================================================================
   AUTHENTICATION EVENTS & MODALS
   ========================================================================== */
function initAuthEvents() {
  // Switch between Login & Register tabs
  const loginTabBtn = document.getElementById('tabLoginBtn');
  const registerTabBtn = document.getElementById('tabRegisterBtn');
  const loginFormBox = document.getElementById('loginFormContainer');
  const registerFormBox = document.getElementById('registerFormContainer');

  if (loginTabBtn && registerTabBtn) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      loginFormBox.style.display = 'block';
      registerFormBox.style.display = 'none';
    });

    registerTabBtn.addEventListener('click', () => {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      registerFormBox.style.display = 'block';
      loginFormBox.style.display = 'none';
    });
  }

  // 1-Click Demo Logins
  document.querySelectorAll('.demo-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const email = pill.dataset.email;
      const role = pill.dataset.role;
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = 'password123';
      
      // Auto submit login
      executeLogin(email, 'password123', role);
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('authLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const role = document.getElementById('loginRoleSelect').value;
      executeLogin(email, password, role);
    });
  }

  // Registration Form Submission
  const registerForm = document.getElementById('authRegisterForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const role = document.getElementById('regRole').value;
      const password = document.getElementById('regPassword').value;

      const result = window.authService.register(fullName, email, phone, role, password);
      if (result.success) {
        showToast('Registration successful! Welcome to the portal.', 'success');
        // Auto login
        window.authService.login(email, password, role);
        syncCurrentUserUI();
        window.location.hash = '#dashboard';
      } else {
        showToast(result.message, 'danger');
      }
    });
  }

  // Logout Trigger
  const logoutBtns = document.querySelectorAll('.logout-trigger-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal('logoutConfirmModal');
    });
  });

  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', () => {
      window.authService.logout();
      closeModal('logoutConfirmModal');
      showToast('Logged out successfully.', 'info');
      window.location.hash = '#home';
    });
  }
}

function executeLogin(email, password, role) {
  if (!email || !password) {
    showToast('Please enter both email and password.', 'warning');
    return;
  }

  const result = window.authService.login(email, password, role);
  if (result.success) {
    showToast(`Welcome back, ${result.user.name}!`, 'success');
    syncCurrentUserUI();
    window.location.hash = '#dashboard';
  }
}

function syncCurrentUserUI() {
  const user = window.authService.getCurrentUser();
  if (!user) return;

  // Sidebar User details
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarUserAvatar');

  if (nameEl) nameEl.innerText = user.name;
  if (roleEl) roleEl.innerText = user.role;
  if (avatarEl) avatarEl.innerText = user.avatarInitials || 'AD';

  // Topbar
  const topbarName = document.getElementById('topbarUserName');
  if (topbarName) topbarName.innerText = user.name;
}

/* ==========================================================================
   AUTHENTICATED DASHBOARD & SIDEBAR EVENTS
   ========================================================================== */
function initDashboardEvents() {
  // Sidebar Links
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.dataset.target;
      if (target) {
        window.location.hash = `#${target}`;
      }
    });
  });

  // Responsive Sidebar Toggle & Backdrop Logic
  const sidebar = document.getElementById('portalSidebar');
  const portalWrapper = document.getElementById('portalWrapper');
  const sidebarLogoBtn = document.getElementById('sidebarLogoToggleBtn');
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  function togglePortalSidebar() {
    if (!sidebar) return;
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    } else {
      sidebar.classList.toggle('sidebar-closed');
      sidebar.classList.toggle('collapsed');
      if (portalWrapper) {
        portalWrapper.classList.toggle('sidebar-is-closed');
      }
    }
  }

  if (sidebarLogoBtn) {
    sidebarLogoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      togglePortalSidebar();
    });
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      togglePortalSidebar();
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  // Auto-close mobile sidebar when navigating via sidebar link on small screens
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });

  // Quick Action Buttons
  const quickAddDonationBtn = document.getElementById('quickAddDonationBtn');
  if (quickAddDonationBtn) {
    quickAddDonationBtn.addEventListener('click', () => openModal('addDonationModal'));
  }

  const quickAddExpenseBtn = document.getElementById('quickAddExpenseBtn');
  if (quickAddExpenseBtn) {
    quickAddExpenseBtn.addEventListener('click', () => openModal('addExpenseModal'));
  }

  // Add Donation Modal Form
  const recordDonationForm = document.getElementById('recordDonationForm');
  if (recordDonationForm) {
    recordDonationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const donorName = document.getElementById('modalDonorName').value.trim();
      const email = document.getElementById('modalDonorEmail').value.trim();
      const amount = Number(document.getElementById('modalDonorAmount').value);
      const category = document.getElementById('modalDonorCategory').value;
      const method = document.getElementById('modalDonorMethod').value;

      if (!donorName || !amount) {
        showToast('Please fill all required donation fields.', 'warning');
        return;
      }

      window.dataService.addDonation({
        donorName,
        email: email || 'donor@charity.org',
        amount,
        category,
        method,
        tax80G: true
      });

      closeModal('addDonationModal');
      recordDonationForm.reset();
      refreshAllDashboardData();
      renderDonationsTable();
      showToast('New donation recorded successfully!', 'success');
    });
  }

  // Add Expense Claim Modal Form
  const recordExpenseForm = document.getElementById('recordExpenseForm');
  if (recordExpenseForm) {
    recordExpenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('modalExpenseTitle').value.trim();
      const category = document.getElementById('modalExpenseCategory').value;
      const amount = Number(document.getElementById('modalExpenseAmount').value);
      const vendor = document.getElementById('modalExpenseVendor').value.trim();

      if (!title || !amount || !vendor) {
        showToast('Please fill all required expense fields.', 'warning');
        return;
      }

      window.dataService.addExpense({
        title,
        category,
        amount,
        vendor
      });

      closeModal('addExpenseModal');
      recordExpenseForm.reset();
      refreshAllDashboardData();
      renderExpensesTable();
      showToast('Expense claim recorded and disbursed!', 'success');
    });
  }

  // Profile Editor Form
  const profileForm = document.getElementById('userProfileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('profName').value.trim();
      const email = document.getElementById('profEmail').value.trim();
      const phone = document.getElementById('profPhone').value.trim();
      const role = document.getElementById('profRole').value;
      const bio = document.getElementById('profBio').value.trim();

      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

      window.dataService.updateUser({ name, email, phone, role, bio, avatarInitials: initials });
      window.authService.login(email, 'pass', role);

      syncCurrentUserUI();
      populateProfileForm();
      showToast('Profile updated successfully!', 'success');
    });
  }

  // Settings Form
  const settingsForm = document.getElementById('systemSettingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ngoName = document.getElementById('setNgoName').value.trim();
      const regNumber = document.getElementById('setRegNumber').value.trim();
      const tax80GNumber = document.getElementById('setTax80G').value.trim();
      const currency = document.getElementById('setCurrency').value;
      const upiId = document.getElementById('setUpiId').value.trim();

      window.dataService.updateSettings({ ngoName, regNumber, tax80GNumber, currency, upiId });
      showToast('System configuration saved!', 'success');
    });
  }

  // Reset Demo Data Button
  const resetDataBtn = document.getElementById('resetSystemDataBtn');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all records to the original demo state?')) {
        window.dataService.resetAllData();
        refreshAllDashboardData();
        renderDonationsTable();
        renderExpensesTable();
        renderMessagesInbox();
        showToast('System reset to default demo data.', 'info');
      }
    });
  }

  // Global Search in Topbar
  const topbarSearch = document.getElementById('topbarSearchInput');
  if (topbarSearch) {
    topbarSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      // Search in whichever table is active
      filterTableByQuery(q);
    });
  }
}

/* ==========================================================================
   DATA POPULATION & TABLE RENDERERS
   ========================================================================== */
function refreshAllDashboardData() {
  const summary = window.dataService.getFinancialSummary();
  const settings = window.dataService.getSettings();
  const curr = settings.currency || '$';

  // Update KPI Cards
  const kpiRaised = document.getElementById('kpiTotalRaised');
  const kpiExpenses = document.getElementById('kpiTotalExpenses');
  const kpiBalance = document.getElementById('kpiTreasuryBalance');
  const kpiRequests = document.getElementById('kpiPendingRequests');
  const kpiDonors = document.getElementById('kpiTotalDonors');

  if (kpiRaised) kpiRaised.innerText = `${curr}${summary.totalRaised.toLocaleString()}`;
  if (kpiExpenses) kpiExpenses.innerText = `${curr}${summary.totalExpenses.toLocaleString()}`;
  if (kpiBalance) kpiBalance.innerText = `${curr}${summary.balance.toLocaleString()}`;
  if (kpiRequests) kpiRequests.innerText = summary.pendingRequestsCount;
  if (kpiDonors) kpiDonors.innerText = `${summary.donorsCount} Donors`;

  // Public Hero & Impact Stats
  const heroRaised = document.getElementById('heroStatRaised');
  const heroDisbursed = document.getElementById('heroStatDisbursed');
  const heroActive = document.getElementById('heroStatActive');
  if (heroRaised) heroRaised.innerText = `${curr}${summary.totalRaised.toLocaleString()}`;
  if (heroDisbursed) heroDisbursed.innerText = `${curr}${summary.totalExpenses.toLocaleString()}`;
  if (heroActive) heroActive.innerText = '28 Active';

  // Render Recent Activity lists in Dashboard
  renderDashboardRecentTables();

  // Re-render Charts
  if (window.initDashboardCharts) {
    window.initDashboardCharts();
  }

  // Update Badges in Sidebar
  const msgBadge = document.getElementById('sidebarMessagesBadge');
  const unreadMsgCount = window.dataService.getMessages().filter(m => m.unread).length;
  if (msgBadge) {
    msgBadge.innerText = unreadMsgCount || '';
    msgBadge.style.display = unreadMsgCount > 0 ? 'inline-block' : 'none';
  }

  syncCurrentUserUI();
}

function renderDashboardRecentTables() {
  const donations = window.dataService.getDonations().slice(0, 4);
  const expenses = window.dataService.getExpenses().slice(0, 4);

  const donTable = document.getElementById('dashRecentDonationsTable');
  if (donTable) {
    donTable.innerHTML = donations.map(d => `
      <tr>
        <td><strong>${d.donorName}</strong></td>
        <td><span class="badge badge-primary">${d.category}</span></td>
        <td><strong>$${Number(d.amount).toLocaleString()}</strong></td>
        <td><span class="badge badge-success">${d.status}</span></td>
      </tr>
    `).join('');
  }

  const expTable = document.getElementById('dashRecentExpensesTable');
  if (expTable) {
    expTable.innerHTML = expenses.map(e => `
      <tr>
        <td><strong>${e.title}</strong></td>
        <td><span class="badge badge-warning">${e.category}</span></td>
        <td><strong>$${Number(e.amount).toLocaleString()}</strong></td>
        <td><span class="badge badge-info">${e.status}</span></td>
      </tr>
    `).join('');
  }
}

function renderDonationsTable() {
  const donations = window.dataService.getDonations();
  const tableBody = document.getElementById('fullDonationsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = donations.map(d => `
    <tr>
      <td><strong>${d.id}</strong></td>
      <td>
        <div style="font-weight: 700;">${d.donorName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${d.email}</div>
      </td>
      <td><span class="badge badge-primary">${d.category}</span></td>
      <td><strong style="color: var(--primary);">$${Number(d.amount).toLocaleString()}</strong></td>
      <td>${d.method}</td>
      <td>${d.date}</td>
      <td><span class="badge badge-success">${d.status}</span></td>
      <td>
        <button class="btn btn-sm btn-light" onclick="viewDonationReceipt('${d.id}')">
          <i class="fa-solid fa-receipt"></i> Receipt
        </button>
      </td>
    </tr>
  `).join('');
}

function renderExpensesTable() {
  const expenses = window.dataService.getExpenses();
  const tableBody = document.getElementById('fullExpensesTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = expenses.map(e => {
    const badgeClass = e.status === 'Disbursed' ? 'badge-success' : (e.status === 'Approved' ? 'badge-primary' : 'badge-warning');
    return `
      <tr>
        <td><strong>${e.id}</strong></td>
        <td>
          <div style="font-weight: 700;">${e.title}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Vendor: ${e.vendor}</div>
        </td>
        <td><span class="badge badge-warning">${e.category}</span></td>
        <td><strong style="color: #b45309;">$${Number(e.amount).toLocaleString()}</strong></td>
        <td>${e.date}</td>
        <td>${e.approvedBy || 'Board'}</td>
        <td><span class="badge ${badgeClass}">${e.status}</span></td>
      </tr>
    `;
  }).join('');
}

function renderMessagesInbox() {
  const messages = window.dataService.getMessages();
  const listContainer = document.getElementById('messagesListItems');
  if (!listContainer) return;

  listContainer.innerHTML = messages.map((m, idx) => `
    <div class="message-item ${m.unread ? 'unread' : ''} ${idx === 0 ? 'active' : ''}" onclick="selectMessage('${m.id}')">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
        <span style="font-weight: 700; font-size: 0.9rem;">${m.sender}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${m.date}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--primary-dark); font-weight: 600; margin-bottom: 0.25rem;">${m.subject}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.body}</div>
    </div>
  `).join('');

  if (messages.length > 0) {
    selectMessage(messages[0].id);
  }
}

function selectMessage(id) {
  const messages = window.dataService.getMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return;

  const previewPanel = document.getElementById('messageDetailView');
  if (previewPanel) {
    previewPanel.innerHTML = `
      <div class="msg-detail-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${msg.subject}</h3>
            <div style="font-size: 0.85rem; color: var(--text-muted);">From: <strong>${msg.sender}</strong> &lt;${msg.email}&gt;</div>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${msg.date}</span>
        </div>
      </div>
      <div class="msg-detail-body">
        <p>${msg.body}</p>
      </div>
      <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.75rem;">
        <button class="btn btn-primary btn-sm" onclick="showReplyPrompt('${msg.sender}', '${msg.email}')">
          <i class="fa-solid fa-reply"></i> Send Response
        </button>
        <button class="btn btn-light btn-sm" onclick="showToast('Message archived.', 'info')">
          <i class="fa-solid fa-box-archive"></i> Archive
        </button>
      </div>
    `;
  }
}

function showReplyPrompt(sender, email) {
  const replyText = prompt(`Compose official response to ${sender} (${email}):`);
  if (replyText) {
    showToast(`Response dispatched to ${email}!`, 'success');
  }
}

function populateProfileForm() {
  const user = window.authService.getCurrentUser();
  if (!user) return;

  const nameInput = document.getElementById('profName');
  const emailInput = document.getElementById('profEmail');
  const phoneInput = document.getElementById('profPhone');
  const roleInput = document.getElementById('profRole');
  const bioInput = document.getElementById('profBio');

  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
  if (phoneInput) phoneInput.value = user.phone;
  if (roleInput) roleInput.value = user.role;
  if (bioInput) bioInput.value = user.bio;

  const cardAvatar = document.getElementById('profileCardBigAvatar');
  const cardName = document.getElementById('profileCardName');
  const cardRole = document.getElementById('profileCardRole');
  const cardKyc = document.getElementById('profileCardKyc');

  if (cardAvatar) cardAvatar.innerText = user.avatarInitials || 'AD';
  if (cardName) cardName.innerText = user.name;
  if (cardRole) cardRole.innerText = user.role;
  if (cardKyc) cardKyc.innerText = user.kycStatus || 'Verified';
}

function populateSettingsForm() {
  const settings = window.dataService.getSettings();
  if (!settings) return;

  if (document.getElementById('setNgoName')) document.getElementById('setNgoName').value = settings.ngoName;
  if (document.getElementById('setRegNumber')) document.getElementById('setRegNumber').value = settings.regNumber;
  if (document.getElementById('setTax80G')) document.getElementById('setTax80G').value = settings.tax80GNumber;
  if (document.getElementById('setCurrency')) document.getElementById('setCurrency').value = settings.currency;
  if (document.getElementById('setUpiId')) document.getElementById('setUpiId').value = settings.upiId;
}

function viewDonationReceipt(id) {
  const donations = window.dataService.getDonations();
  const don = donations.find(d => d.id === id);
  if (don) {
    showDonationReceiptModal(don);
  }
}

function filterTableByQuery(q) {
  const rows = document.querySelectorAll('.custom-table tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

/* ==========================================================================
   MODAL & TOAST NOTIFICATION HELPERS
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
  }
});

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-circle-check',
    danger: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || 'fa-circle-info'}" style="font-size: 1.25rem;"></i>
    <div style="flex: 1; font-size: 0.9rem; font-weight: 600;">${message}</div>
    <button style="background:none; border:none; color:var(--text-light); cursor:pointer;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Export global helpers
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.viewDonationReceipt = viewDonationReceipt;
window.selectMessage = selectMessage;
window.showReplyPrompt = showReplyPrompt;
