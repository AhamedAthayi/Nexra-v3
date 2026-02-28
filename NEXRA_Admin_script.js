/* ═══════════════════════════════════════════
   NEXRA Admin Panel — admin-script.js
   NEXRA Technology © 2026
   Fixed: Mobile sidebar toggle, duplicate tabs,
          receipt tbody IDs, account rendering
═══════════════════════════════════════════ */

// ── CREDENTIALS ──
var ADMIN_EMAIL = 'athayiathayi43@gmail.com';
var ADMIN_PASSWORD = 'admin123';

// ── DATA ──
var customers = [
  { id:1, name:'Pradeep Silva',    email:'pradeep@gmail.com',    phone:'0771234567', company:'Silva Trading',  service:'Professional Package', amount:'75,000', status:'Active',  date:'2026-01-15' },
  { id:2, name:'Nimal Fernando',   email:'nimal@outlook.com',    phone:'0762345678', company:'Fernando Pvt',   service:'POS System',           amount:'45,000', status:'Active',  date:'2026-01-22' },
  { id:3, name:'Ruwanthi Dias',    email:'ruwanthi@gmail.com',   phone:'0753456789', company:'–',              service:'Digital Marketing',    amount:'15,000', status:'Active',  date:'2026-02-01' },
  { id:4, name:'Kasun Perera',     email:'kasun@yahoo.com',      phone:'0744567890', company:'Perera Stores',  service:'Starter Package',      amount:'25,000', status:'Pending', date:'2026-02-10' },
  { id:5, name:'Samanthi Wijesinghe', email:'samanthi@gmail.com', phone:'0735678901', company:'SW Boutique',   service:'Custom Software',      amount:'120,000', status:'Active',  date:'2025-12-05' },
  { id:6, name:'Dilshan Rajapaksa', email:'dilshan@business.lk', phone:'0726789012', company:'DR Enterprises', service:'Enterprise Package',   amount:'200,000', status:'Active',  date:'2025-11-15' },
];

var orders = [
  { receipt:'NX-001234', name:'Pradeep Silva',    service:'Professional Package', amount:'75,000',  date:'2026-01-15', payment:'Bank Transfer',  status:'Active'  },
  { receipt:'NX-001235', name:'Nimal Fernando',   service:'POS System',           amount:'45,000',  date:'2026-01-22', payment:'Cash',           status:'Active'  },
  { receipt:'NX-001236', name:'Ruwanthi Dias',    service:'Digital Marketing',    amount:'15,000',  date:'2026-02-01', payment:'Online',         status:'Active'  },
  { receipt:'NX-001237', name:'Kasun Perera',     service:'Starter Package',      amount:'25,000',  date:'2026-02-10', payment:'Bank Transfer',  status:'Pending' },
  { receipt:'NX-001238', name:'Samanthi Wijesinghe', service:'Custom Software',  amount:'120,000', date:'2025-12-05', payment:'Payment Plan',   status:'Active'  },
  { receipt:'NX-001239', name:'Dilshan Rajapaksa', service:'Enterprise Package',  amount:'200,000', date:'2025-11-15', payment:'Bank Transfer',  status:'Active'  },
];

var packages = [
  { icon:'🌱', name:'Starter Package',    price:'LKR 25,000',    desc:'5-page website, basic SEO, 3 months support.' },
  { icon:'🚀', name:'Professional Package', price:'LKR 75,000', desc:'Web app, POS, 3 months marketing, 6 months support.' },
  { icon:'🏆', name:'Enterprise Package', price:'LKR 200,000+', desc:'Full suite, AI, multi-branch POS, 12 months marketing.' },
  { icon:'🖥️', name:'POS System',         price:'LKR 45,000',   desc:'Touch screen POS with inventory and analytics.' },
  { icon:'📣', name:'Digital Marketing',  price:'LKR 15,000/mo', desc:'Social media, Google Ads, SEO, 8 posts/month.' },
  { icon:'⚙️', name:'Custom Software',   price:'Quote-based',   desc:'Requirements-driven bespoke software development.' },
];

var adminAccounts = [
  { id:1, name:'Ahamed Athayi', email:'athayiathayi43@gmail.com', role:'Super Admin', status:'Active', created:'2026-01-01' },
];

var signupAccounts = [
  { id:1, name:'Pradeep Silva',     email:'pradeep@gmail.com',    phone:'0771234567', service:'Professional Package', joined:'2026-01-15', status:'Active' },
  { id:2, name:'Nimal Fernando',    email:'nimal@outlook.com',    phone:'0762345678', service:'POS System',           joined:'2026-01-22', status:'Active' },
  { id:3, name:'Ruwanthi Dias',     email:'ruwanthi@gmail.com',   phone:'0753456789', service:'Digital Marketing',    joined:'2026-02-01', status:'Active' },
];

var promoHistory = [];

// ── LOGIN ──
function adminLogin() {
  var e = document.getElementById('adm-email').value.trim();
  var p = document.getElementById('adm-pw').value;
  if (!e || !p) { toast('⚠️', 'Please enter email and password.'); return; }
  if (e !== ADMIN_EMAIL || p !== ADMIN_PASSWORD) {
    toast('❌', 'Invalid credentials. Please try again.');
    document.getElementById('adm-pw').value = '';
    document.getElementById('adm-pw').focus();
    return;
  }
  document.getElementById('login-screen').style.display = 'none';
  var app = document.getElementById('admin-app');
  app.classList.add('show');
  renderAll();
  toast('✅', 'Welcome back, Ahamed!');
}

function adminLogout() {
  if (!confirm('Sign out of the admin panel?')) return;
  document.getElementById('admin-app').classList.remove('show');
  document.getElementById('login-screen').style.display = '';
  document.getElementById('adm-pw').value = '';
}

// ── MOBILE SIDEBAR ──
function toggleSidebar() {
  var sb = document.querySelector('.sidebar');
  var ov = document.getElementById('sidebar-overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('open');
}
function closeSidebar() {
  var sb = document.querySelector('.sidebar');
  var ov = document.getElementById('sidebar-overlay');
  sb.classList.remove('open');
  ov.classList.remove('open');
}

// ── TAB NAVIGATION ──
function gotoTab(name, el) {
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
  var tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  if (el) el.classList.add('active');
  var titles = {
    overview: '📊 Overview', customers: '👥 Customers', packages: '📦 Packages',
    orders: '🛒 Orders', promo: '📣 Promotions', receipts: '🧾 Receipts',
    accounts: '🔑 Accounts', settings: '⚙️ Settings'
  };
  var title = document.getElementById('current-tab-title');
  if (title) title.textContent = titles[name] || name;
  // Close sidebar on mobile after nav
  closeSidebar();
}

// ── RENDER ALL ──
function renderAll() {
  renderCustomers();
  renderOrders();
  renderPackages();
  renderAllReceipts();
  renderAdminAccounts();
  renderSignupAccounts();
  renderPromoCustomers();
  renderChart();
}

// ── CUSTOMERS ──
function renderCustomers() {
  var tb = document.getElementById('cust-tbody');
  if (!tb) return;
  tb.innerHTML = customers.map(function (c, i) {
    return '<tr>' +
      '<td style="color:var(--muted);font-family:\'Space Mono\',monospace;font-size:0.75rem;">' + String(c.id).padStart(3,'0') + '</td>' +
      '<td style="font-weight:700;">' + c.name + '</td>' +
      '<td style="color:var(--muted);">' + c.email + '</td>' +
      '<td>' + c.phone + '</td>' +
      '<td style="color:var(--muted);">' + c.company + '</td>' +
      '<td style="color:var(--gold);">' + c.service + '</td>' +
      '<td style="color:var(--muted);font-size:0.82rem;">' + c.date + '</td>' +
      '<td><span class="badge ' + (c.status==='Active'?'b-active':c.status==='Pending'?'b-pending':'b-cancel') + '">' + c.status + '</span></td>' +
      '<td><div style="display:flex;gap:0.4rem;">' +
        '<button class="btn btn-ghost btn-sm" onclick="editCustomer(' + i + ')">✏️</button>' +
        '<button class="btn btn-red btn-sm" onclick="deleteCustomer(' + i + ')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function addCustomer() {
  var name    = document.getElementById('nc-name').value.trim();
  var email   = document.getElementById('nc-email').value.trim();
  var phone   = document.getElementById('nc-phone').value.trim();
  var company = document.getElementById('nc-company').value.trim();
  var service = document.getElementById('nc-service').value;
  var amount  = document.getElementById('nc-amount').value.trim();
  var status  = document.getElementById('nc-status').value;
  if (!name || !email) { toast('⚠️', 'Name and email are required.'); return; }
  customers.push({ id: customers.length + 1, name:name, email:email, phone:phone||'–', company:company||'–', service:service, amount:amount||'0', status:status, date:new Date().toISOString().split('T')[0] });
  renderCustomers();
  closeModal('add-customer-modal');
  toast('✅', 'Customer "' + name + '" added!');
  ['nc-name','nc-email','nc-phone','nc-company','nc-amount'].forEach(function(id){ document.getElementById(id).value=''; });
}

function editCustomer(i) {
  toast('ℹ️', 'Edit: ' + customers[i].name + ' (feature coming soon)');
}

function deleteCustomer(i) {
  if (!confirm('Delete customer "' + customers[i].name + '"?')) return;
  customers.splice(i, 1);
  renderCustomers();
  toast('🗑️', 'Customer deleted.');
}

function searchCustomers(q) {
  q = q.toLowerCase();
  var tb = document.getElementById('cust-tbody');
  if (!tb) return;
  tb.innerHTML = customers.filter(function(c) {
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.service.toLowerCase().includes(q);
  }).map(function(c, i) {
    return '<tr>' +
      '<td style="color:var(--muted);font-family:\'Space Mono\',monospace;font-size:0.75rem;">' + String(c.id).padStart(3,'0') + '</td>' +
      '<td style="font-weight:700;">' + c.name + '</td>' +
      '<td style="color:var(--muted);">' + c.email + '</td>' +
      '<td>' + c.phone + '</td>' +
      '<td style="color:var(--muted);">' + c.company + '</td>' +
      '<td style="color:var(--gold);">' + c.service + '</td>' +
      '<td style="color:var(--muted);font-size:0.82rem;">' + c.date + '</td>' +
      '<td><span class="badge ' + (c.status==='Active'?'b-active':c.status==='Pending'?'b-pending':'b-cancel') + '">' + c.status + '</span></td>' +
      '<td>–</td>' +
    '</tr>';
  }).join('');
}

// ── ORDERS ──
function renderOrders() {
  var tb = document.getElementById('orders-tbody');
  if (!tb) return;
  tb.innerHTML = orders.map(function (o, i) {
    return '<tr>' +
      '<td style="font-family:\'Space Mono\',monospace;font-size:0.78rem;color:var(--gold);">' + o.receipt + '</td>' +
      '<td style="font-weight:700;">' + o.name + '</td>' +
      '<td>' + o.service + '</td>' +
      '<td style="color:var(--gold);">LKR ' + o.amount + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td style="color:var(--muted);">' + o.payment + '</td>' +
      '<td><span class="badge ' + (o.status==='Active'?'b-active':o.status==='Pending'?'b-pending':'b-cancel') + '">' + o.status + '</span></td>' +
      '<td><div style="display:flex;gap:0.4rem;">' +
        '<button class="btn btn-ghost btn-sm" onclick="viewOrderReceipt(' + i + ')">🧾</button>' +
        '<button class="btn btn-red btn-sm" onclick="deleteOrder(' + i + ')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function viewOrderReceipt(i) {
  var o = orders[i];
  toast('🧾', 'Receipt ' + o.receipt + ' – ' + o.name);
}

function deleteOrder(i) {
  if (!confirm('Delete order ' + orders[i].receipt + '?')) return;
  orders.splice(i, 1);
  renderOrders();
  toast('🗑️', 'Order deleted.');
}

// ── PACKAGES ──
function renderPackages() {
  var grid = document.getElementById('pkg-grid');
  if (!grid) return;
  grid.innerHTML = packages.map(function (p, i) {
    return '<div class="pkg-admin-card">' +
      '<div style="font-size:2rem;margin-bottom:0.7rem;">' + p.icon + '</div>' +
      '<div class="pka-name">' + p.name + '</div>' +
      '<div class="pka-price">' + p.price + '</div>' +
      '<div class="pka-desc">' + p.desc + '</div>' +
      '<div class="pka-actions">' +
        '<button class="btn btn-out btn-sm" onclick="editPackage(' + i + ')">✏️ Edit</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="toast(\'📦\',\'' + p.name + ' – Active\')">👁️ View</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function editPackage(i) {
  toast('ℹ️', 'Edit ' + packages[i].name + ' (feature coming soon)');
}

function addPackage() {
  var name  = document.getElementById('np-name').value.trim();
  var price = document.getElementById('np-price').value.trim();
  var icon  = document.getElementById('np-icon').value.trim() || '📦';
  var desc  = document.getElementById('np-desc').value.trim();
  if (!name || !price) { toast('⚠️', 'Package name and price required.'); return; }
  packages.push({ icon:icon, name:name, price:price, desc:desc });
  renderPackages();
  closeModal('add-pkg-modal');
  toast('✅', 'Package "' + name + '" added!');
  ['np-name','np-price','np-icon','np-desc'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
}

// ── RECEIPT GENERATOR ──
function populateRecCustomers() {
  var sel = document.getElementById('rec-cust');
  if (!sel) return;
  sel.innerHTML = '<option value="">Select customer...</option>' +
    customers.map(function(c) { return '<option value="' + c.name + '">' + c.name + '</option>'; }).join('');
}

function genReceipt() {
  var cust  = document.getElementById('rec-cust').value;
  var svc   = document.getElementById('rec-svc').value.trim();
  var amt   = document.getElementById('rec-amt').value.trim();
  var date  = document.getElementById('rec-date').value;
  var pay   = document.getElementById('rec-pay').value;
  var notes = document.getElementById('rec-notes').value.trim();
  if (!svc || !amt || !date) { toast('⚠️', 'Service, amount, and date are required.'); return; }
  var id = 'NX-' + Date.now().toString().slice(-6);
  document.getElementById('rp-id').textContent = id;
  document.getElementById('rp-cust').textContent = cust || 'Walk-in Customer';
  document.getElementById('rp-svc').textContent = svc;
  document.getElementById('rp-amt').textContent = amt;
  document.getElementById('rp-date').textContent = date;
  document.getElementById('rp-pay').textContent = pay;
  document.getElementById('rp-notes').textContent = notes || '–';
  // Add to receipts history
  if (!orders.find(function(o){ return o.receipt === id; })) {
    orders.push({ receipt:id, name:cust||'Customer', service:svc, amount:amt.replace(/[^0-9,]/g,''), date:date, payment:pay, status:'Active' });
    renderOrders();
    renderAllReceipts();
  }
  toast('🧾', 'Receipt ' + id + ' generated!');
}

function renderAllReceipts() {
  var tb = document.getElementById('all-receipts-tbody');
  if (!tb) return;
  tb.innerHTML = orders.slice().reverse().slice(0, 20).map(function(o) {
    return '<tr>' +
      '<td style="font-family:\'Space Mono\',monospace;font-size:0.78rem;color:var(--gold);">' + o.receipt + '</td>' +
      '<td style="font-weight:700;">' + o.name + '</td>' +
      '<td>' + o.service + '</td>' +
      '<td style="color:var(--gold);">LKR ' + o.amount + '</td>' +
      '<td style="color:var(--muted);">' + o.date + '</td>' +
      '<td><button class="btn btn-ghost btn-sm" onclick="toast(\'🧾\',\'' + o.receipt + ' – ' + o.name + '\')">View</button></td>' +
    '</tr>';
  }).join('');
}

function printReceipt() { window.print(); toast('🖨️', 'Sending to printer...'); }

// ── PROMOTIONS ──
function renderPromoCustomers() {
  var sel = document.getElementById('promo-specific-cust');
  if (!sel) return;
  sel.innerHTML = customers.map(function(c) { return '<option value="' + c.name + '">' + c.name + ' – ' + c.service + '</option>'; }).join('');
}

function selectChannel(el, ch) {
  document.querySelectorAll('.promo-chip').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
}

function insertVar(v) {
  var ta = document.getElementById('promo-msg');
  if (!ta) return;
  var start = ta.selectionStart || ta.value.length;
  ta.value = ta.value.slice(0, start) + v + ta.value.slice(ta.selectionEnd);
  ta.focus();
}

function showSpecificCustomer(val) {
  var fg = document.getElementById('specific-cust-fg');
  if (fg) fg.style.display = (val === 'specific') ? 'block' : 'none';
}

function sendPromo() {
  var subj = document.getElementById('promo-subject').value.trim();
  var msg  = document.getElementById('promo-msg').value.trim();
  var target = document.getElementById('promo-target').value;
  if (!subj || !msg) { toast('⚠️', 'Subject and message required.'); return; }
  var count = target === 'all' ? customers.length : target === 'active' ? customers.filter(function(c){ return c.status==='Active'; }).length : 1;
  var channel = document.querySelector('.promo-chip.selected .pc-label');
  var channelName = channel ? channel.textContent : 'Email';
  promoHistory.unshift({ date: new Date().toLocaleDateString('en-GB'), subject: subj, sent: count + ' contacts', channel: channelName, status: 'Sent' });
  renderPromoHistory();
  toast('📤', 'Promotion sent to ' + count + ' customers via ' + channelName + '!');
  document.getElementById('promo-subject').value = '';
  document.getElementById('promo-msg').value = '';
}

function renderPromoHistory() {
  var tb = document.getElementById('promo-history');
  if (!tb) return;
  if (promoHistory.length === 0) { tb.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem;">No promotions sent yet.</td></tr>'; return; }
  tb.innerHTML = promoHistory.map(function(p) {
    return '<tr>' +
      '<td style="color:var(--muted);">' + p.date + '</td>' +
      '<td style="font-weight:700;">' + p.subject + '</td>' +
      '<td>' + p.sent + '</td>' +
      '<td><span class="badge b-pending">' + p.channel + '</span></td>' +
      '<td><span class="badge b-active">' + p.status + '</span></td>' +
    '</tr>';
  }).join('');
}

// ── ACCOUNTS ──
function renderAdminAccounts() {
  var tb = document.getElementById('admin-accounts-tbody');
  if (!tb) return;
  tb.innerHTML = adminAccounts.map(function (a, i) {
    return '<tr>' +
      '<td style="color:var(--muted);font-family:\'Space Mono\',monospace;font-size:0.75rem;">' + String(a.id).padStart(2,'0') + '</td>' +
      '<td style="font-weight:700;">' + a.name + '</td>' +
      '<td style="color:var(--muted);">' + a.email + '</td>' +
      '<td><span class="badge b-pending">' + a.role + '</span></td>' +
      '<td><span class="badge ' + (a.status==='Active'?'b-active':'b-cancel') + '">' + a.status + '</span></td>' +
      '<td><div style="display:flex;gap:0.4rem;">' +
        (i > 0 ? '<button class="btn btn-red btn-sm" onclick="signOutAdmin(' + i + ')">🔒 Sign Out</button>' : '<span style="color:var(--muted);font-size:0.75rem;">Super Admin</span>') +
        (i > 0 ? '<button class="btn btn-ghost btn-sm" onclick="deleteAdmin(' + i + ')">🗑️</button>' : '') +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function renderSignupAccounts() {
  var tb = document.getElementById('signup-accounts-tbody');
  if (!tb) return;
  tb.innerHTML = signupAccounts.map(function (a, i) {
    return '<tr>' +
      '<td style="color:var(--muted);font-family:\'Space Mono\',monospace;font-size:0.75rem;">' + String(a.id).padStart(2,'0') + '</td>' +
      '<td style="font-weight:700;">' + a.name + '</td>' +
      '<td style="color:var(--muted);">' + a.email + '</td>' +
      '<td>' + a.phone + '</td>' +
      '<td style="color:var(--gold);">' + a.service + '</td>' +
      '<td style="color:var(--muted);font-size:0.82rem;">' + a.joined + '</td>' +
      '<td><span class="badge ' + (a.status==='Active'?'b-active':'b-cancel') + '">' + a.status + '</span></td>' +
      '<td><div style="display:flex;gap:0.4rem;">' +
        '<button class="btn btn-red btn-sm" onclick="signOutUser(' + i + ')">🔒 Sign Out</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="deleteUserAccount(' + i + ')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function createAdmin() {
  var name = document.getElementById('na-name').value.trim();
  var email = document.getElementById('na-email').value.trim();
  var role  = document.getElementById('na-role').value;
  var pw    = document.getElementById('na-pw').value;
  var pw2   = document.getElementById('na-pw2').value;
  if (!name || !email) { toast('⚠️', 'Name and email required.'); return; }
  if (!pw || pw.length < 8) { toast('⚠️', 'Password must be at least 8 characters.'); return; }
  if (pw !== pw2) { toast('⚠️', 'Passwords do not match.'); return; }
  adminAccounts.push({ id: adminAccounts.length + 1, name:name, email:email, role:role, status:'Active', created:new Date().toISOString().split('T')[0] });
  renderAdminAccounts();
  closeModal('add-admin-modal');
  toast('✅', 'Admin "' + name + '" created!');
  ['na-name','na-email','na-pw','na-pw2'].forEach(function(id){ document.getElementById(id).value = ''; });
}

function createAccount() {
  var name  = document.getElementById('acc-name').value.trim();
  var email = document.getElementById('acc-email').value.trim();
  var phone = document.getElementById('acc-phone').value.trim();
  var svc   = document.getElementById('acc-service').value;
  var pw    = document.getElementById('acc-pw').value;
  if (!name || !email) { toast('⚠️', 'Name and email required.'); return; }
  if (!pw || pw.length < 8) { toast('⚠️', 'Password must be at least 8 characters.'); return; }
  signupAccounts.push({ id: signupAccounts.length + 1, name:name, email:email, phone:phone||'–', service:svc, joined:new Date().toISOString().split('T')[0], status:'Active' });
  renderSignupAccounts();
  closeModal('add-account-modal');
  toast('✅', 'Account for "' + name + '" created!');
  ['acc-name','acc-email','acc-phone','acc-pw'].forEach(function(id){ document.getElementById(id).value = ''; });
}

function signOutAdmin(i) {
  if (i === 0) { toast('⚠️', 'Cannot sign out the Super Admin.'); return; }
  adminAccounts[i].status = adminAccounts[i].status === 'Active' ? 'Signed Out' : 'Active';
  renderAdminAccounts();
  toast('🔒', adminAccounts[i].name + ' signed out.');
}

function deleteAdmin(i) {
  if (!confirm('Remove admin "' + adminAccounts[i].name + '"?')) return;
  adminAccounts.splice(i, 1);
  renderAdminAccounts();
  toast('🗑️', 'Admin removed.');
}

function signOutUser(i) {
  signupAccounts[i].status = signupAccounts[i].status === 'Active' ? 'Signed Out' : 'Active';
  renderSignupAccounts();
  toast('🔒', signupAccounts[i].name + ' ' + (signupAccounts[i].status === 'Active' ? 'restored' : 'signed out') + '.');
}

function deleteUserAccount(i) {
  if (!confirm('Delete account for "' + signupAccounts[i].name + '"?')) return;
  signupAccounts.splice(i, 1);
  renderSignupAccounts();
  toast('🗑️', 'Account deleted.');
}

// ── EXPORT ──
function exportCustomers() {
  var rows = [['ID','Name','Email','Phone','Company','Service','Amount','Status','Date'], ...customers.map(function(c){ return [c.id,c.name,c.email,c.phone,c.company,c.service,c.amount,c.status,c.date]; })];
  downloadCSV(rows, 'nexra_customers.csv');
  toast('📤', 'Customers exported to CSV!');
}

function exportOrders() {
  var rows = [['Receipt','Customer','Service','Amount','Date','Status'], ...orders.map(function(o){ return [o.receipt,o.name,o.service,'LKR '+o.amount,o.date,o.status]; })];
  downloadCSV(rows, 'nexra_orders.csv');
  toast('📤', 'Orders exported to CSV!');
}

function downloadCSV(rows, filename) {
  var csv = rows.map(function(r){ return r.join(','); }).join('\n');
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename; a.click();
}

// ── REVENUE CHART ──
function renderChart() {
  var chart = document.getElementById('rev-chart');
  if (!chart) return;
  var vals = [65, 80, 55, 90, 120, 100, 145];
  var max = Math.max.apply(null, vals);
  chart.innerHTML = vals.map(function(v) {
    return '<div class="chart-bar" style="height:' + Math.round((v/max)*100) + '%;"></div>';
  }).join('');
}

// ── MODAL ──
function openModal(id) { var el = document.getElementById(id); if(el) el.classList.add('open'); }
function closeModal(id) { var el = document.getElementById(id); if(el) el.classList.remove('open'); }
document.addEventListener('click', function(e) { if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });

// ── TOAST ──
function toast(icon, msg) {
  var c = document.getElementById('toast-container');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-msg">' + msg + '</span>';
  c.appendChild(t);
  setTimeout(function() { if(t.parentNode) t.parentNode.removeChild(t); }, 3500);
}

// ── UTILS ──
function togglePt(id, btn) {
  var i = document.getElementById(id);
  if (!i) return;
  i.type = i.type === 'password' ? 'text' : 'password';
  btn.textContent = i.type === 'password' ? '👁️' : '🙈';
}

// ── CLOCK ──
function updateClock() {
  var el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-GB');
}
setInterval(updateClock, 1000);
updateClock();

// ── DATE DEFAULTS ──
document.addEventListener('DOMContentLoaded', function() {
  var recDate = document.getElementById('rec-date');
  if (recDate) recDate.value = new Date().toISOString().split('T')[0];
  renderPromoHistory();
});

// ── ENTER TO LOGIN ──
document.addEventListener('DOMContentLoaded', function() {
  var pwInput = document.getElementById('adm-pw');
  if (pwInput) pwInput.addEventListener('keydown', function(e){ if(e.key==='Enter') adminLogin(); });
  var emInput = document.getElementById('adm-email');
  if (emInput) emInput.addEventListener('keydown', function(e){ if(e.key==='Enter') adminLogin(); });
});
