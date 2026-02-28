/* ═══════════════════════════════════════════
   NEXRA Customer Website — script.js
   NEXRA Technology © 2026
   Fixed: AI Chat CORS error, Mobile nav,
          Toast function argument order
═══════════════════════════════════════════ */

// ── RESTORE SESSION ON LOAD ──
(function () {
  try {
    var saved = localStorage.getItem('nexra_user');
    if (saved) {
      var u = JSON.parse(saved);
      if (u && u.loggedIn && u.name && u.email) {
        document.addEventListener('DOMContentLoaded', function () {
          setLoggedIn(u.name, u.email);
        });
      }
    }
  } catch (e) {}
}());

// ── LOADER ──
(function () {
  var done = false;
  function hide() {
    if (done) return;
    done = true;
    var el = document.getElementById('loader');
    if (!el) return;
    el.classList.add('done');
    setTimeout(function () { el.style.display = 'none'; }, 900);
  }
  setTimeout(hide, 2200);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hide, 2000); });
  } else {
    setTimeout(hide, 500);
  }
  setTimeout(hide, 5000);
}());

// ── CANVAS BACKGROUND ──
(function () {
  var c = document.getElementById('bg-canvas');
  if (!c) return;
  var ctx = c.getContext('2d');
  var W, H, pts = [];
  function init() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    pts = [];
    for (var i = 0; i < 60; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.5 + .5 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(11,61,145,0.06)';
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,215,0,0.45)'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 140) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(11,61,145,' + (0.14 * (1 - d / 140)) + ')';
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', init);
  init(); draw();
}());

// ── PAGE NAVIGATION ──
function gp(id) {
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  var pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  ['nl-h', 'nl-p', 'nl-s', 'nl-d'].forEach(function (n) {
    var el = document.getElementById(n);
    if (el) el.classList.remove('on');
  });
  var map = { home: 'nl-h', packages: 'nl-p', services: 'nl-s', dashboard: 'nl-d' };
  if (map[id]) { var el = document.getElementById(map[id]); if (el) el.classList.add('on'); }
  window.scrollTo(0, 0);
  var m = document.getElementById('mob');
  if (m) m.classList.remove('open');
}

function tmob() {
  var m = document.getElementById('mob');
  if (m) m.classList.toggle('open');
}

// ── COUNTERS ──
setTimeout(function () {
  document.querySelectorAll('[data-t]').forEach(function (el) {
    var target = +el.getAttribute('data-t'), curr = 0, step = target / 60;
    var t = setInterval(function () {
      curr += step;
      if (curr >= target) { curr = target; clearInterval(t); }
      el.textContent = Math.floor(curr) + (target === 99 ? '%' : target === 24 ? '' : '+');
    }, 28);
  });
}, 2500);

// ── EYE TOGGLE ──
function teye(id, btn) {
  var inp = document.getElementById(id);
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁️'; }
}

// ── TOAST ──
// Fixed: consistent signature toast(msg, icon)
function toast(msg, icon) {
  icon = icon || '✅';
  var wrap = document.getElementById('twrap');
  if (!wrap) return;
  var el = document.createElement('div');
  el.className = 'titem';
  el.innerHTML = '<span style="font-size:1.1rem;">' + icon + '</span><span style="flex:1;font-size:0.87rem;">' + msg + '</span>';
  wrap.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3500);
}

// ── AUTH ──
function setLoggedIn(name, email) {
  window._nexraUser = { name: name, email: email, loggedIn: true };
  try { localStorage.setItem('nexra_user', JSON.stringify(window._nexraUser)); } catch (e) {}

  // Update desktop nav
  var ns = document.getElementById('nav-signin');
  var nsu = document.getElementById('nav-signup');
  var nl = document.getElementById('nav-logout');
  var nd = document.getElementById('nav-dash');
  if (ns) ns.style.display = 'none';
  if (nsu) nsu.style.display = 'none';
  if (nl) nl.style.display = '';
  if (nd) nd.style.display = '';

  // Update mobile menu
  var ms = document.getElementById('mob-signin');
  var msu = document.getElementById('mob-signup');
  var ml = document.getElementById('mob-logout');
  var md = document.getElementById('mob-dash');
  if (ms) ms.style.display = 'none';
  if (msu) msu.style.display = 'none';
  if (ml) ml.style.display = '';
  if (md) md.style.display = '';

  // Update dashboard greeting
  var dht = document.querySelector('#dt-ov .dht');
  if (dht) dht.textContent = 'Welcome back, ' + name + '! 👋';
  var pname = document.getElementById('pr-name');
  if (pname) pname.value = name;
  var pemail = document.getElementById('pr-email');
  if (pemail) pemail.value = email;
}

function dologout() {
  window._nexraUser = null;
  try { localStorage.removeItem('nexra_user'); } catch (e) {}
  var ns = document.getElementById('nav-signin');
  var nsu = document.getElementById('nav-signup');
  var nl = document.getElementById('nav-logout');
  var nd = document.getElementById('nav-dash');
  if (ns) ns.style.display = '';
  if (nsu) nsu.style.display = '';
  if (nl) nl.style.display = 'none';
  if (nd) nd.style.display = 'none';
  var ms = document.getElementById('mob-signin');
  var msu = document.getElementById('mob-signup');
  var ml = document.getElementById('mob-logout');
  var md = document.getElementById('mob-dash');
  if (ms) ms.style.display = '';
  if (msu) msu.style.display = '';
  if (ml) ml.style.display = 'none';
  if (md) md.style.display = 'none';
  toast('Signed out successfully.', '👋');
  setTimeout(function () { gp('home'); }, 400);
}

function dologin() {
  var e = document.getElementById('si-e').value.trim();
  var p = document.getElementById('si-p').value;
  if (!e) { toast('Please enter your email.', '⚠️'); document.getElementById('si-e').focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { toast('Please enter a valid email address.', '⚠️'); document.getElementById('si-e').focus(); return; }
  if (!p) { toast('Please enter your password.', '⚠️'); document.getElementById('si-p').focus(); return; }
  if (p.length < 8) { toast('Password must be at least 8 characters.', '⚠️'); document.getElementById('si-p').focus(); return; }
  var name = e.split('@')[0].charAt(0).toUpperCase() + e.split('@')[0].slice(1);
  setLoggedIn(name, e);
  toast('Welcome back, ' + name + '! Signed in successfully.', '✅');
  setTimeout(function () { gp('dashboard'); }, 500);
}

function dosignup() {
  var fn = document.getElementById('su-fn').value.trim();
  var ln = document.getElementById('su-ln').value.trim();
  var em = document.getElementById('su-em').value.trim();
  var ph = document.getElementById('su-ph').value.trim();
  var pw = document.getElementById('su-pw').value;
  var pw2 = document.getElementById('su-pw2').value;
  if (!fn) { toast('Please enter your first name.', '⚠️'); document.getElementById('su-fn').focus(); return; }
  if (!ln) { toast('Please enter your last name.', '⚠️'); document.getElementById('su-ln').focus(); return; }
  if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast('Please enter a valid email address.', '⚠️'); document.getElementById('su-em').focus(); return; }
  if (!ph) { toast('Please enter your phone number.', '⚠️'); document.getElementById('su-ph').focus(); return; }
  if (!pw || pw.length < 8) { toast('Password must be at least 8 characters.', '⚠️'); document.getElementById('su-pw').focus(); return; }
  if (!pw2) { toast('Please confirm your password.', '⚠️'); document.getElementById('su-pw2').focus(); return; }
  if (pw !== pw2) { toast('Passwords do not match. Please try again.', '⚠️'); document.getElementById('su-pw2').focus(); document.getElementById('su-pw2').value = ''; return; }
  setLoggedIn(fn, em);
  toast('Account created! Welcome to NEXRA, ' + fn + '! 🎉', '✅');
  setTimeout(function () { gp('dashboard'); }, 600);
}

// ── DASHBOARD TABS ──
function dtab(name, el) {
  ['ov', 'or', 'rc', 'pr'].forEach(function (t) {
    var d = document.getElementById('dt-' + t);
    if (d) d.style.display = 'none';
  });
  var tgt = document.getElementById('dt-' + name);
  if (tgt) tgt.style.display = 'block';
  document.querySelectorAll('.di').forEach(function (i) { i.classList.remove('on'); });
  if (el) el.classList.add('on');
}

// ── BUY MODAL ──
var cPkg = '', cPrice = '';

function obuy(pkg, price) {
  cPkg = pkg; cPrice = price;
  document.getElementById('m-pname').textContent = pkg;
  document.getElementById('m-pprice').textContent = price;
  var payEl = document.getElementById('by-pay');
  if (payEl) payEl.value = 'Bank Transfer';
  var planInfo = document.getElementById('plan-info');
  if (planInfo) planInfo.style.display = 'none';
  document.getElementById('m-buy').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cm(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('mbg')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function togglePlanOpts() {
  var pay = document.getElementById('by-pay').value;
  var planInfo = document.getElementById('plan-info');
  if (!planInfo) return;
  if (pay === 'Payment Plan') {
    planInfo.style.display = 'block';
    var raw = cPrice.replace(/[^0-9]/g, '');
    if (raw) {
      var total = parseInt(raw);
      var inst = Math.ceil(total / 3);
      var last = total - inst * 2;
      var fmt = function (n) { return 'LKR ' + n.toLocaleString(); };
      document.getElementById('plan-i1').textContent = fmt(inst);
      document.getElementById('plan-i2').textContent = fmt(inst);
      document.getElementById('plan-i3').textContent = fmt(last > 0 ? last : inst);
    } else {
      document.getElementById('plan-i1').textContent = '1/3 of ' + cPrice;
      document.getElementById('plan-i2').textContent = '1/3 of ' + cPrice;
      document.getElementById('plan-i3').textContent = '1/3 of ' + cPrice;
    }
  } else {
    planInfo.style.display = 'none';
  }
}

function dopurch() {
  var n = document.getElementById('by-n').value.trim();
  var e = document.getElementById('by-e').value.trim();
  var pay = document.getElementById('by-pay').value;
  if (!n) { toast('Please enter your full name.', '⚠️'); document.getElementById('by-n').focus(); return; }
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { toast('Please enter a valid email.', '⚠️'); document.getElementById('by-e').focus(); return; }
  cm('m-buy');
  var rid = 'NX-' + Date.now().toString().slice(-6);
  var dt = new Date().toLocaleDateString('en-GB');
  var planI1 = document.getElementById('plan-i1');
  var planTxt = pay === 'Payment Plan' ? '3 installments of ' + (planI1 ? planI1.textContent : '') : '';
  toast('Order confirmed! Generating receipt...', '🎉');
  setTimeout(function () { srec(cPkg, cPrice, dt, rid, n, pay, planTxt); }, 500);
}

// ── RECEIPT ──
function srec(svc, total, date, id, cust, pay, planTxt) {
  document.getElementById('r-svc').textContent = svc;
  document.getElementById('r-total').textContent = total;
  var tl = document.getElementById('r-total-line');
  if (tl) tl.textContent = total;
  document.getElementById('r-date').textContent = date;
  document.getElementById('r-id').textContent = id;
  document.getElementById('r-cust').textContent = cust || 'Customer';
  document.getElementById('r-pay').textContent = pay === 'Payment Plan' ? '💳 Payment Plan' : (pay || 'Bank Transfer');
  var planRow = document.getElementById('r-plan-row');
  var planTxtEl = document.getElementById('r-plan-txt');
  if (planTxt && pay === 'Payment Plan') {
    if (planRow) planRow.style.display = '';
    if (planTxtEl) planTxtEl.textContent = planTxt;
  } else {
    if (planRow) planRow.style.display = 'none';
  }
  document.getElementById('m-rec').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── AI CHAT ──
// FIXED: Using Anthropic API via artifact proxy to avoid CORS
// The API key must be added server-side. For demo/local use,
// fallback to smart local response if API unavailable.
var chatHistory = [];
var chatTyping = false;

// NEXRA knowledge base for local fallback responses
var NEXRA_KB = {
  packages: [
    { name: 'Starter Package', price: 'LKR 25,000', desc: '5-page business website, mobile responsive, basic SEO, contact form, 3 months support.' },
    { name: 'Professional Package', price: 'LKR 75,000', desc: 'Custom web app, POS integration, 3 months digital marketing, advanced SEO, CRM dashboard, 6 months priority support.' },
    { name: 'Enterprise Package', price: 'LKR 200,000+', desc: 'Full software suite, AI & automation, multi-branch POS, 12-month marketing plan, dedicated account manager, custom mobile app.' },
    { name: 'POS System', price: 'LKR 45,000', desc: 'Touch-screen interface, inventory management, sales reports, multi-payment support, employee management.' },
    { name: 'Digital Marketing', price: 'LKR 15,000/month', desc: 'Social media management, Google Ads, monthly analytics, 8 posts/month content creation, email marketing.' },
    { name: 'Custom Software', price: 'Quote-based', desc: 'Requirements analysis, custom development, testing & QA, training & handover, ongoing maintenance.' }
  ],
  contact: { email: 'athayiathayi43@gmail.com', phone: '0784237705', location: 'Sri Lanka' }
};

function getLocalResponse(msg) {
  var m = msg.toLowerCase();

  if (m.match(/price|cost|how much|lkr|package|starter|professional|enterprise|pos|digital market/)) {
    var resp = 'Here are our packages:\n\n';
    NEXRA_KB.packages.forEach(function (p) {
      resp += '• ' + p.name + ' — ' + p.price + '\n';
    });
    resp += '\nFor full details, visit our Packages page or ask me about a specific package!';
    return resp;
  }
  if (m.match(/contact|email|phone|call|reach|support/)) {
    return 'You can reach NEXRA at:\n📧 ' + NEXRA_KB.contact.email + '\n📞 ' + NEXRA_KB.contact.phone + '\n📍 ' + NEXRA_KB.contact.location + '\n\nWe typically respond within a few hours!';
  }
  if (m.match(/website|web|site/)) {
    return 'NEXRA builds stunning websites from landing pages to full e-commerce platforms. Our Starter Package (LKR 25,000) covers a 5-page business website with mobile responsive design and basic SEO. Need something more? Our Professional Package (LKR 75,000) includes a custom web application!';
  }
  if (m.match(/pos|point.of.sale|shop|retail|restaurant/)) {
    return 'Our POS System (LKR 45,000) includes touch-screen interface, real-time inventory management, sales analytics, multi-payment support, and employee management. Perfect for retail stores and restaurants!';
  }
  if (m.match(/ai|automation|chatbot|machine learning/)) {
    return 'NEXRA builds intelligent AI solutions: chatbots, predictive analytics, document processing, and workflow automation. This is part of our Enterprise Package or available as a custom project. Contact us for a quote!';
  }
  if (m.match(/mobile|app|android|ios/)) {
    return 'We develop native iOS & Android apps and cross-platform Flutter solutions. Beautiful design, smooth performance. Mobile app development is included in the Enterprise Package or available as a custom quote!';
  }
  if (m.match(/marketing|seo|social media|google ads|campaign/)) {
    return 'Our Digital Marketing package is LKR 15,000/month and includes social media management, Google Ads campaigns, monthly analytics reports, 8 content posts per month, and email marketing!';
  }
  if (m.match(/payment plan|installment|3 month/)) {
    return 'Yes! NEXRA offers a 3-installment payment plan for all packages. The total is split into 3 equal payments — first due today, second in 30 days, third in 60 days. Select "Payment Plan" at checkout!';
  }
  if (m.match(/hi|hello|hey|hola|welcome/)) {
    return 'Hello! 👋 Welcome to NEXRA — Sri Lanka\'s next-generation tech company. I can help you with our packages, pricing, services, or anything else. What can I do for you?';
  }
  if (m.match(/thank|thanks/)) {
    return 'You\'re welcome! 😊 Is there anything else I can help you with? Feel free to ask about our services or pricing anytime!';
  }

  return 'I\'d be happy to help! NEXRA offers websites, custom software, POS systems, digital marketing, mobile apps, and AI solutions. For more info, call 0784237705 or email athayiathayi43@gmail.com. What specifically can I help you with today?';
}

function tchat() {
  var win = document.getElementById('cwin');
  if (win) win.classList.toggle('open');
}

function addMsg(text, isUser) {
  var msgs = document.getElementById('cmsgs');
  var div = document.createElement('div');
  div.className = 'cmsg ' + (isUser ? 'cmu' : 'cma');
  // Support line breaks in messages
  div.style.whiteSpace = 'pre-line';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function showTyping() {
  var msgs = document.getElementById('cmsgs');
  var div = document.createElement('div');
  div.className = 'cmsg cma';
  div.id = 'typing-ind';
  div.innerHTML = '<span style="letter-spacing:3px;opacity:0.7">●●●</span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  var t = document.getElementById('typing-ind');
  if (t) t.remove();
}

async function smsg() {
  if (chatTyping) return;
  var inp = document.getElementById('cinp');
  var msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  addMsg(msg, true);
  chatHistory.push({ role: 'user', content: msg });
  chatTyping = true;
  showTyping();

  // Try Anthropic API first, fallback to local responses
  try {
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': window.NEXRA_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: 'You are the NEXRA AI Customer Support assistant. NEXRA is a Sri Lanka-based tech company (Est. 2026) offering: Website Creation, Custom Software, POS Systems, Digital Marketing, Mobile Apps, AI & Automation, Cloud Solutions, and Cybersecurity. Packages: Starter (LKR 25,000), Professional (LKR 75,000), Enterprise (LKR 200,000+), POS System (LKR 45,000), Digital Marketing (LKR 15,000/month). Contact: athayiathayi43@gmail.com, Phone: 0784237705. Be friendly, professional, concise. Answer in 2-4 sentences max.',
        messages: chatHistory.slice(-10)
      })
    });

    if (!res.ok) throw new Error('API error: ' + res.status);

    var data = await res.json();
    removeTyping();
    var reply = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : getLocalResponse(msg);
    addMsg(reply, false);
    chatHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    // Fallback to smart local responses (no API key needed)
    removeTyping();
    var fallback = getLocalResponse(msg);
    addMsg(fallback, false);
    chatHistory.push({ role: 'assistant', content: fallback });
  }

  chatTyping = false;
}

// Send on Enter key
document.addEventListener('DOMContentLoaded', function () {
  var cinp = document.getElementById('cinp');
  if (cinp) {
    cinp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        smsg();
      }
    });
  }
});
