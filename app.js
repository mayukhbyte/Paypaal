(() => {
  "use strict";
  const D = window.MANDATE_DATA;
  const ROUTES = [
    "overview", "mandates", "approvals", "fairshare",
    "disputes", "procurement", "cfo", "inventory",
    "triage", "escrow", "privacy", "terms"
  ];
  const ROUTE_FOR_CONCEPT = {
    firewall: "mandates", disputes: "disputes", procurement: "procurement",
    cfo: "cfo", fairshare: "fairshare", inventory: "inventory",
    triage: "triage", escrow: "escrow"
  };

  const ICONS = {
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    cross: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/></svg>`,
    grid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    arrowUpRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
    doc: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    chat: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a3.5 3.5 0 0 0-5 0c0 2 5 2 5 4a3.5 3.5 0 0 1-5 0"/></svg>`,
    repeat: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    vault: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="8" x2="12" y2="10"/></svg>`,
    search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const initialState = () => ({
    route: "overview", agentOnline: true, mandates: [],
    vault: 0, defaultVault: 0,
    currentUser: null,
    approvals: [], activity: [],
    fairParticipants: clone(D.fairShare.participants || ["Alice", "Bob", "Charlie", "Dave"]),
    fairItems: clone(D.fairShare.items), fairContext: D.fairShare.context,
    fairReceiptName: "", activityFilter: "all", approvalFilter: "all", mandateFilter: "all",
    procurement: {
      invoiceRef: "INV-2026-904",
      poRef: "PO-2026-904",
      invoiceLine: "High-Speed Fiber Transceivers",
      poLine: "High-Speed Fiber Transceivers",
      invoiceQty: "12",
      poQty: "10",
      invoiceUnitPrice: "115.00",
      poUnitPrice: "100.00",
      invoiceTotal: "1380.00",
      poTotal: "1000.00",
      vendorName: "NexGen Optronics",
      checked: false,
      approved: false,
      lastScan: null,
      scans: []
    },
    cfo: {
      messages: [],
      invoices: [],
      reconcile: null,
      sourceCurrency: "EUR",
      targetCurrency: "USD",
      liveRate: 1.1203,
      liveRates: {},
      liveRateText: "Google Finance Parity: 1 EUR = 1.1203 USD",
    },
    inventory: {
      items: [],
      item: "",
      sku: "",
      stock: "",
      threshold: "",
      supplierA: "",
      priceA: "",
      daysA: "",
      supplierB: "",
      priceB: "",
      daysB: "",
      evaluated: false,
      approved: false
    },
    triage: { queue: [], billingTarget: "Patient", liveVitals: { hr: 72, bp: "120/80", spo2: 98, temp: 98.6 } },
    escrow: {
      contracts: [],
      milestone: "Milestone 1: Webhook cryptographic verification suite & test coverage",
      criteria: "Deliver verified RSA-SHA256 signature validator passing all PayPal sandbox webhook payloads.",
      evidence: "PR #84: commit e7b409a (https://github.com/mandate/core/pull/84)",
      stage: 1,
      verified: false,
      humanApproved: false
    }
  });

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(D.storageKey) || "null");
      if (!stored || typeof stored !== "object") return initialState();
      const cleanedMandates = (stored.mandates || []).filter((m) => !["mdt-7749", "mdt-9122", "mdt-4431"].includes(m.id));
      const cleanedApprovals = (stored.approvals || []).filter((a) => !["runpod-gpu", "figma-enterprise", "overseas-registrar"].includes(a.id));
      const cleanedActivity = (stored.activity || []).filter((act) => !["aws-scale", "design-assets", "gpu-cluster", "unverified-merchant"].includes(act.id));
      const participants = Array.isArray(stored.fairParticipants) && stored.fairParticipants.length >= 2 ? stored.fairParticipants : clone(D.fairShare.participants || ["Alice", "Bob", "Charlie", "Dave"]);
      const baseInv = initialState().inventory;
      const loadedInv = stored.inventory && Array.isArray(stored.inventory.items) && stored.inventory.items.length > 0
        ? { ...baseInv, ...stored.inventory }
        : baseInv;
      const cleanedState = { ...initialState(), ...stored, inventory: loadedInv, fairParticipants: participants, mandates: cleanedMandates, approvals: cleanedApprovals, activity: cleanedActivity };
      if (stored.currentUser && stored.currentUser.id === "usr-admin-01" && stored.currentUser.email === "admin@mandate.finance") {
        cleanedState.currentUser = null;
      }
      return cleanedState;
    } catch (_) { return initialState(); }
  }

  let state = loadState();
  const routeFromHash = window.location.hash.replace(/^#/, "");
  if (ROUTES.includes(routeFromHash)) state.route = routeFromHash;

  let toastTimer = 0;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
  const money = (value, digits = 2) => "$" + Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const wholeMoney = (value) => "$" + Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const pct = (value, max) => max > 0 ? Math.min(100, Math.max(0, (Number(value) / Number(max)) * 100)) : 0;
  const app = () => $("#app");

  function persist() {
    try { localStorage.setItem(D.storageKey, JSON.stringify(state)); } catch (_) {}
    syncChrome();
  }

  function toast(message) {
    const node = $("#toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("visible"), 2600);
  }

  function navigate(route) {
    if (!ROUTES.includes(route)) route = "overview";
    state.route = route;
    history.replaceState(null, "", "#" + route);
    const sidebar = $("#sidebar");
    if (sidebar) sidebar.classList.remove("open");
    const mobileBtn = $("#mobile-menu-button");
    if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
    const morePanel = $("#mobile-more-panel");
    if (morePanel) morePanel.hidden = true;
    const mobileMore = $("#mobile-more");
    if (mobileMore) mobileMore.setAttribute("aria-expanded", "false");
    render();
    if ((route === "overview" || route === "mandates") && window.MANDATE_API) {
      if (typeof window.MANDATE_API.getMandates === "function") {
        window.MANDATE_API.getMandates().then((m) => {
          if (Array.isArray(m) && m.length > 0) {
            state.mandates = m;
            syncChrome();
            render();
          }
        }).catch(() => {});
      }
      if (typeof window.MANDATE_API.getDashboard === "function") {
        window.MANDATE_API.getDashboard().then((d) => {
          if (d && d.settlementLatency) {
            state._dashLatency = d.settlementLatency;
            render();
          }
        }).catch(() => {});
      }
      if (typeof window.MANDATE_API.getAuditLog === "function") {
        window.MANDATE_API.getAuditLog().then((logs) => {
          if (Array.isArray(logs) && logs.length > 0) {
            state.activity = logs.map((entry) => ({
              id: entry.id,
              title: `${entry.details?.merchant || entry.action} - ${entry.decision}`,
              merchant: entry.details?.merchant || entry.action,
              amount: Number(entry.details?.amount) || 0,
              agent: entry.details?.mandateId || "Policy engine",
              status: entry.decision === "approved" ? "approved" : entry.decision === "blocked" ? "blocked" : "review",
              decision: entry.reason,
            }));
            render();
          }
        }).catch(() => {});
      }
    }
    if (route === "approvals" && window.MANDATE_API && window.MANDATE_API.getApprovals) {
      window.MANDATE_API.getApprovals().then((serverApprovals) => {
        if (Array.isArray(serverApprovals)) {
          state.approvals = serverApprovals;
          syncChrome();
          render();
        }
      }).catch(() => {});
    }
    if (route === "cfo" && window.MANDATE_API && window.MANDATE_API.getInvoices) {
      window.MANDATE_API.getInvoices().then((invoices) => {
        if (Array.isArray(invoices) && invoices.length > 0) {
          state.cfo = state.cfo || {};
          state.cfo.invoices = invoices;
          render();
        }
      }).catch(() => {});
    }
    if (route === "triage" && window.MANDATE_API && window.MANDATE_API.getTriageQueue) {
      window.MANDATE_API.getTriageQueue().then((data) => {
        if (data && Array.isArray(data.queue)) {
          state.triage = state.triage || {};
          state.triage.queue = data.queue;
          state.triage.stats = data.stats;
          render();
        }
      }).catch(() => {});
    }
    if (route === "inventory" && window.MANDATE_API && window.MANDATE_API.getInventory) {
      window.MANDATE_API.getInventory().then((inv) => {
        if (inv && Array.isArray(inv.items)) {
          state.inventory = state.inventory || {};
          state.inventory.items = inv.items;
          if (!state.inventory.sku && inv.items.length > 0) {
            const first = inv.items[0];
            state.inventory.sku = first.sku;
            state.inventory.item = first.item;
            state.inventory.stock = String(first.stock);
            state.inventory.threshold = String(first.threshold);
            state.inventory.supplierA = first.supplierA || "";
            state.inventory.priceA = String(first.priceA || "");
            state.inventory.daysA = String(first.daysA || "");
            state.inventory.supplierB = first.supplierB || "";
            state.inventory.priceB = String(first.priceB || "");
            state.inventory.daysB = String(first.daysB || "");
          }
          render();
        }
      }).catch(() => {});
    }
    if (route === "escrow" && window.MANDATE_API && window.MANDATE_API.getEscrow) {
      window.MANDATE_API.getEscrow().then((res) => {
        if (res && Array.isArray(res.contracts)) {
          state.escrow = state.escrow || {};
          state.escrow.contracts = res.contracts;
          render();
        }
      }).catch(() => {});
    }
    if (route === "cfo" && window.MANDATE_API && window.MANDATE_API.getRates) {
      window.MANDATE_API.getRates(state.cfo?.sourceCurrency || "USD").then((r) => {
        if (r && r.rates) {
          state.cfo = state.cfo || {};
          state.cfo.liveRates = r.rates;
          state.cfo.rateProvider = r.provider;
          state.cfo.ratesUpdated = r.lastUpdated;
          render();
        }
      }).catch(() => {});
    }
    if (route === "procurement" && window.MANDATE_API && window.MANDATE_API.getProcurementScans) {
      window.MANDATE_API.getProcurementScans().then((scans) => {
        if (Array.isArray(scans)) {
          state.procurement = state.procurement || {};
          state.procurement.scans = scans;
          render();
        }
      }).catch(() => {});
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function pageHeader(title, subtitle, eyebrow = "Agent finance control room", actions = "") {
    return `<div class="page-header"><div class="page-title-wrap"><div class="eyebrow"><span class="eyebrow-dot"></span>${esc(eyebrow)}</div><h1>${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</div>`;
  }

  function syncChrome() {
    const pending = (state.approvals || []).filter((item) => item.status === "pending").length;
    const mandateCount = (state.mandates || []).length;
    $$(".nav-link").forEach((node) => node.classList.toggle("active", node.dataset.route === state.route));
    $$(".mobile-nav [data-route]").forEach((node) => node.classList.toggle("active", node.dataset.route === state.route));
    const badge = $(".nav-count.attention");
    if (badge) {
      badge.textContent = String(pending);
      badge.style.display = pending > 0 ? "inline-block" : "none";
    }
    const mandateBadge = $('[data-route="mandates"] .nav-count');
    if (mandateBadge) {
      mandateBadge.textContent = String(mandateCount);
    }
    const headerVault = $("#header-vault-amount");
    if (headerVault) {
      const defaultV = state.defaultVault || 0;
      const totalSpent = (state.mandates || []).reduce((acc, m) => acc + (Number(m.spent) || 0), 0);
      const liveVault = (state.mandates && state.mandates.length > 0)
        ? (state.mandates || []).reduce((acc, m) => acc + Math.max(0, (Number(m.limit) || 0) - (Number(m.spent) || 0)), 0)
        : Math.max(0, defaultV - totalSpent);
      headerVault.textContent = wholeMoney(liveVault);
    }
    const avatarBtn = $("#topbar-avatar-btn");
    if (avatarBtn) {
      if (state.currentUser) {
        avatarBtn.textContent = state.currentUser.avatar || (state.currentUser.name ? state.currentUser.name.slice(0, 2).toUpperCase() : "AD");
        avatarBtn.title = `${state.currentUser.name || "User"} (${state.currentUser.email || ""}) · ${state.currentUser.authMethod || "Authenticated"}`;
      } else {
        avatarBtn.textContent = "IN";
        avatarBtn.title = "Sign In with OAuth / Email & Configure Vault Capital";
      }
    }
    const authLabel = $("#topbar-auth-label");
    if (authLabel) {
      if (state.currentUser) {
        authLabel.textContent = state.currentUser.name || (state.currentUser.email ? state.currentUser.email.split("@")[0] : "OAuth Active");
      } else {
        authLabel.textContent = "OAuth / Sign In";
      }
    }
  }

  function render() {
    const views = {
      overview: renderOverview, mandates: renderMandates, approvals: renderApprovals,
      fairshare: renderFairShare, disputes: renderDisputes, procurement: renderProcurement,
      cfo: renderCfo, inventory: renderInventory, triage: renderTriage, escrow: renderEscrow,
      privacy: renderPrivacy, terms: renderTerms
    };
    app().innerHTML = (views[state.route] || renderOverview)();
    if (state.route === "cfo") {
      const invoiceForm = state.cfo?.form || {};
      const fxForm = state.cfo?.reconcileInput || {};
      const cClient = $("#cfo-client"); if (cClient) cClient.value = invoiceForm.client || "";
      const cAmount = $("#cfo-amount"); if (cAmount) cAmount.value = invoiceForm.amount || "";
      const cCurr = $("#cfo-currency"); if (cCurr) cCurr.value = invoiceForm.currency || "USD";
      const rAmount = $("#reconcile-amount"); if (rAmount) rAmount.value = fxForm.amount || "";
      const rRate = $("#reconcile-rate"); if (rRate) rRate.value = fxForm.rate || "";
      const rFrom = $("#reconcile-from"); if (rFrom) rFrom.value = fxForm.from || "EUR";
      const rTo = $("#reconcile-to"); if (rTo) rTo.value = fxForm.to || "USD";
    }
    syncChrome();
  }

  function metric(label, value, note, iconHtml, color = "", track = null) {
    return `<article class="metric-card"><div class="metric-head"><span>${label}</span><span class="metric-icon ${color}">${iconHtml}</span></div><div><strong class="metric-value ${String(value).includes("$") ? "money" : ""}">${value}</strong><div class="metric-note">${note}</div>${track !== null ? `<div class="metric-track"><span style="width:${track}%"></span></div>` : ""}</div></article>`;
  }

  function activityRows(filter = "all") {
    const list = state.activity || [];
    const filtered = list.filter((item) => filter === "all" || item.status === filter);
    if (!filtered.length) {
      return `<div class="empty-state" style="padding:28px 16px; text-align:center"><span class="empty-symbol" style="display:inline-block; margin-bottom:8px">${ICONS.search}</span><strong>No payment activity recorded</strong><p style="font-size:12px; color:var(--muted); margin-top:4px">Real-time transactions evaluated via guardrails and settled via PayPal Sandbox will appear here.</p></div>`;
    }
    return filtered.map((item) => `
      <div class="activity-row"><span class="activity-icon ${item.status === "review" ? "review" : item.status === "blocked" ? "blocked" : ""}">${item.status === "approved" ? ICONS.check : item.status === "blocked" ? ICONS.cross : ICONS.alert}</span>
        <div class="activity-main"><strong>${esc(item.title)}</strong><small>${esc(item.merchant)} · ${esc(item.agent)}</small></div>
        <div class="activity-meta"><span class="activity-amount">${money(item.amount)}</span><span class="status-pill ${item.status}">${item.status === "review" ? "Escalated" : item.status}</span></div>
      </div>`).join("");
  }

  function moduleCards() {
    const icons = {
      firewall: [ICONS.shield, ""], disputes: [ICONS.arrowUpRight, "indigo"],
      procurement: [ICONS.doc, "green"], cfo: [ICONS.chat, "indigo"],
      fairshare: [ICONS.repeat, "green"], inventory: [ICONS.grid, "amber"],
      triage: [ICONS.plus, "red"], escrow: [ICONS.shield, "indigo"]
    };
    return D.concepts.map((item) => {
      const [symbolHtml, color] = icons[item.id] || [ICONS.doc, ""];
      const route = ROUTE_FOR_CONCEPT[item.id] || item.id;
      return `<button class="module-card" data-route="${route}" type="button"><span class="module-icon ${color}">${symbolHtml}</span><strong>${esc(item.label)}</strong><p>${esc(item.description)}</p><span class="module-group">${esc(item.group)}</span></button>`;
    }).join("");
  }

  function renderOverview() {
    const defaultV = state.defaultVault || 50000;
    const budgetPool = state.mandates.length > 0
      ? state.mandates.reduce((sum, m) => sum + (Number(m.limit) || 0), 0)
      : defaultV;
    const committed = state.mandates.reduce((sum, m) => sum + (Number(m.spent) || 0), 0);
    const budgetLeft = Math.max(0, budgetPool - committed);
    const committedPct = budgetPool > 0 ? pct(committed, budgetPool).toFixed(1) : "0.0";
    const pending = state.approvals.filter((item) => item.status === "pending").length;
    const activity = state.activity || [];
    const railsToday = activity.filter((a) => a.status === "approved").length;
    const paymentsToday = activity.filter((a) => a.status === "approved").reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    const blockedCount = activity.filter((a) => a.status === "blocked").length;
    const protectedTotal = activity.filter((a) => a.status === "blocked").reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    const autoApprovedPayments = activity.filter((a) => a.decision && a.decision.includes("Auto")).length;
    const autoApprovalRate = (railsToday + blockedCount) > 0 ? Math.round((railsToday / (railsToday + blockedCount)) * 100) : 100;
    const latency = state._dashLatency || (activity.length > 0 ? "0.18s" : "0.00s");

    return `${pageHeader("Command center", "Real-time visibility into agent spend authorities, policy violations, and pending approvals.", "Autonomous finance policy controls")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.check}</span><div class="trust-copy"><strong>Autonomous guardrails active</strong><span>Each proposed payment is verified against its mandate before PayPal sandbox settlement.</span></div><span class="status-pill approved">Policy layer active</span></div>
      <section class="hero-panel"><div class="hero-copy"><div class="eyebrow">Deterministic policy boundaries</div><h2>Every autonomous transaction stays within policy.</h2><p>Define spend boundaries, review real-time budget utilization, and require human sign-off for exceptions before funds move on the PayPal rail.</p><div class="page-actions"><button class="btn btn-primary" data-route="${pending > 0 ? 'approvals' : 'mandates'}" type="button">${pending > 0 ? `Review ${pending} pending approvals →` : 'Create first mandate'}</button><button class="btn btn-secondary" data-action="open-mandate" type="button">Create mandate</button></div></div><div class="hero-visual"><div class="hero-visual-top"><span>Daily vault limit velocity</span><strong>PayPal settlement rail: sandbox</strong></div><div class="hero-visual-bottom"><div><strong>${money(committed)}</strong><span> committed of ${wholeMoney(budgetPool)} pool</span></div><span class="status-pill ${committedPct > 90 ? 'blocked' : 'approved'}">${budgetPool > 0 ? 'Within policy' : 'No active pool'}</span></div><div class="flow-track"><span style="width:${committedPct}%"></span></div><div class="hero-visual-top"><span>Request - Policy check - Human review - Rail execution</span><span>${latency}</span></div></div></section>
      <section class="metric-grid" aria-label="Command-center metrics">
        ${metric("Budget left", wholeMoney(budgetLeft), `of ${wholeMoney(budgetPool)} pool · ${committedPct}% committed`, ICONS.vault, "", committedPct)}
        ${metric("Today's rails", String(railsToday), `<strong>+${railsToday}</strong> · ${money(paymentsToday)} via PayPal`, ICONS.arrowUpRight, "green")}
        ${metric("Guardrails", String(blockedCount), `<strong>${wholeMoney(protectedTotal)}</strong> protected by policy`, ICONS.shield, "red")}
        ${metric("Pending review", String(pending), pending > 0 ? "Human sign-off required" : "Queue all clear", ICONS.alert, pending > 0 ? "amber" : "")}
      </section>
      <div class="overview-grid">
        <section class="card overview-pipeline"><div class="card-heading"><div><span class="card-kicker">Policy telemetry</span><h2 style="margin-top:5px">Settlement pipeline</h2><p>Live telemetry reflecting configured mandates and payments.</p></div><span class="status-pill approved">Active</span></div><div class="policy-list"><div class="policy-row"><span class="policy-icon">${ICONS.arrowUpRight}</span><div><strong>Auto-approved</strong><small>Payments passed under policy caps</small></div><span class="policy-value">${autoApprovedPayments}</span></div><div class="policy-row"><span class="policy-icon">${ICONS.clock}</span><div><strong>Median decision latency</strong><small>Policy execution time</small></div><span class="policy-value">${latency}</span></div><div class="policy-row"><span class="policy-icon">${ICONS.shield}</span><div><strong>Policy-protected</strong><small>Blocked transactions protected</small></div><span class="policy-value">${wholeMoney(protectedTotal)}</span></div></div><div class="ring-row"><span class="ring" aria-label="${autoApprovalRate} percent"></span><div class="ring-copy"><strong>${autoApprovalRate}% auto-settlement rate</strong><span>Real-time calculation from transactions</span></div></div></section>
        <section class="overview-workflows"><div class="section-row"><div><h2>Agent workflows</h2><p>Explore guarded financial flows.</p></div><span class="sandbox-tag">8 workflows active</span></div><div class="module-grid">${moduleCards()}</div></section>
        <section class="card overview-activity"><div class="card-heading"><div><span class="card-kicker">Decision ledger</span><h2 style="margin-top:5px">Recent payment activity</h2><p>Live transaction ledger for autonomous agents.</p></div><div class="segmented" role="group" aria-label="Filter activity"><button data-activity-filter="all" class="${state.activityFilter === "all" ? "active" : ""}" type="button">All</button><button data-activity-filter="approved" class="${state.activityFilter === "approved" ? "active" : ""}" type="button">Allowed</button><button data-activity-filter="review" class="${state.activityFilter === "review" ? "active" : ""}" type="button">Review</button><button data-activity-filter="blocked" class="${state.activityFilter === "blocked" ? "active" : ""}" type="button">Blocked</button></div></div><div class="activity-list">${activityRows(state.activityFilter)}</div></section>
        <aside class="card overview-authority"><div class="card-heading"><div><span class="card-kicker">Authority boundary</span><h2 style="margin-top:5px">Policy before payment</h2><p>Mandates define what the agent may execute.</p></div><span class="metric-icon">${ICONS.shield}</span></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Scoped mandate</strong><small>Budget, merchant allowlist, per-transaction ceiling, expiry.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Approve | Block | Escalate</strong><small>Policy evaluates each payment before execution is permitted.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>PayPal rail</strong><small>Orders and captures dispatched via PayPal Sandbox SDK.</small></div></div></aside>
      </div>`;
  }

  function renderMandates() {
    const actions = `<div style="display:flex; gap:8px"><button class="btn btn-secondary" data-action="open-mandate" type="button">+ Custom Mandate</button><button class="btn btn-primary" data-action="open-mandate" type="button">+ New Mandate</button></div>`;
    const filter = state.mandateFilter || "all";
    const totalCount = state.mandates.length;
    const highCount = state.mandates.filter((item) => pct(item.spent, item.limit) >= 80).length;
    const autoCount = state.mandates.filter((item) => item.humanApprovalAbove == null).length;
    const list = state.mandates.filter((item) => filter === "all" || (filter === "high" && pct(item.spent, item.limit) >= 80) || (filter === "auto" && item.humanApprovalAbove == null));
    const cards = list.map((item) => {
      const usage = pct(item.spent, item.limit);
      const threshold = item.humanApprovalAbove == null ? "All within cap" : `Above ${money(item.humanApprovalAbove)}`;
      const hasHumanThreshold = item.humanApprovalAbove != null;
      const isGlowing = Boolean(item._highlight);
      return `<article class="card mandate-card ${isGlowing ? 'highlight-glow' : ''}"><div class="mandate-title"><span class="mandate-symbol">${ICONS.shield}</span><div><h2>${esc(item.name)}</h2><p>ID: ${esc(item.id)} · ${esc(item.description || "Scoped spend mandate")}</p></div><span class="status-pill ${item.status === "active" ? "approved" : "blocked"}">${esc(item.status)}</span></div><div class="utilization-block"><div class="utilization-top"><div><small>Monthly spend cap</small><div><strong>${wholeMoney(item.spent)} <span>/ ${wholeMoney(item.limit)}</span></strong></div></div><span class="tag">${usage.toFixed(0)}%</span></div><div class="utilization-track ${usage >= 80 ? "warning" : ""}"><span style="width:${usage}%"></span></div><div class="utilization-foot"><span>${wholeMoney(Math.max(0, item.limit - item.spent))} runway left</span><span>${esc(item.reset || "Monthly cycle")}</span></div></div><div class="mandate-specs"><div class="spec-box"><small>Per-transaction cap</small><strong>${money(item.perTransaction)}</strong></div><div class="spec-box"><small>Human approval</small><strong>${esc(threshold)}</strong></div></div><div><span class="card-kicker">Authorized merchants</span><div class="merchant-list" style="margin-top:7px">${(item.merchants || []).map((merchant) => `<span class="merchant-chip">${esc(merchant)}</span>`).join("")}</div>${item.categories?.length ? `<span class="card-kicker" style="display:block;margin-top:10px">Authorized categories</span><div class="merchant-list" style="margin-top:7px">${item.categories.map((category) => `<span class="merchant-chip">${esc(category)}</span>`).join("")}</div>` : ""}</div><div class="mandate-bottom"><div><small>${hasHumanThreshold ? "Escalates above the human-review threshold" : "Auto-approves within the scoped caps"}</small><small>${item.expiry ? `Expires ${esc(item.expiry)}` : "No expiry set"}</small>${item.fundingSource ? `<small>Funding: ${esc(item.fundingSource)}</small>` : ""}</div><div style="display:flex; gap:8px"><button class="btn btn-secondary btn-sm" data-action="simulate-mandate-payment" data-id="${esc(item.id)}" type="button" title="Test agent spending against this mandate">Test payment</button><button class="link-button" data-action="toggle-mandate" data-id="${esc(item.id)}" type="button">${item.status === "active" ? "Pause" : "Resume"}</button></div></div></article>`;
    }).join("");

    const templatesPanel = `
      <section class="mandate-templates-panel">
        <div class="mandate-templates-header">
          <div class="mandate-templates-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Real-time Quick Launch Templates</span>
            <small style="color:var(--muted); font-size:11px; margin-left:4px">Deploy pre-verified guardrails directly to backend in 1 click</small>
          </div>
          <button class="link-button" data-action="open-mandate" type="button" style="font-size:11px">+ Build custom mandate</button>
        </div>
        <div class="template-cards-grid">
          <article class="template-card">
            <div class="template-card-top">
              <span class="template-card-icon">☁️</span>
              <span class="tag">Infrastructure</span>
            </div>
            <strong>Cloud & GPUs</strong>
            <small>AWS, RunPod, Lambda, GCP</small>
            <div class="template-card-specs">
              <div><span>Cap:</span> <strong>$5,000</strong></div>
              <button class="btn-template-add" data-action="quick-create-mandate" data-template="cloud" type="button">⚡ 1-Click Launch</button>
            </div>
          </article>
          <article class="template-card">
            <div class="template-card-top">
              <span class="template-card-icon">🤖</span>
              <span class="tag">AI Workloads</span>
            </div>
            <strong>AI & Model APIs</strong>
            <small>OpenAI, Anthropic, Together</small>
            <div class="template-card-specs">
              <div><span>Cap:</span> <strong>$3,000</strong></div>
              <button class="btn-template-add" data-action="quick-create-mandate" data-template="ai" type="button">⚡ 1-Click Launch</button>
            </div>
          </article>
          <article class="template-card">
            <div class="template-card-top">
              <span class="template-card-icon">💻</span>
              <span class="tag">Engineering</span>
            </div>
            <strong>DevOps & SaaS</strong>
            <small>GitHub, Vercel, Linear, Sentry</small>
            <div class="template-card-specs">
              <div><span>Cap:</span> <strong>$1,500</strong></div>
              <button class="btn-template-add" data-action="quick-create-mandate" data-template="devops" type="button">⚡ 1-Click Launch</button>
            </div>
          </article>
          <article class="template-card">
            <div class="template-card-top">
              <span class="template-card-icon">📣</span>
              <span class="tag">Marketing</span>
            </div>
            <strong>Growth & Ad Spend</strong>
            <small>Google Ads, Meta, LinkedIn</small>
            <div class="template-card-specs">
              <div><span>Cap:</span> <strong>$4,000</strong></div>
              <button class="btn-template-add" data-action="quick-create-mandate" data-template="growth" type="button">⚡ 1-Click Launch</button>
            </div>
          </article>
        </div>
      </section>
    `;

    return `${pageHeader("Agent spend firewall", "Configure bounded mandates with per-transaction caps, merchant allowlists, and review thresholds verified before PayPal settlement.", "Guardrails and scoped authority", actions)}
      <div class="trust-banner"><span class="trust-icon">${ICONS.check}</span><div class="trust-copy"><strong>${totalCount} active agent mandate${totalCount === 1 ? "" : "s"} configured</strong><span>${totalCount > 0 ? "Every agent spend proposal is checked against its mandate before PayPal settlement." : "No mandates configured yet. Create a mandate to establish scoped authority for an agent."}</span></div><span class="status-pill approved">Policy active</span></div>
      ${templatesPanel}
      <div class="filter-row" role="group" aria-label="Filter mandates"><button class="filter-chip ${filter === "all" ? "active" : ""}" data-mandate-filter="all" type="button">All active (${totalCount})</button><button class="filter-chip ${filter === "high" ? "active" : ""}" data-mandate-filter="high" type="button">High utilization (${highCount})</button><button class="filter-chip ${filter === "auto" ? "active" : ""}" data-mandate-filter="auto" type="button">Auto-approving (${autoCount})</button></div>
      <div class="mandate-grid">${cards || `<div class="card empty-state" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center;"><span class="empty-symbol" style="display:inline-block; margin-bottom:12px; color:var(--blue)">${ICONS.shield}</span><h3 style="font-size:19px; margin-bottom:8px">No spend mandates created yet</h3><p style="color:var(--muted); max-width:500px; margin:0 auto 22px; font-size:13px; line-height:1.6">Establish boundaries before deploying autonomous agents. Define budget caps, authorized merchants, and approval thresholds, or use the quick templates above.</p><button class="btn btn-primary" data-action="open-mandate" type="button" style="padding:0 20px; font-size:13px">+ Create custom mandate</button></div>`}</div>
      <section class="card" style="margin-top:15px"><div class="card-heading"><div><span class="card-kicker">Policy Evaluation Engine</span><h2 style="margin-top:5px">Deterministic verification path</h2><p>Merchant scope, budget headroom, transaction cap, and expiry are evaluated simultaneously.</p></div><span class="sandbox-tag">PayPal Sandbox Integrated</span></div><div class="evidence-grid"><div class="evidence-tile"><strong>Within mandate</strong><small>Eligible for auto-approval only when merchant, cap, budget, and expiry all validate.</small></div><div class="evidence-tile"><strong>Outside boundary</strong><small>Blocked for hard policy violations or escalated when exceeding human review threshold.</small></div></div></section>`;
  }

  function renderApprovals() {
    const filter = state.approvalFilter || "all";
    const all = state.approvals;
    const filtered = all.filter((item) => filter === "all" || (filter === "high-risk" && item.category === "high-risk") || (filter === "cap-exceeded" && item.category === "cap-exceeded"));
    const pending = all.filter((item) => item.status === "pending").length;
    const highRiskCount = all.filter((item) => item.category === "high-risk").length;
    const capExceededCount = all.filter((item) => item.category === "cap-exceeded").length;
    const cards = filtered.map((item) => {
      const done = item.status !== "pending";
      return `<article class="approval-card" data-approval-id="${esc(item.id)}"><div class="approval-main"><div class="approval-title"><div class="approval-merchant"><span class="activity-icon ${item.risk >= 80 ? "blocked" : "review"}">${item.risk >= 80 ? ICONS.alert : ICONS.arrowUpRight}</span><div><strong>${esc(item.merchant)}</strong><small>${esc(item.agent)}</small></div></div><div class="approval-amount"><strong>${money(item.amount)}</strong><small>USD</small></div></div><div class="approval-signals"><span class="status-pill ${item.risk >= 80 ? "blocked" : "review"}">Risk ${item.risk}/100</span><span class="tag">${esc(item.signal)}</span><span class="tag">${esc(item.breach)}</span></div><div class="approval-detail"><div class="approval-detail-top"><span>Policy violation detail</span><span>${done ? `<span class="status-pill ${item.status === "approved" ? "approved" : "blocked"}">${item.status === "approved" ? "Approved" : "Denied"}</span>` : "Human decision required"}</span></div><p>${esc(item.detail)}</p><div class="approval-foot"><span>${esc(item.funding)}${item.available ? ` · Available: ${money(item.available)}` : ""}</span><span>${item.evidence ? esc(item.evidence) : item.netSavings ? `Net savings ${esc(item.netSavings)}` : "Policy check"}</span></div></div></div><div class="approval-actions">${done ? `<span class="status-pill ${item.status === "approved" ? "approved" : "blocked"}">${item.status === "approved" ? "Approved" : "Denied"}</span><button class="btn btn-secondary btn-sm" data-action="undo-approval" data-id="${esc(item.id)}" type="button">Undo decision</button>` : `<button class="btn btn-secondary btn-sm" data-action="simulate-deny" data-id="${esc(item.id)}" type="button">Deny</button><button class="btn btn-primary btn-sm" data-action="simulate-approve" data-id="${esc(item.id)}" type="button">Approve</button><button class="btn-paypal" data-action="pay-with-paypal" data-id="${esc(item.id)}" type="button" title="Execute PayPal Sandbox Payment"><span class="pp-badge">Pay</span> with PayPal</button>`}</div></article>`;
    }).join("");
    return `${pageHeader("Approvals queue", `${pending} escalated transaction${pending === 1 ? "" : "s"} requiring human authorization before settlement.`, "Human-in-the-loop policy review")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.alert}</span><div class="trust-copy"><strong>Inspect exceptions. Keep transactions moving.</strong><span>Approving executes settlement securely through the PayPal sandbox environment.</span></div><span class="sandbox-tag">PayPal Sandbox</span></div>
      <div class="filter-row" role="group" aria-label="Filter approvals"><button class="filter-chip ${filter === "all" ? "active" : ""}" data-approval-filter="all" type="button">All (${all.length})</button><button class="filter-chip ${filter === "high-risk" ? "active" : ""}" data-approval-filter="high-risk" type="button">High risk (${highRiskCount})</button><button class="filter-chip ${filter === "cap-exceeded" ? "active" : ""}" data-approval-filter="cap-exceeded" type="button">Cap exceeded (${capExceededCount})</button></div>
      <section class="card"><div class="card-heading"><div><span class="card-kicker">Policy escalation queue</span><h2 style="margin-top:5px">${pending} awaiting human review</h2><p>Payments exceeding agent thresholds are held until confirmed or denied.</p></div><span class="status-pill ${pending > 0 ? 'review' : 'approved'}">${pending > 0 ? 'Execution held' : 'Queue clear'}</span></div><div>${cards || `<div class="empty-state" style="padding:48px 24px; text-align:center"><span class="empty-symbol" style="display:inline-block; margin-bottom:12px; color:var(--green)">${ICONS.check}</span><h3 style="font-size:18px; margin-bottom:8px">Approvals queue is clear</h3><p style="color:var(--muted); max-width:440px; margin:0 auto; font-size:13px; line-height:1.6">No payments currently awaiting human policy review. Transactions exceeding review thresholds will appear here in real time.</p></div>`}</div></section>`;
  }

  function fairTotals() {
    const participants = state.fairParticipants || D.fairShare.participants;
    const rows = participants.map((name) => ({ name, share: 0, paid: 0, net: 0 }));
    let total = 0;
    let unallocated = 0;
    state.fairItems.forEach((item) => {
      const cents = Math.max(0, Math.round((Number.parseFloat(item.amount) || 0) * 100));
      if (!cents) return;
      total += cents;
      const included = participants.filter((name) => (item.included || []).includes(name));
      if (!included.length) { unallocated += cents; return; }
      const base = Math.floor(cents / included.length);
      const remainder = cents % included.length;
      included.forEach((name, index) => {
        const row = rows.find((entry) => entry.name === name);
        if (row) row.share += base + (index < remainder ? 1 : 0);
      });
      const payer = rows.find((entry) => entry.name === item.paidBy);
      if (payer) payer.paid += cents;
    });
    rows.forEach((row) => { row.net = row.share - row.paid; });
    return { rows, total, unallocated };
  }

  function fairSummaryHtml() {
    const { rows, total, unallocated } = fairTotals();
    if (!total) return `<div class="empty-state"><span class="empty-symbol">${ICONS.repeat}</span><strong>Enter line item amounts to calculate</strong><p>Participation is set per line, updating splits on every keystroke.</p></div>`;
    const owes = rows.filter((row) => row.net > 0);
    const allocationWarning = unallocated ? `<div class="trust-banner" style="margin-bottom:10px" role="alert"><span class="trust-icon">${ICONS.alert}</span><div class="trust-copy"><strong>${money(unallocated / 100)} unallocated</strong><span>Assign at least one person to every priced line before dispatching requests.</span></div></div>` : "";
    return `${allocationWarning}<div class="share-result">${rows.map((row) => `<div class="share-person"><span><strong>${esc(row.name)}</strong><small>Fair share ${money(row.share / 100)} · paid ${money(row.paid / 100)}</small></span><strong>${row.net > 0 ? `Owes ${money(row.net / 100)}` : row.net < 0 ? `Receives ${money(Math.abs(row.net) / 100)}` : unallocated ? "Pending allocation" : "Settled"}</strong></div>`).join("")}<div class="preview-token"><span>Group total: ${money(total / 100)}</span><span>Exact cent balance</span></div>${owes.map((row) => `<div class="preview-token"><span>PayPal payment link: ${esc(row.name)} · ${money(row.net / 100)}</span><button class="link-button" data-action="copy-fair-preview" data-person="${esc(row.name)}" data-amount="${row.net}" type="button">Copy link</button></div>`).join("")}</div>`;
  }

  function renderFairShare() {
    const participants = state.fairParticipants || D.fairShare.participants;
    const friendTags = participants.map((name) => `
      <span class="friend-tag">
        <span class="friend-avatar">${esc(name.charAt(0).toUpperCase())}</span>
        <span>${esc(name)}</span>
        ${participants.length > 2 ? `<button class="friend-remove-btn" data-action="remove-fair-friend" data-name="${esc(name)}" type="button" title="Remove ${esc(name)}">×</button>` : ""}
      </span>`).join("");

    const items = state.fairItems.map((item, index) => `
      <div class="split-item">
        <div>
          <label class="field-label" for="fair-name-${index}">Line item</label>
          <input id="fair-name-${index}" type="text" value="${esc(item.name)}" data-fair-name="${index}" aria-label="Line item name">
        </div>
        <div>
          <label class="field-label" for="fair-amount-${index}">Amount · USD</label>
          <input id="fair-amount-${index}" type="number" min="0" step="0.01" placeholder="0.00" value="${esc(item.amount)}" data-fair-amount="${index}" aria-label="${esc(item.name)} amount">
        </div>
        <div class="participants-cell">
          <span class="field-label">Split this item with</span>
          <div class="participant-picks">
            ${participants.map((person) => `<label class="person-chip"><input type="checkbox" data-fair-person="${esc(person)}" data-fair-index="${index}" ${(item.included || []).includes(person) ? "checked" : ""}>${esc(person)}</label>`).join("")}
          </div>
        </div>
        <div>
          <label class="field-label" for="fair-payer-${index}">Already paid by</label>
          <select id="fair-payer-${index}" data-fair-payer="${index}">
            <option value="">Not paid yet</option>
            ${participants.map((person) => `<option value="${esc(person)}" ${item.paidBy === person ? "selected" : ""}>${esc(person)}</option>`).join("")}
          </select>
        </div>
        <div class="split-item-actions">
          <button class="split-item-delete" data-action="delete-fair-item" data-index="${index}" type="button" title="Delete this line">×</button>
        </div>
      </div>`).join("");

    return `${pageHeader("FairShare", "Itemized group expense calculation with automatic proportional splits and direct PayPal payment link generation.", "Group expense settlements", `<button class="btn btn-secondary" data-action="fair-add-item" type="button">Add item</button>`)}
      <div class="trust-banner"><span class="trust-icon">${ICONS.repeat}</span><div class="trust-copy"><strong>Itemized calculation : real-time allocation : PayPal payment dispatch</strong><span>Balances recompute live on every keystroke.</span></div><span class="sandbox-tag">FairShare Sandbox</span></div>
      
      <div class="card" style="margin-bottom:15px">
        <div class="card-heading">
          <div>
            <span class="card-kicker">Group participants (${participants.length} members)</span>
            <h2 style="margin-top:5px">Roster configuration</h2>
            <p>Add friends, team members, or project contributors. Splits scale automatically.</p>
          </div>
          <span class="tag">${participants.length} Active Members</span>
        </div>
        <div class="friends-bar">
          <div class="friends-list">
            ${friendTags}
          </div>
          <form class="add-friend-form" id="add-friend-form" onsubmit="return false;">
            <input type="text" id="new-friend-input" placeholder="Participant name..." maxlength="30" aria-label="Add friend name">
            <button class="btn btn-primary btn-sm" data-action="add-fair-friend" type="button">Add member</button>
          </form>
        </div>
      </div>

      <div class="split-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">1 · Receipt upload</span><h2 style="margin-top:5px">Document reference</h2><p>Attach an itemized receipt image or PDF for reference.</p></div><span class="tag">Document intake</span></div><label class="file-drop"><span class="module-icon green">${ICONS.doc}</span><strong>${state.fairReceiptName ? esc(state.fairReceiptName) : "Choose a receipt or itemized invoice"}</strong><small>Image or PDF document</small><input type="file" accept="image/*,.pdf" id="fair-receipt"></label></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">2 · Itemize and allocate</span><h2 style="margin-top:5px">Line item distribution</h2><p>Enter amounts, select participants per line, and track who covered the expense.</p></div><span class="tag">${state.fairItems.length} items</span></div><div class="split-items">${items || `<div class="empty-state"><span class="empty-symbol">${ICONS.doc}</span><strong>No items recorded</strong><p>Click "Add item" to record lines from your bill.</p></div>`}</div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn btn-secondary btn-sm" data-action="fair-add-item" type="button">Add line</button></div></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">3 · Structured context note</span><h2 style="margin-top:5px">Contextual allocation notes</h2><p>Document specific exclusions or arrangements. Click "Apply note" to auto-align lines.</p></div><button class="btn btn-secondary btn-sm" data-action="apply-fair-note" type="button" title="Auto-adjust line items from note">Apply note</button></div><div class="form-field"><label for="fair-context">Expense notes</label><textarea id="fair-context" data-fair-context>${esc(state.fairContext)}</textarea><span class="form-hint">Example: Alice did not drink alcohol, Bob left early, Charlie covered the car rental deposit.</span></div></section>
      </div><aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Real-time split</span><h2 style="margin-top:5px">Individual balances</h2><p>Exact cent calculation updating with every character typed.</p></div></div><div id="fair-summary">${fairSummaryHtml()}</div></section><section class="card"><div class="card-heading"><div><span class="card-kicker">PayPal settlement</span><h2 style="margin-top:5px">Dispatch requests</h2><p>Generate payment requests for members with outstanding balances.</p></div><span class="status-pill review">Ready to dispatch</span></div><div class="demo-note"><span>${ICONS.info}</span><div><strong>PayPal Sandbox Integration</strong>Dispatch payment request links directly to owing participants.</div></div><button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="prepare-fair-requests" type="button">Prepare request links</button></section></aside></div>`;
  }

      function computeDisputeOutlook(dispute) {
    const d = dispute || {};
    const ref = String(d.transactionRef || "").trim();
    const ship = String(d.shippingEvidence || "").trim();
    const draft = String(d.draft || "").trim();
    const claimAmt = Number(d.amount || d.transactionAmount || 1850.00);

    let score = 20; // baseline awaiting carrier documentation
    if (ref.length >= 3) score += 20;
    if (ship.length >= 10) score += 25;
    if (/(fedex|ups|usps|dhl|ontrac|royal\s*mail|trk|tracking|signature|carrier)/i.test(ship)) score += 15;
    if (/(delivered|signed|electronic\s*proof|gps|photo|pod)/i.test(ship)) score += 10;
    if (draft.length >= 50) score += 10;
    if (d.submitted) score += 10;

    const winRate = Math.min(98, Math.max(15, score));
    const expectedRecovery = Number(((claimAmt * winRate) / 100).toFixed(2));
    const tier = winRate >= 80 ? "Strong Protection (Tier 1)" : winRate >= 50 ? "Moderate Documentation" : "Incomplete Evidence";
    const statusClass = winRate >= 80 ? "approved" : winRate >= 50 ? "review" : "blocked";

    return {
      winRate,
      claimAmt,
      expectedRecovery,
      tier,
      statusClass,
      hasRef: ref.length >= 3,
      hasShip: ship.length >= 10,
      hasDraft: draft.length >= 50,
      submitted: Boolean(d.submitted)
    };
  }

  function renderDisputes() {
    const c = state.dispute || (state.dispute = { transactionRef: "", shippingEvidence: "", draft: "", submitted: false, submissionId: "", submittedAt: "" });
    const hasRef = Boolean(c.transactionRef && c.transactionRef.trim());
    const hasEvidence = Boolean(c.shippingEvidence && c.shippingEvidence.trim());
    const hasDraft = Boolean(c.draft && c.draft.trim().length > 10);
    const step1Done = hasRef || hasEvidence;
    const step2Done = hasDraft;
    const step3Done = Boolean(c.submitted);
    const outlook = computeDisputeOutlook(c);

    return `${pageHeader("Dispute operations", "Compile transaction history and fulfillment evidence for automated rebuttal generation and PayPal dispute resolution.", "Merchant protection and evidence management")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.arrowUpRight}</span>
        <div class="trust-copy">
          <strong>Active Dispute Case &middot; <span id="dispute-trust-winrate">${outlook.winRate}%</span> Real-Time Estimated Win Rate</strong>
          <span id="dispute-trust-recovery">Predictive recovery: $${outlook.expectedRecovery.toLocaleString("en-US", {minimumFractionDigits: 2})} USD (${outlook.winRate}% of $${outlook.claimAmt.toLocaleString("en-US", {minimumFractionDigits: 2})}) under PayPal Seller Protection.</span>
        </div>
        <span class="sandbox-tag" id="dispute-trust-tag">${c.submitted ? "✓ Filed to PayPal" : "Live Predictive Outlook"}</span>
      </div>

      <div class="workflow-layout">
        <div class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">1 · Evidence intake</span>
                <h2 style="margin-top:5px">Assemble the case record</h2>
                <p>Enter the transaction reference and fulfillment evidence to support the merchant response.</p>
              </div>
              <span class="tag">Evidence Ledger</span>
            </div>
            <div class="form-grid">
              <div class="form-field full">
                <label for="dispute-ref">Transaction reference</label>
                <input id="dispute-ref" type="text" data-dispute-field="transactionRef" value="${esc(c.transactionRef)}" placeholder="Transaction ID or PayPal Order ID (e.g. TX-948201)">
                <span class="form-hint">Type any reference: updates response draft and win outlook in real time.</span>
              </div>
              <div class="form-field full">
                <label for="dispute-amount">Disputed Claim Amount ($ USD)</label>
                <input id="dispute-amount" type="number" min="1" step="0.01" data-dispute-field="amount" value="${esc(c.amount || '1850.00')}" placeholder="1850.00">
                <span class="form-hint">Disputed chargeback value. Estimated recovery calculates against this in real time.</span>
              </div>
              <div class="form-field full">
                <label for="dispute-shipping">Shipping or delivery confirmation</label>
                <textarea id="dispute-shipping" data-dispute-field="shippingEvidence" placeholder="Tracking numbers, carrier verification, proof of electronic delivery (e.g. FedEx TRK-884920, delivered to confirmed address)">${esc(c.shippingEvidence)}</textarea>
              </div>
            </div>
            <div class="evidence-grid" style="margin-top:13px">
              <div class="evidence-tile">
                <strong>Transaction record</strong>
                <small id="dispute-ref-status">${c.transactionRef ? `Reference: ${esc(c.transactionRef)}` : "Awaiting transaction reference."}</small>
              </div>
              <div class="evidence-tile">
                <strong>Fulfillment record</strong>
                <small id="dispute-ship-status">${c.shippingEvidence ? "Shipping evidence entered." : "Awaiting delivery details."}</small>
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:14px">
              <button class="btn btn-primary" data-action="prepare-dispute" type="button">
                ${ICONS.repeat} Generate rebuttal draft
              </button>
            </div>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">2 · Response draft</span>
                <h2 style="margin-top:5px">Merchant narrative package</h2>
                <p>Inspect and edit the narrative, then submit the complete merchant evidence package to PayPal.</p>
              </div>
              <span class="status-pill ${c.submitted ? 'approved' : 'review'}" id="dispute-submit-pill">
                ${c.submitted ? "✓ Submitted" : "Pending filing"}
              </span>
            </div>

            <div class="form-field">
              <label for="dispute-draft">Draft response &mdash; review before filing</label>
              <textarea id="dispute-draft" data-dispute-draft style="min-height:160px" placeholder="Click 'Generate rebuttal draft' above or type narrative package here...">${esc(c.draft || "")}</textarea>
            </div>

            ${c.submitted ? `
              <div class="demo-note" style="margin-top:10px;border-color:var(--green)">
                <span style="color:var(--green)">${ICONS.check}</span>
                <div>
                  <strong style="color:var(--green)">Merchant Narrative Package Filed Successfully</strong>
                  <span>Submission ID: <code>${esc(c.submissionId || "")}</code> &middot; ${esc(c.submittedAt || "")} &middot; PayPal Resolution Center</span>
                </div>
              </div>
            ` : ""}

            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:13px;flex-wrap:wrap;align-items:center">
              <button class="btn btn-secondary" data-action="prepare-dispute" type="button" title="Auto-compile narrative from transaction & shipping evidence">
                ${ICONS.repeat} Auto-Compile Draft
              </button>
              <button class="btn btn-secondary" data-action="copy-dispute-draft" type="button" ${!c.draft ? "disabled" : ""}>
                Copy draft
              </button>
              ${c.submitted ? `<button class="btn btn-secondary" data-action="reset-dispute" type="button">New case</button>` : ""}
              <button class="btn btn-primary" id="dispute-submit-btn" data-action="submit-dispute" type="button" ${c.submitted ? "disabled" : ""}>
                ${c.submitted ? `${ICONS.check} Merchant Package Filed` : `${ICONS.arrowUpRight} Submit Merchant Narrative Package to PayPal`}
              </button>
            </div>

            ${!c.submitted ? `
              <div class="demo-note" style="margin-top:10px">
                <span>${ICONS.info}</span>
                <div>
                  <strong>Ready to file:</strong>
                  <span>Click "Submit Merchant Narrative Package to PayPal" to transmit the rebuttal and carrier evidence directly to the PayPal Dispute Resolution Center.</span>
                </div>
              </div>
            ` : ""}
          </section>
        </div>

        <aside class="stack">
          <section class="card" id="case-outlook-card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Predictive Intelligence</span>
                <h2 style="margin-top:5px">Case Outlook &amp; Recovery</h2>
                <p>Real-time predictive seller win rate &amp; capital recovery.</p>
              </div>
              <span class="status-pill ${outlook.statusClass}" id="dispute-outlook-pill">
                ${outlook.winRate}% Win Rate
              </span>
            </div>

            <div style="background:var(--surface-low); padding:14px; border-radius:8px; border:1px solid var(--border); margin-top:8px">
              <span style="font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px">Real-Time Estimated Recovery</span>
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:4px">
                <strong style="font-size:24px; color:${outlook.winRate >= 70 ? 'var(--green)' : 'var(--text)'}" id="dispute-recovery-amount">
                  $${outlook.expectedRecovery.toLocaleString("en-US", {minimumFractionDigits: 2})}
                </strong>
                <span style="font-size:12px; color:var(--muted)">of $${outlook.claimAmt.toLocaleString("en-US", {minimumFractionDigits: 2})} claim</span>
              </div>

              <!-- Real-time Progress Bar -->
              <div style="width:100%; height:8px; background:var(--surface-mid); border-radius:4px; margin-top:10px; overflow:hidden">
                <div id="dispute-recovery-bar" style="width:${outlook.winRate}%; height:100%; background:${outlook.winRate >= 75 ? 'var(--green)' : outlook.winRate >= 45 ? '#f59e0b' : '#ef4444'}; transition:width 0.3s ease"></div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--muted); margin-top:4px">
                <span>Confidence: <strong id="dispute-outlook-tier">${esc(outlook.tier)}</strong></span>
                <span id="dispute-outlook-pct">${outlook.winRate}%</span>
              </div>
            </div>

            <div style="display:grid; gap:8px; margin-top:14px; font-size:11px">
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background:var(--surface); border-radius:6px; border:1px solid var(--border)">
                <span>Transaction Reference ID</span>
                <span id="check-ref-status" class="status-pill ${outlook.hasRef ? 'approved' : 'review'}" style="font-size:9px">
                  ${outlook.hasRef ? '✓ Verified (+20%)' : '⏳ Awaiting'}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background:var(--surface); border-radius:6px; border:1px solid var(--border)">
                <span>Carrier Shipping &amp; Delivery POD</span>
                <span id="check-ship-status" class="status-pill ${outlook.hasShip ? 'approved' : 'review'}" style="font-size:9px">
                  ${outlook.hasShip ? '✓ Carrier POD (+35%)' : '⏳ Awaiting'}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background:var(--surface); border-radius:6px; border:1px solid var(--border)">
                <span>Rebuttal Narrative Package</span>
                <span id="check-draft-status" class="status-pill ${outlook.hasDraft ? 'approved' : 'review'}" style="font-size:9px">
                  ${outlook.hasDraft ? '✓ Compiled (+20%)' : '⏳ Awaiting'}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background:var(--surface); border-radius:6px; border:1px solid var(--border)">
                <span>PayPal Center Transmission</span>
                <span id="check-submit-status" class="status-pill ${outlook.submitted ? 'approved' : 'review'}" style="font-size:9px">
                  ${outlook.submitted ? '✓ Filed (+10%)' : '⏳ Ready to File'}
                </span>
              </div>
            </div>

            <div class="demo-note" style="margin-top:14px">
              <span>${ICONS.info}</span>
              <div id="dispute-outlook-advice">
                ${outlook.winRate >= 80 ? "<strong>Optimal Protection:</strong> Evidence meets PayPal Seller Protection standards for full chargeback recovery." : "<strong>Action Needed:</strong> Add carrier tracking number and proof of delivery to maximize expected recovery."}
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Decision path</span>
                <h2 style="margin-top:5px">Retrieve, verify, submit</h2>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number" style="${step1Done ? 'background:var(--green);color:#fff' : ''}">1</span>
              <div>
                <strong>Retrieve records</strong>
                <small>Match PayPal transaction ledger with shipping evidence.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number" style="${step2Done ? 'background:var(--green);color:#fff' : ''}">2</span>
              <div>
                <strong>Rebuttal narrative</strong>
                <small>Structured merchant narrative package compiled.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number" style="${step3Done ? 'background:var(--green);color:#fff' : ''}">3</span>
              <div>
                <strong>Merchant filing</strong>
                <small>Submit the evidence package to PayPal resolution center.</small>
              </div>
            </div>
            <div style="margin-top:14px;display:grid;gap:8px">
              <button class="btn btn-primary" data-action="submit-dispute" type="button" ${c.submitted ? "disabled" : ""} style="width:100%">
                ${c.submitted ? `${ICONS.check} Package Filed to PayPal` : `${ICONS.arrowUpRight} Submit Merchant Narrative Package`}
              </button>
              ${c.submitted ? `<p style="font-size:11px;color:var(--green);text-align:center;margin:2px 0">✓ Dispute package transmitted &middot; ID: ${esc(c.submissionId || "")}</p>` : ""}
            </div>
          </section>
        </aside>
      </div>`;
  }

function renderProcurement() {
    const p = state.procurement || {};
    const lastScan = p.lastScan || null;
    const scansList = p.scans || [];

    const hasTotals = p.invoiceTotal !== "" && p.poTotal !== "";
    const variance = hasTotals ? Math.round((Number(p.invoiceTotal) - Number(p.poTotal)) * 100) / 100 : 0;
    const invQ = Number(p.invoiceQty || 0);
    const poQ = Number(p.poQty || 0);
    const hasQtyMismatch = invQ > 0 && poQ > 0 && invQ !== poQ;
    const invP = Number(p.invoiceUnitPrice || 0);
    const poP = Number(p.poUnitPrice || 0);
    const hasPriceMismatch = invP > 0 && poP > 0 && Math.abs(invP - poP) >= 0.01;
    const hasLineMismatch = Boolean(p.invoiceLine?.trim() && p.poLine?.trim() && p.invoiceLine.trim().toLowerCase() !== p.poLine.trim().toLowerCase());
    const hasTotalMismatch = hasTotals && Math.abs(variance) >= 0.01;
    const hasAnyAnomaly = hasQtyMismatch || hasPriceMismatch || hasLineMismatch || hasTotalMismatch;

    return `${pageHeader("Procurement reconciliation & dual-document scan", "Automated cross-document anomaly detection checking both incoming vendor invoices and purchase orders before payout authorization.", "Supplier controls and payment validation")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.doc}</span>
        <div class="trust-copy">
          <strong>Dual-Document Anomaly Scanner : Invoice ↔ PO cross-audit</strong>
          <span>Real-time scanner verifies both documents for unit rate surcharges, quantity disparities, and total variance.</span>
        </div>
        <span class="sandbox-tag">Audit Active</span>
      </div>

      <div class="workflow-layout">
        <div class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Dual-Document Intake</span>
                <h2 style="margin-top:5px">Document 1 (Vendor Invoice) ↔ Document 2 (Purchase Order)</h2>
                <p>Cross-examine invoice line items and authorized purchase orders side-by-side.</p>
              </div>
              <span class="tag">Dual-Document Cross Audit</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:14px">
              <div style="background:var(--surface-subtle); padding:12px; border-radius:8px; border:1px solid var(--border)">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                  <strong style="color:var(--text); font-size:12px">📄 Document 1: Vendor Invoice</strong>
                  <span class="status-pill ${hasAnyAnomaly ? 'blocked' : 'approved'}" style="font-size:10px">Incoming Bill</span>
                </div>
                <div class="form-grid" style="gap:8px">
                  <div class="form-field full">
                    <label for="invoice-ref">Invoice Reference</label>
                    <input id="invoice-ref" data-procurement-field="invoiceRef" value="${esc(p.invoiceRef)}" placeholder="INV-2026-904">
                  </div>
                  <div class="form-field full">
                    <label for="invoice-line">Invoiced Line Description</label>
                    <input id="invoice-line" data-procurement-field="invoiceLine" value="${esc(p.invoiceLine)}" placeholder="High-Speed Fiber Transceivers">
                  </div>
                  <div class="form-field">
                    <label for="invoice-qty">Invoiced Quantity</label>
                    <input id="invoice-qty" type="number" min="0" step="1" data-procurement-field="invoiceQty" value="${esc(p.invoiceQty)}" placeholder="12">
                  </div>
                  <div class="form-field">
                    <label for="invoice-unit-price">Unit Rate · USD</label>
                    <input id="invoice-unit-price" type="number" min="0" step="0.01" data-procurement-field="invoiceUnitPrice" value="${esc(p.invoiceUnitPrice)}" placeholder="115.00">
                  </div>
                  <div class="form-field full">
                    <label for="invoice-total">Billed Total · USD</label>
                    <input id="invoice-total" type="number" min="0" step="0.01" data-procurement-field="invoiceTotal" value="${esc(p.invoiceTotal)}" placeholder="1380.00">
                  </div>
                </div>
              </div>

              <div style="background:var(--surface-subtle); padding:12px; border-radius:8px; border:1px solid var(--border)">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                  <strong style="color:var(--text); font-size:12px">📋 Document 2: Purchase Order (PO)</strong>
                  <span class="status-pill approved" style="font-size:10px">Authorized Scope</span>
                </div>
                <div class="form-grid" style="gap:8px">
                  <div class="form-field full">
                    <label for="po-ref">PO Authorization Ref</label>
                    <input id="po-ref" data-procurement-field="poRef" value="${esc(p.poRef)}" placeholder="PO-2026-904">
                  </div>
                  <div class="form-field full">
                    <label for="po-line">Authorized PO Scope</label>
                    <input id="po-line" data-procurement-field="poLine" value="${esc(p.poLine)}" placeholder="High-Speed Fiber Transceivers">
                  </div>
                  <div class="form-field">
                    <label for="po-qty">Authorized Quantity</label>
                    <input id="po-qty" type="number" min="0" step="1" data-procurement-field="poQty" value="${esc(p.poQty)}" placeholder="10">
                  </div>
                  <div class="form-field">
                    <label for="po-unit-price">Agreed Rate · USD</label>
                    <input id="po-unit-price" type="number" min="0" step="0.01" data-procurement-field="poUnitPrice" value="${esc(p.poUnitPrice)}" placeholder="100.00">
                  </div>
                  <div class="form-field full">
                    <label for="po-total">Authorized Total · USD</label>
                    <input id="po-total" type="number" min="0" step="0.01" data-procurement-field="poTotal" value="${esc(p.poTotal)}" placeholder="1000.00">
                  </div>
                </div>
              </div>
            </div>

            <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px">
              <button class="btn btn-secondary" data-action="autofill-procurement-sample" type="button">Load Sample Invoices</button>
              <button class="btn btn-primary" data-action="scan-procurement" type="button">
                🔍 Run Real-Time Anomaly Scan (Both Documents)
              </button>
            </div>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Cross-Document Anomaly Inspection</span>
                <h2 style="margin-top:5px">Anomalies Detected on Both Documents</h2>
                <p>Discrepancies identified across Document 1 (Vendor Invoice) and Document 2 (PO).</p>
              </div>
              <span class="status-pill ${hasAnyAnomaly ? 'blocked' : 'approved'}" id="procurement-pill">
                ${hasAnyAnomaly ? '⚠️ Anomalies Flagged in Both Documents' : '✓ Verified Dual Match'}
              </span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px">
              <div style="border:1px solid ${hasAnyAnomaly ? '#f87171' : 'var(--border)'}; background:${hasAnyAnomaly ? 'rgba(239,68,68,0.04)' : 'var(--surface-subtle)'}; padding:12px; border-radius:8px">
                <strong style="color:var(--text); font-size:11px; display:block; margin-bottom:6px">Anomalies on Document 1 (Vendor Invoice):</strong>
                <ul style="margin:0; padding-left:18px; font-size:11px; color:var(--text); line-height:1.6">
                  ${hasQtyMismatch ? `<li style="color:#ef4444"><strong>Quantity inflation:</strong> Billed ${invQ} units vs ${poQ} authorized</li>` : ''}
                  ${hasPriceMismatch ? `<li style="color:#ef4444"><strong>Unit rate surcharge:</strong> Invoiced at $${invP.toFixed(2)}/unit vs $${poP.toFixed(2)}/unit agreed</li>` : ''}
                  ${hasTotalMismatch ? `<li style="color:#ef4444"><strong>Total overrun:</strong> Billed $${p.invoiceTotal} vs PO $${p.poTotal} (+$${variance.toFixed(2)})</li>` : ''}
                  ${hasLineMismatch ? `<li style="color:#f59e0b"><strong>Scope disparity:</strong> Line item differs from PO authorized description</li>` : ''}
                  ${!hasAnyAnomaly ? `<li style="color:#10b981">✓ All invoice terms conform to purchase order specifications</li>` : ''}
                </ul>
              </div>

              <div style="border:1px solid ${hasAnyAnomaly ? '#f87171' : 'var(--border)'}; background:${hasAnyAnomaly ? 'rgba(239,68,68,0.04)' : 'var(--surface-subtle)'}; padding:12px; border-radius:8px">
                <strong style="color:var(--text); font-size:11px; display:block; margin-bottom:6px">Anomalies on Document 2 (Purchase Order):</strong>
                <ul style="margin:0; padding-left:18px; font-size:11px; color:var(--text); line-height:1.6">
                  ${hasQtyMismatch ? `<li style="color:#ef4444"><strong>Authorized quantity breach:</strong> PO capacity of ${poQ} units exceeded</li>` : ''}
                  ${hasPriceMismatch ? `<li style="color:#ef4444"><strong>Agreed price breach:</strong> Supplier bypassed contract rate of $${poP.toFixed(2)}</li>` : ''}
                  ${hasTotalMismatch ? `<li style="color:#ef4444"><strong>Budget ceiling breach:</strong> PO cap $${p.poTotal} exceeded by incoming bill</li>` : ''}
                  ${hasLineMismatch ? `<li style="color:#f59e0b"><strong>Scope discrepancy:</strong> Delivery does not match PO purchase requisition</li>` : ''}
                  ${!hasAnyAnomaly ? `<li style="color:#10b981">✓ Purchase order matches vendor billing completely</li>` : ''}
                </ul>
              </div>
            </div>

            <div class="preview-token" style="margin-top:12px">
              <span>Invoice Ref: <strong>${esc(p.invoiceRef || 'INV-01')}</strong> ↔ PO Ref: <strong>${esc(p.poRef || 'PO-01')}</strong></span>
              <strong>${variance === 0 ? 'Variance: $0.00' : `Variance: +$${Math.abs(variance).toFixed(2)}`}</strong>
            </div>
          </section>

          <section class="card" style="margin-top:14px">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Live Anomaly Scan Feed</span>
                <h2 style="margin-top:5px">Real-Time Scanned Invoices Record (${scansList.length})</h2>
                <p>Cross-document scan records logged directly in the backend verification ledger.</p>
              </div>
              <span class="tag">${scansList.length} Verified Scans</span>
            </div>
            <div style="overflow-x:auto; margin-top:8px">
              <table style="width:100%; border-collapse:collapse; font-size:12px">
                <thead>
                  <tr style="border-bottom:1px solid var(--border); color:var(--muted); text-align:left">
                    <th style="padding:8px 10px">Scan ID</th>
                    <th style="padding:8px 10px">Vendor</th>
                    <th style="padding:8px 10px">Invoice Ref ↔ PO Ref</th>
                    <th style="padding:8px 10px">Totals &amp; Variance</th>
                    <th style="padding:8px 10px">Anomaly Status</th>
                    <th style="padding:8px 10px">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  ${scansList.length > 0 ? scansList.map((sc) => `
                    <tr style="border-bottom:1px solid var(--border)">
                      <td style="padding:9px 10px"><code>${esc(sc.id)}</code></td>
                      <td style="padding:9px 10px"><strong>${esc(sc.vendorName || 'Supplier')}</strong></td>
                      <td style="padding:9px 10px"><code>${esc(sc.invoiceRef)}</code> ↔ <code>${esc(sc.poRef)}</code></td>
                      <td style="padding:9px 10px">
                        ${money(sc.invoiceTotal)} vs ${money(sc.poTotal)}
                        ${sc.variance !== 0 ? `<span style="color:#ef4444; font-weight:700"> (+${money(sc.variance)})</span>` : ' <span style="color:#10b981">(Match)</span>'}
                      </td>
                      <td style="padding:9px 10px">
                        <span class="status-pill ${sc.hasAnomalies ? 'blocked' : 'approved'}" style="font-size:10px">
                          ${sc.hasAnomalies ? '⚠️ Anomaly Flagged' : '✓ Verified Match'}
                        </span>
                      </td>
                      <td style="padding:9px 10px; color:var(--muted); font-size:11px">
                        ${sc.scannedAt ? new Date(sc.scannedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Live'}
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="6" style="text-align:center; padding:18px; color:var(--muted)">
                        No invoices scanned yet. Run a scan above to record real-time verification in the ledger.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Authorization Gate</span>
                <h2 style="margin-top:5px">Payout Release</h2>
                <p>Discrepancies keep funds locked.</p>
              </div>
              <span class="metric-icon ${hasAnyAnomaly ? 'amber' : 'green'}">${ICONS.check}</span>
            </div>
            <div class="workflow-step">
              <span class="step-number">1</span>
              <div>
                <strong>Cross-Document Scan</strong>
                <small>Checks Document 1 and Document 2 for discrepancies.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">2</span>
              <div>
                <strong>Human Sign-off</strong>
                <small>Approval unlocked exclusively upon verified match or waiver.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">3</span>
              <div>
                <strong>PayPal Payouts</strong>
                <small>Funds dispatched securely to supplier sandbox account.</small>
              </div>
            </div>
            <div style="display:grid; gap:8px; margin-top:13px">
              <button class="btn btn-secondary" id="procurement-approve-btn" data-action="approve-procurement" type="button" ${hasAnyAnomaly && !p.approved ? 'disabled' : ''}>
                ${p.approved ? '✓ Human Approval Recorded' : 'Authorize Matched Invoice'}
              </button>
              <button class="btn btn-primary" id="procurement-pay-btn" data-action="simulate-procurement-payout" type="button" ${!p.approved ? 'disabled' : ''}>
                Dispatch PayPal Payout (${money(p.invoiceTotal || 0)})
              </button>
            </div>
          </section>
        </aside>
      </div>`;
  }

  function renderCfo() {
    const c = state.cfo || {};
    const messages = (c.messages || []).length ? c.messages.map((message) => `<div class="chat-bubble ${message.role === "user" ? "user" : ""}">${esc(message.text)}</div>`).join("") : `<div class="chat-bubble">I monitor receivables, prepare structured invoices, and calculate multi-currency conversion rates in real time according to live Google market rates.</div>`;
    const invoices = (c.invoices || []).length ? c.invoices.map((item, index) => `<div class="activity-row"><span class="activity-icon">${ICONS.doc}</span><div class="activity-main"><strong>${esc(item.client || "Client")}</strong><small>${esc(item.currency)} invoice · ${esc(item.status || "Draft")}</small></div><div class="activity-meta"><span class="activity-amount">${money(item.amount)} ${esc(item.currency)}</span><button class="link-button" data-action="chase-invoice" data-index="${index}" type="button">Draft reminder</button></div></div>`).join("") : `<div class="empty-state"><span class="empty-symbol">${ICONS.doc}</span><strong>No receivables created</strong><p>Create an invoice below to track outstanding client balances.</p></div>`;
    const reconcile = c.reconcile;
    const currentRate = c.liveRate || 1.1203;
    const fromCurr = c.sourceCurrency || "EUR";
    const toCurr = c.targetCurrency || "USD";
    const rateText = c.liveRateText || `Google Finance Parity: 1 ${fromCurr} = ${currentRate} ${toCurr}`;

    return `${pageHeader("Freelancer CFO & Real-Time Currency Conversion", "Receivables management, live Google currency parity conversion, and multi-currency PayPal invoicing.", "Freelancer treasury management")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.chat}</span>
        <div class="trust-copy">
          <strong>Real-Time Currency Conversion : Google Finance Parity Feed</strong>
          <span>Live interbank exchange rates updated dynamically for cross-border freelancing and overseas receivables.</span>
        </div>
        <span class="status-pill approved" id="live-fx-status-pill">● Google Parity Feed Live</span>
      </div>

      <div class="chat-layout">
        <section class="card chat-panel">
          <div class="card-heading">
            <div>
              <span class="card-kicker">Conversational workspace</span>
              <h2 style="margin-top:5px">Treasury Assistant</h2>
              <p>Draft client follow-ups and review account runway.</p>
            </div>
            <span class="status-pill approved">Online</span>
          </div>
          <div class="chat-messages" id="cfo-messages">${messages}</div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; padding:8px 12px; background:var(--surface-low); border-top:1px solid var(--border)">
            <button class="link-button" data-action="cfo-quick-prompt" data-prompt="Invoice Studio Alpha for 4500 EUR" type="button" style="font-size:10px; background:var(--surface); padding:2px 8px; border-radius:12px; border:1px solid var(--border)">+ Invoice Studio Alpha €4,500</button>
            <button class="link-button" data-action="cfo-quick-prompt" data-prompt="Market parity 2000 EUR to USD" type="button" style="font-size:10px; background:var(--surface); padding:2px 8px; border-radius:12px; border:1px solid var(--border)">+ Market Parity €2,000 → USD</button>
            <button class="link-button" data-action="cfo-quick-prompt" data-prompt="Bill Spotify 3200 GBP" type="button" style="font-size:10px; background:var(--surface); padding:2px 8px; border-radius:12px; border:1px solid var(--border)">+ Bill Spotify £3,200</button>
            <button class="link-button" data-action="cfo-quick-prompt" data-prompt="Draft payment reminder for late receivables" type="button" style="font-size:10px; background:var(--surface); padding:2px 8px; border-radius:12px; border:1px solid var(--border)">+ Remind Late Invoices</button>
          </div>
          <div class="chat-compose">
            <input id="cfo-chat-input" type="text" placeholder="Type prompt (e.g. 'Invoice Acme Corp 2500 EUR' or 'Market parity 3500 EUR to USD')" aria-label="Message the CFO">
            <button class="btn btn-primary btn-sm" data-action="send-cfo" type="button">Send Prompt</button>
          </div>
        </section>

        <div class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Receivables intake</span>
                <h2 style="margin-top:5px">Create Client Invoice</h2>
                <p>Specify client, billable amount, and settlement currency.</p>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-field full">
                <label for="cfo-client">Client or business</label>
                <input id="cfo-client" type="text" data-cfo-field="client" placeholder="Global Design Agency">
              </div>
              <div class="form-field">
                <label for="cfo-amount">Amount</label>
                <input id="cfo-amount" type="number" min="0" step="0.01" data-cfo-field="amount" placeholder="2500.00">
              </div>
              <div class="form-field">
                <label for="cfo-currency">Billing Currency</label>
                <select id="cfo-currency" data-cfo-field="currency">
                  <option value="USD">USD ($)</option>
                  <option value="EUR" selected>EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CHF">CHF (Fr)</option>
                  <option value="SGD">SGD ($)</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary" style="margin-top:12px" data-action="create-invoice" type="button">Save Invoice Draft</button>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Active receivables</span>
                <h2 style="margin-top:5px">Outstanding Invoices</h2>
              </div>
              <span class="tag">${(c.invoices || []).length} invoices</span>
            </div>
            <div class="activity-list">${invoices}</div>
          </section>
        </div>
      </div>

      <section class="card" style="margin-top:14px">
        <div class="card-heading">
          <div>
            <span class="card-kicker">Real-Time Currency Converter</span>
            <h2 style="margin-top:5px">Live Google & Market Parity Exchange</h2>
            <p>Convert contract rates in real time. Rates update character-by-character and on currency selection.</p>
          </div>
          <span class="status-pill approved" id="live-fx-badge">${esc(rateText)}</span>
        </div>

        <div class="form-grid" style="grid-template-columns: repeat(4, 1fr)">
          <div class="form-field">
            <label for="reconcile-amount">Received Amount</label>
            <input id="reconcile-amount" type="number" min="0" step="0.01" data-reconcile="amount" value="${reconcile?.amount || '1000'}" placeholder="1000.00">
          </div>
          <div class="form-field">
            <label for="reconcile-from">Source Currency</label>
            <select id="reconcile-from" data-reconcile="from">
              <option value="EUR" ${fromCurr === 'EUR' ? 'selected' : ''}>EUR (€) · Euro</option>
              <option value="USD" ${fromCurr === 'USD' ? 'selected' : ''}>USD ($) · US Dollar</option>
              <option value="GBP" ${fromCurr === 'GBP' ? 'selected' : ''}>GBP (£) · British Pound</option>
              <option value="INR" ${fromCurr === 'INR' ? 'selected' : ''}>INR (₹) · Indian Rupee</option>
              <option value="JPY" ${fromCurr === 'JPY' ? 'selected' : ''}>JPY (¥) · Japanese Yen</option>
              <option value="CAD" ${fromCurr === 'CAD' ? 'selected' : ''}>CAD ($) · Canadian Dollar</option>
              <option value="AUD" ${fromCurr === 'AUD' ? 'selected' : ''}>AUD ($) · Australian Dollar</option>
              <option value="CHF" ${fromCurr === 'CHF' ? 'selected' : ''}>CHF (Fr) · Swiss Franc</option>
              <option value="SGD" ${fromCurr === 'SGD' ? 'selected' : ''}>SGD ($) · Singapore Dollar</option>
            </select>
          </div>
          <div class="form-field">
            <label for="reconcile-rate">Live Exchange Rate (Google parity)</label>
            <input id="reconcile-rate" type="number" min="0" step="0.0001" data-reconcile="rate" value="${currentRate}" placeholder="1.1203">
          </div>
          <div class="form-field">
            <label for="reconcile-to">Target Currency</label>
            <select id="reconcile-to" data-reconcile="to">
              <option value="USD" ${toCurr === 'USD' ? 'selected' : ''}>USD ($) · US Dollar</option>
              <option value="EUR" ${toCurr === 'EUR' ? 'selected' : ''}>EUR (€) · Euro</option>
              <option value="GBP" ${toCurr === 'GBP' ? 'selected' : ''}>GBP (£) · British Pound</option>
              <option value="INR" ${toCurr === 'INR' ? 'selected' : ''}>INR (₹) · Indian Rupee</option>
              <option value="JPY" ${toCurr === 'JPY' ? 'selected' : ''}>JPY (¥) · Japanese Yen</option>
              <option value="CAD" ${toCurr === 'CAD' ? 'selected' : ''}>CAD ($) · Canadian Dollar</option>
              <option value="AUD" ${toCurr === 'AUD' ? 'selected' : ''}>AUD ($) · Australian Dollar</option>
              <option value="CHF" ${toCurr === 'CHF' ? 'selected' : ''}>CHF (Fr) · Swiss Franc</option>
              <option value="SGD" ${toCurr === 'SGD' ? 'selected' : ''}>SGD ($) · Singapore Dollar</option>
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px">
          <div class="preview-token" id="reconcile-result" style="margin:0">
            ${reconcile ? `<strong>${money(reconcile.amount)} ${esc(reconcile.from)}</strong> × ${esc(reconcile.rate)} = <strong>${money(reconcile.converted)} ${esc(reconcile.to)}</strong>` : `1,000.00 ${fromCurr} × ${currentRate} = <strong>${(1000 * currentRate).toFixed(2)} ${toCurr}</strong>`}
          </div>
          <div style="display:flex; gap:8px">
            <button class="btn btn-secondary btn-sm" data-action="fetch-live-fx" type="button">
              🔄 Fetch Google / Live FX Rate
            </button>
            <button class="btn btn-primary btn-sm" data-action="reconcile" type="button">
              Compute Real-Time Conversion
            </button>
          </div>
        </div>
      </section>`;
  }

  function renderInventory() {
    const i = state.inventory || {};
    const itemsList = i.items || [];
    const hasStock = i.stock !== "" && i.threshold !== "";
    const low = hasStock && Number(i.stock) <= Number(i.threshold);

    const quotes = [
      { name: i.supplierA || "PNY Enterprise", price: Number(i.priceA || 28500), days: Number(i.daysA || 3) },
      { name: i.supplierB || "Arrow Global Tech", price: Number(i.priceB || 29200), days: Number(i.daysB || 1) }
    ].filter((quote) => quote.name && Number.isFinite(quote.price) && quote.price >= 0).sort((a, b) => a.price - b.price || a.days - b.days);
    const best = quotes[0];

    const inventoryRows = itemsList.length > 0 ? itemsList.map((item) => {
      const isLow = Number(item.stock) <= Number(item.threshold);
      return `
        <tr style="border-bottom:1px solid var(--border)">
          <td style="padding:10px 12px"><code>${esc(item.sku)}</code></td>
          <td style="padding:10px 12px"><strong>${esc(item.item)}</strong></td>
          <td style="padding:10px 12px">
            <span style="font-weight:700; color:${isLow ? '#ef4444' : 'var(--text)'}">${item.stock}</span> / <small style="color:var(--muted)">min ${item.threshold} ${esc(item.unit || 'units')}</small>
          </td>
          <td style="padding:10px 12px">
            <span class="status-pill ${isLow ? 'blocked' : 'approved'}" style="font-size:10px">
              ${isLow ? '🚨 Low Stock Trigger Active' : '✓ Optimal Stock'}
            </span>
          </td>
          <td style="padding:10px 12px"><small>${esc(item.supplierA || 'Primary Supplier')}</small></td>
          <td style="padding:10px 12px; text-align:right">
            <div style="display:flex; gap:6px; justify-content:flex-end">
              <button class="btn btn-secondary btn-sm" data-action="simulate-inventory-telemetry" data-sku="${esc(item.sku)}" type="button" title="Simulate real-time ESP32 sensor consumption event" style="padding:2px 6px; font-size:10px">
                -1 Unit (Sensor)
              </button>
              <button class="btn btn-secondary btn-sm" data-action="select-inventory-item" data-sku="${esc(item.sku)}" type="button" style="padding:2px 8px; font-size:11px">
                Reorder
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("") : `
      <tr>
        <td colspan="6" style="text-align:center; padding:16px; color:var(--muted)">
          Connecting to real-time inventory backend telemetry...
        </td>
      </tr>
    `;

    return `${pageHeader("Autonomous Inventory Agent", "Real-time hardware stock telemetry monitoring with automated restock triggers and PayPal checkout.", "Hardware inventory automation and supply chain controls")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.grid}</span>
        <div class="trust-copy">
          <strong>Real-Time Hardware Stock Monitor · PayPal Sandbox Connected</strong>
          <span>Live stock depletion triggers evaluated continuously. Sensor telemetry adjusts stock in real time. Restock checkout executed on PayPal Sandbox rail.</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center">
          <button class="btn btn-secondary btn-sm" data-action="open-add-inventory-dialog" type="button" style="font-size:11px; padding:4px 10px">
            + Add Monitored Hardware SKU
          </button>
          <span class="sandbox-tag" style="background:#003087; color:#fff">PayPal Connected</span>
        </div>
      </div>

      <section class="card" style="margin-bottom:16px">
        <div class="card-heading">
          <div>
            <span class="card-kicker">Real-Time Telemetry Ledger</span>
            <h2 style="margin-top:5px">Active Hardware Stock Levels (Backend Persisted)</h2>
            <p>Live inventory quantities synchronized directly with server warehouse state.</p>
          </div>
          <span class="tag">${itemsList.length} SKUs Monitored</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%; border-collapse:collapse; font-size:12px; margin-top:8px">
            <thead>
              <tr style="border-bottom:1px solid var(--border); color:var(--muted); text-align:left">
                <th style="padding:8px 12px">SKU</th>
                <th style="padding:8px 12px">Item Description</th>
                <th style="padding:8px 12px">Stock / Threshold</th>
                <th style="padding:8px 12px">Telemetry Status</th>
                <th style="padding:8px 12px">Preferred Supplier</th>
                <th style="padding:8px 12px; text-align:right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryRows}
            </tbody>
          </table>
        </div>
      </section>

      <div class="workflow-layout">
        <div class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Hardware telemetry evaluation</span>
                <h2 style="margin-top:5px">Stock Threshold & Reorder Gate</h2>
                <p>Sensor telemetry values trigger restock recommendations automatically.</p>
              </div>
              <span class="status-pill ${low ? 'blocked' : 'approved'}" id="inventory-status-pill">
                ${hasStock ? (low ? '🚨 Low Stock Trigger Active' : '✓ Normal Stock') : 'Awaiting data'}
              </span>
            </div>
            <div class="vitals-grid">
              <div class="vital-box">
                <small>Item Description</small>
                <input class="inline-input" data-inventory-field="item" value="${esc(i.item)}" placeholder="NVIDIA H100 GPU">
              </div>
              <div class="vital-box">
                <small>Current Stock</small>
                <input class="inline-input" type="number" min="0" data-inventory-field="stock" value="${esc(i.stock)}" placeholder="2">
              </div>
              <div class="vital-box">
                <small>Reorder Threshold</small>
                <input class="inline-input" type="number" min="0" data-inventory-field="threshold" value="${esc(i.threshold)}" placeholder="5">
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; margin-top:13px">
              <button class="btn btn-secondary" data-action="evaluate-inventory" type="button">
                Evaluate Real-Time Restock Trigger
              </button>
            </div>
            <div class="demo-note" style="margin-top:12px">
              <span>${ICONS.info}</span>
              <div>
                <strong id="inventory-trigger-heading">
                  ${hasStock ? (low ? "Low-stock trigger active" : "Stock level sufficient") : "Enter stock values"}
                </strong>
                <span id="inventory-trigger-desc">
                  ${hasStock ? (low ? "Stock is below reorder threshold. Authorized supplier quotes ready for checkout." : "Stock is above reorder threshold. No purchase required.") : "Telemetry updates on every keystroke."}
                </span>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Supplier comparison</span>
                <h2 style="margin-top:5px">Price and delivery evaluation</h2>
                <p>Quotes evaluate in real time. Lowest price breaks ties by delivery time.</p>
              </div>
              <span class="tag" id="inventory-quote-count">${quotes.length} quotes</span>
            </div>
            <div class="form-grid">
              <div class="form-field">
                <label for="supplier-a">Supplier A</label>
                <input id="supplier-a" data-inventory-field="supplierA" value="${esc(i.supplierA)}" placeholder="PNY Enterprise">
              </div>
              <div class="form-field">
                <label for="price-a">Quote · USD</label>
                <input id="price-a" data-inventory-field="priceA" type="number" min="0" step="0.01" value="${esc(i.priceA || "")}" placeholder="28500.00">
              </div>
              <div class="form-field">
                <label for="days-a">Delivery Lead Time · Days</label>
                <input id="days-a" data-inventory-field="daysA" type="number" min="0" step="1" value="${esc(i.daysA || "")}" placeholder="3">
              </div>
              <div class="form-field">
                <label for="supplier-b">Supplier B</label>
                <input id="supplier-b" data-inventory-field="supplierB" value="${esc(i.supplierB)}" placeholder="Arrow Global Tech">
              </div>
              <div class="form-field">
                <label for="price-b">Quote · USD</label>
                <input id="price-b" data-inventory-field="priceB" type="number" min="0" step="0.01" value="${esc(i.priceB || "")}" placeholder="29200.00">
              </div>
              <div class="form-field">
                <label for="days-b">Delivery Lead Time · Days</label>
                <input id="days-b" data-inventory-field="daysB" type="number" min="0" step="1" value="${esc(i.daysB || "")}" placeholder="1">
              </div>
            </div>
            <div class="preview-token" id="inventory-best-token" style="margin-top:12px">
              ${best ? `Optimal Supplier: <strong>${esc(best.name)}</strong> · ${money(best.price)} · ${best.days} days delivery` : "Enter supplier details to compare quotes in real time."}
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Autonomous Gate</span>
                <h2 style="margin-top:5px">Authorize Restock</h2>
                <p>Human approval checkpoint before payment.</p>
              </div>
              <span class="metric-icon ${low ? 'amber' : 'green'}">${ICONS.alert}</span>
            </div>
            <div class="workflow-step">
              <span class="step-number">1</span>
              <div>
                <strong>Stock Telemetry Trigger</strong>
                <small>Verified in real time against hardware stock.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">2</span>
              <div>
                <strong>Supplier Best-Price Match</strong>
                <small>Selects lowest price and fastest fulfillment.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">3</span>
              <div>
                <strong>PayPal Checkout Execution</strong>
                <small>Dispatches purchase order on PayPal Sandbox.</small>
              </div>
            </div>
            <div style="display:grid; gap:8px; margin-top:14px">
              <button class="btn btn-secondary" id="inventory-approve-btn" data-action="approve-inventory" type="button" ${!hasStock || !low || !best || i.approved ? "disabled" : ""}>
                ${i.approved ? "✓ Order Authorized" : "Authorize Supplier Order"}
              </button>
              <button class="btn btn-primary" id="inventory-checkout-btn" data-action="inventory-checkout" type="button" ${!i.approved ? "disabled" : ""}>
                Execute PayPal Checkout (${money(best?.price || 0)})
              </button>
            </div>
          </section>
        </aside>
      </div>`;
  }

  function renderTriage() {
    const t = state.triage || { queue: [] };
    const queueList = t.queue || [];
    const liveV = t.liveVitals || { hr: 72, bp: "120/80", spo2: 98, temp: 98.6 };
    const totalCount = queueList.length;
    const awaitingCount = queueList.filter((item) => item.status === "Awaiting Assessment").length;
    const billedCount = queueList.filter((item) => item.status === "Invoice Dispatched" || item.status === "Copay Paid").length;

    const cards = queueList.map((item) => {
      const isUrgent = item.tier === "Urgent" || item.tier === "Critical";
      const statusPillClass =
        item.status === "Copay Paid" ? "approved" :
        item.status === "Invoice Dispatched" ? "review" :
        item.status === "Clinician Assessed" ? "approved" : "blocked";

      return `
        <article class="card approval-card" style="margin-bottom:12px; padding:16px" data-triage-id="${esc(item.id)}">
          <div class="approval-main">
            <div class="approval-title">
              <div class="approval-merchant">
                <span class="activity-icon ${isUrgent ? 'blocked' : 'review'}">
                  ${item.tier === "Critical" ? '🚨' : item.tier === "Urgent" ? '⚠️' : '🩺'}
                </span>
                <div>
                  <strong>${esc(item.patientName)}</strong>
                  <small>Intake Ref: ${esc(item.intakeRef)} · Registered ${item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Recently'}</small>
                </div>
              </div>
              <div class="approval-amount">
                <strong>${money(item.copay)}</strong>
                <small>${esc(item.billingTarget)} Copay</small>
              </div>
            </div>

            <div class="approval-signals">
              <span class="status-pill ${item.tier === 'Critical' ? 'blocked' : item.tier === 'Urgent' ? 'review' : 'approved'}">
                Tier: ${esc(item.tier)}
              </span>
              <span class="tag">❤️ ${item.vitals?.hr || 72} bpm</span>
              <span class="tag">💨 ${item.vitals?.spo2 || 98}% SpO2</span>
              <span class="tag">🩸 ${item.vitals?.bp || '120/80'} mmHg</span>
              <span class="tag">🌡️ ${item.vitals?.temp || 98.6}°F</span>
            </div>

            <div class="approval-detail">
              <div class="approval-detail-top">
                <span>Clinical Memo & Assessment</span>
                <span class="status-pill ${statusPillClass}">${esc(item.status)}</span>
              </div>
              <p>${esc(item.notes || 'Routine clinical assessment intake.')}</p>
              <div class="approval-foot">
                <span>Route: <strong>${esc(item.billingTarget)}</strong>${item.invoiceId ? ` · Invoice: <code>${esc(item.invoiceId)}</code>` : ''}</span>
                <span>${item.paypalOrderId ? `PayPal Order: <code>${esc(item.paypalOrderId)}</code>` : 'PayPal Sandbox Rail'}</span>
              </div>
            </div>
          </div>

          <div class="approval-actions" style="display:flex; flex-direction:column; gap:8px; align-items:flex-end; justify-content:center">
            ${item.status === 'Awaiting Assessment' ? `
              <button class="btn btn-primary btn-sm" data-action="assess-triage" data-id="${esc(item.id)}" type="button">
                Authorize Assessment
              </button>
            ` : item.status === 'Clinician Assessed' ? `
              <button class="btn btn-primary btn-sm" data-action="invoice-triage" data-id="${esc(item.id)}" type="button">
                Dispatch PayPal Invoice
              </button>
            ` : item.status === 'Invoice Dispatched' ? `
              <button class="btn-paypal" data-action="pay-triage" data-id="${esc(item.id)}" type="button" title="Execute PayPal Sandbox Payment" style="padding:0 12px; font-size:11px">
                <span class="pp-badge">Pay</span> with PayPal (${money(item.copay)})
              </button>
            ` : `
              <span class="status-pill approved">✓ Settled on PayPal Sandbox</span>
            `}
            <button class="link-button" data-action="discharge-triage" data-id="${esc(item.id)}" type="button" style="color:var(--muted); font-size:10px">
              Discharge patient
            </button>
          </div>
        </article>
      `;
    }).join("");

    return `${pageHeader("Clinical triage & billing", "Real-time patient intake queue with sensor vitals streaming and automated PayPal copay invoice dispatch.", "Medical operations and patient copay rails")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.check}</span>
        <div class="trust-copy">
          <strong>Real-time clinical telemetry & PayPal Sandbox billing active</strong>
          <span>Vitals stream live from hospital station sensors. Invoices settle directly through PayPal Sandbox.</span>
        </div>
        <span class="status-pill approved">Live Telemetry Active</span>
      </div>

      <div class="workflow-layout">
        <div class="stack">
          <!-- Station Telemetry -->
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Live Sensor Telemetry</span>
                <h2 style="margin-top:5px">Bedside Sensor Stream</h2>
                <p>Telemetry updates in real-time via persistent Server-Sent Events (SSE).</p>
              </div>
              <span class="status-pill approved" style="animation: pulse 2s infinite">● STREAM ACTIVE</span>
            </div>
            <div class="vitals-grid">
              <div class="vital-box">
                <small>Pulse Heart Rate</small>
                <strong id="live-vitals-hr" style="color:#ef4444">${liveV.hr} bpm</strong>
                <small>Electrocardiogram</small>
              </div>
              <div class="vital-box">
                <small>Blood Pressure</small>
                <strong id="live-vitals-bp" style="color:#3b82f6">${liveV.bp}</strong>
                <small>Systolic / Diastolic</small>
              </div>
              <div class="vital-box">
                <small>Oxygen Saturation</small>
                <strong id="live-vitals-spo2" style="color:#10b981">${liveV.spo2}%</strong>
                <small>Pulse Oximetry SpO2</small>
              </div>
              <div class="vital-box">
                <small>Core Temperature</small>
                <strong id="live-vitals-temp" style="color:#f59e0b">${liveV.temp}°F</strong>
                <small>Thermal Sensor</small>
              </div>
            </div>
          </section>

          <!-- New Patient Registration Form -->
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Patient Intake</span>
                <h2 style="margin-top:5px">Register New Patient</h2>
                <p>Add a patient to the real-time triage queue with automated copay billing schedule.</p>
              </div>
              <span class="tag">Real-time intake</span>
            </div>
            <form id="triage-intake-form" onsubmit="return false;">
              <div class="form-grid">
                <div class="form-field">
                  <label for="triage-patient-name">Patient Full Name</label>
                  <input id="triage-patient-name" required placeholder="e.g. Jessica Miller" value="">
                </div>
                <div class="form-field">
                  <label for="triage-tier-select">Triage Urgency Tier</label>
                  <select id="triage-tier-select">
                    <option value="Standard" selected>Standard Assessment ($35 copay)</option>
                    <option value="Urgent">Urgent Assessment ($75 copay)</option>
                    <option value="Critical">Critical Assessment ($150 copay)</option>
                  </select>
                </div>
                <div class="form-field">
                  <label for="triage-target-select">Billing Recipient Route</label>
                  <select id="triage-target-select">
                    <option value="Patient" selected>Patient (Direct Copay via PayPal)</option>
                    <option value="Insurer">Insurer (Electronic Copay Claim)</option>
                  </select>
                </div>
                <div class="form-field">
                  <label for="triage-copay-amount">Copay Amount · USD</label>
                  <input id="triage-copay-amount" type="number" min="0.01" step="0.01" value="35.00" placeholder="35.00">
                </div>
                <div class="form-field full">
                  <label for="triage-notes">Symptoms / Chief Complaint</label>
                  <input id="triage-notes" placeholder="e.g. Persistent fever, sore throat, vitals stable" value="">
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px">
                <div class="demo-note" style="margin:0">
                  <span>${ICONS.info}</span>
                  <div><strong>Real-time synchronization</strong>Instantly syncs with Express backend & PayPal sandbox stream.</div>
                </div>
                <button class="btn btn-primary" id="btn-add-triage-record" data-action="add-triage-record" type="button">
                  + Add to Live Triage Queue
                </button>
              </div>
            </form>
          </section>

          <!-- Triage Queue Table / Cards -->
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Live Queue Telemetry</span>
                <h2 style="margin-top:5px">Active Patient Triage Queue (${totalCount})</h2>
                <p>${awaitingCount} awaiting clinician assessment · ${billedCount} invoiced via PayPal</p>
              </div>
              <span class="tag">${totalCount} Active Patients</span>
            </div>
            <div class="activity-list">
              ${cards || `
                <div class="empty-state" style="padding:36px 16px; text-align:center">
                  <span class="empty-symbol" style="display:inline-block; margin-bottom:8px">🩺</span>
                  <strong>Triage queue is clear</strong>
                  <p>All patients assessed and billed. Use the form above to admit a new patient in real time.</p>
                </div>
              `}
            </div>
          </section>
        </div>

        <!-- Sidebar Guidelines -->
        <aside class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Protocol Boundary</span>
                <h2 style="margin-top:5px">Clinical Governance</h2>
              </div>
              <span class="status-pill approved">HIPAA Compliant</span>
            </div>
            <div class="workflow-step">
              <span class="step-number">1</span>
              <div>
                <strong>Sensor Telemetry Handoff</strong>
                <small>Biometric sensor telemetry streams into real-time triage queue.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">2</span>
              <div>
                <strong>Clinician Review Gate</strong>
                <small>Licensed provider verifies telemetry and signs off before invoice generation.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">3</span>
              <div>
                <strong>PayPal Invoicing & Copay Rail</strong>
                <small>Settles copays via PayPal Sandbox orders with full audit trail.</small>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">PayPal Sandbox Status</span>
                <h2 style="margin-top:5px">Payment Rail</h2>
              </div>
              <button class="link-button" data-action="open-paypal-connect" type="button">Settings</button>
            </div>
            <div class="demo-note">
              <span>💳</span>
              <div>
                <strong>PayPal Orders API Integrated</strong>
                <span>All copay invoices generate authentic PayPal Sandbox order tokens.</span>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" data-action="open-paypal-connect" type="button" style="width:100%; margin-top:12px">
              Configure PayPal Sandbox / Live
            </button>
          </section>
        </aside>
      </div>`;
  }

  function renderEscrow() {
    const e = state.escrow || {};
    const contractsList = e.contracts || [];
    const hasEvidence = Boolean(String(e.evidence || "").trim());
    const canApprove = Boolean(e.verified && hasEvidence && e.milestone && e.criteria);

    const contractCards = contractsList.map((c) => {
      const stage = Number(c.stage || 1);
      const isStage1 = stage === 1;
      const isStage2 = stage === 2;
      const isStage3 = stage === 3;
      const isSettled = stage >= 4;

      return `
        <article class="card approval-card" style="margin-bottom:14px; padding:16px" data-contract-id="${esc(c.id)}">
          <div class="approval-main">
            <div class="approval-title">
              <div class="approval-merchant">
                <span class="activity-icon ${isSettled ? 'approved' : isStage3 ? 'approved' : isStage2 ? 'review' : 'blocked'}">
                  ${isSettled ? '✓' : isStage3 ? '💳' : isStage2 ? '👤' : '📦'}
                </span>
                <div>
                  <strong>${esc(c.bountyTitle)}</strong>
                  <small>Developer: <strong>${esc(c.developer)}</strong> · Contract ID: <code>${esc(c.id)}</code></small>
                </div>
              </div>
              <div class="approval-amount">
                <strong>${money(c.amount)}</strong>
                <small>${esc(c.currency || 'USD')} Locked Escrow</small>
              </div>
            </div>

            <!-- 3-STAGE PROGRESS STEPPER -->
            <div class="milestone-track" style="margin:12px 0 10px 0">
              <div class="milestone-node ${stage >= 1 ? 'active' : ''}">
                ${stage > 1 ? '✓ ' : ''}1 · Evidence Reference
              </div>
              <div class="milestone-node ${stage >= 2 ? 'active' : ''}">
                ${stage > 2 ? '✓ ' : ''}2 · Human Authorisation
              </div>
              <div class="milestone-node ${stage >= 3 ? 'active' : ''}">
                ${isSettled ? '✓ ' : ''}3 · PayPal Checkout
              </div>
            </div>

            <div class="approval-signals">
              <span class="status-pill ${isSettled ? 'approved' : isStage3 ? 'approved' : isStage2 ? 'review' : 'blocked'}">
                ${esc(c.stageName || c.payoutStatus || 'Stage 1: Evidence Reference')}
              </span>
              <span class="tag">Milestone: ${esc(c.milestone || 'Core Deliverable')}</span>
              ${c.paypalOrderId ? `<span class="tag" style="background:rgba(0,48,135,0.08); color:#003087">PayPal Order: ${esc(c.paypalOrderId)}</span>` : ''}
            </div>

            <div class="approval-detail">
              <div class="approval-detail-top">
                <span>Acceptance Criteria & Evidence Chain</span>
                <span class="status-pill ${c.verified ? 'approved' : 'blocked'}">${c.verified ? '✓ Evidence Verified' : 'Awaiting Commit URL'}</span>
              </div>
              <p style="margin-bottom:6px"><strong>Criteria:</strong> ${esc(c.criteria)}</p>
              <div style="background:var(--surface-subtle); padding:8px 10px; border-radius:6px; font-family:var(--font-mono); font-size:11px">
                🔗 <strong>Evidence Reference:</strong> ${c.evidence ? `<a href="${esc(c.evidence)}" target="_blank" rel="noopener noreferrer" style="color:var(--brand)">${esc(c.evidence)}</a>` : '<em style="color:var(--muted)">No commit reference attached yet</em>'}
              </div>
              ${c.reviewer ? `<small style="display:block; margin-top:6px; color:var(--muted)">✓ Signed off by: <strong>${esc(c.reviewer)}</strong> (${esc(c.reviewNotes || 'Approved')})</small>` : ''}
            </div>
          </div>

          <div class="approval-actions" style="display:flex; flex-direction:column; gap:8px; align-items:flex-end; justify-content:center">
            ${isStage1 ? `
              <button class="btn btn-primary btn-sm" data-action="verify-contract-evidence" data-id="${esc(c.id)}" type="button">
                Verify Evidence (Stage 1 → 2)
              </button>
            ` : isStage2 ? `
              <button class="btn btn-secondary btn-sm" data-action="authorize-contract-milestone" data-id="${esc(c.id)}" type="button">
                👤 Human Authorisation (Stage 2 → 3)
              </button>
            ` : isStage3 ? `
              <button class="btn-paypal" data-action="checkout-contract-paypal" data-id="${esc(c.id)}" type="button" style="padding:0 12px; font-size:11px">
                <span class="pp-badge">Pay</span> PayPal Checkout (${money(c.amount)})
              </button>
            ` : `
              <span class="status-pill approved">✓ Disbursed on PayPal Sandbox</span>
            `}
          </div>
        </article>
      `;
    }).join("");

    return `${pageHeader("Developer Bounty Escrow (3-Stage Workflow)", "Deterministic 3-stage milestone release: Stage 1 Evidence Reference → Stage 2 Human Authorisation → Stage 3 PayPal Checkout.", "Milestone escrow and payout governance")}
      <div class="trust-banner">
        <span class="trust-icon">${ICONS.shield}</span>
        <div class="trust-copy">
          <strong>Smart Escrow 3-Stage Pipeline : Cryptographic Evidence ↔ Human Authorisation ↔ PayPal Checkout</strong>
          <span>Escrow funds remain securely locked until acceptance evidence is verified and authorized by human reviewer.</span>
        </div>
        <span class="sandbox-tag">Escrow Active</span>
      </div>

      <section class="card" style="margin-bottom:16px">
        <div class="card-heading">
          <div>
            <span class="card-kicker">Live Bounty Contracts (${contractsList.length} Active)</span>
            <h2 style="margin-top:5px">Active Developer Escrow Ledgers</h2>
            <p>Each contract progresses through all three deterministic stages before PayPal disbursement.</p>
          </div>
          <span class="tag">${contractsList.length} Contracts</span>
        </div>
        <div class="contracts-container" style="margin-top:12px">
          ${contractCards || '<div class="empty-state"><p>Loading live contracts from backend...</p></div>'}
        </div>
      </section>

      <div class="workflow-layout">
        <div class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">Create New Milestone Escrow</span>
                <h2 style="margin-top:5px">Configure Bounty & Acceptance Gate</h2>
                <p>Define bounty criteria, funding amount, and GitHub pull request reference.</p>
              </div>
              <span class="tag">Smart Escrow Gate</span>
            </div>
            <div class="form-grid">
              <div class="form-field full">
                <label for="escrow-dev-name">Developer GitHub Handle / Name</label>
                <input id="escrow-dev-name" type="text" placeholder="e.g. Liam Zhang (@lzhang-eng)">
              </div>
              <div class="form-field">
                <label for="escrow-bounty-title">Bounty Deliverable Title</label>
                <input id="escrow-bounty-title" type="text" placeholder="e.g. Distributed State Sync Driver">
              </div>
              <div class="form-field">
                <label for="escrow-amount">Bounty Escrow Amount · USD</label>
                <input id="escrow-amount" type="number" min="0" step="0.01" placeholder="2000.00">
              </div>
              <div class="form-field full">
                <label for="escrow-milestone">Milestone Identifier</label>
                <input id="escrow-milestone" data-escrow-field="milestone" value="${esc(e.milestone)}" placeholder="e.g. Milestone 1: Core API Delivery">
              </div>
              <div class="form-field full">
                <label for="escrow-criteria">Acceptance Criteria</label>
                <textarea id="escrow-criteria" data-escrow-field="criteria" placeholder="Define verifiable requirements (e.g. all 42 automated tests passing, zero regression)">${esc(e.criteria)}</textarea>
              </div>
              <div class="form-field full">
                <label for="escrow-evidence">Stage 1: GitHub Commit / Pull-Request Evidence Reference</label>
                <input id="escrow-evidence" data-escrow-field="evidence" value="${esc(e.evidence)}" placeholder="https://github.com/mandate/core/pull/142">
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; margin-top:13px">
              <button class="btn btn-primary" data-action="create-new-escrow-contract" type="button">
                + Lock Funds in Escrow Contract
              </button>
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">3-Stage Gate Overview</span>
                <h2 style="margin-top:5px">Custody Protection</h2>
                <p>Triple verification required before release.</p>
              </div>
              <span class="status-pill approved">Guarded</span>
            </div>
            <div class="workflow-step">
              <span class="step-number">1</span>
              <div>
                <strong>Stage 1: Evidence Reference</strong>
                <small>Validates commit hashes, test passing runs, and PR against contract terms.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">2</span>
              <div>
                <strong>Stage 2: Human Authorisation</strong>
                <small>Lead engineering reviewer audits code quality and provides formal sign-off.</small>
              </div>
            </div>
            <div class="workflow-step">
              <span class="step-number">3</span>
              <div>
                <strong>Stage 3: PayPal Checkout</strong>
                <small>Disburses bounty funds directly via PayPal Sandbox payment orders.</small>
              </div>
            </div>
          </section>
        </aside>
      </div>`;
  }

  function renderPrivacy() {
    return `${pageHeader("Privacy policy", "Information handling, telemetry processing, and security practices for the Mandate console.", "Compliance and data protection")}
      <div class="legal-card">
        <div class="legal-badge-row">
          <span class="status-pill approved">Active Policy</span>
          <span class="tag">Last Updated: October 2026</span>
          <span class="tag">GDPR &amp; CCPA Aligned</span>
          <span class="tag">PayPal Sandbox Rail Compliant</span>
        </div>
        <h2>1. Overview and Scope</h2>
        <p>Mandate operates an autonomous financial operations and governance console designed to establish policy guardrails, spend mandates, and execution gates for autonomous software agents. This Privacy Policy describes how data is received, processed, and protected when accessing and utilizing the platform.</p>
        
        <h2>2. Categories of Information Processed</h2>
        <p>To evaluate guardrails and execute authorized transactions, Mandate processes the following data categories:</p>
        <ul>
          <li><strong>Agent Identifiers &amp; Mandates:</strong> Agent names, operational purposes, allocated budget ceilings, reset cycles, and merchant allowlists.</li>
          <li><strong>Transaction Telemetry:</strong> Requested transaction amounts, merchant domains, spend categories, timestamps, and guardrail decision audit records.</li>
          <li><strong>Financial &amp; Rail Credentials:</strong> PayPal client identifiers and environment configurations necessary for API authentication. Live secrets are stored exclusively in local environment configuration and are never transmitted to external third parties.</li>
          <li><strong>Operational Artifacts:</strong> Supplier invoices, purchase orders, milestone fulfillment references, and itemized split line items provided directly by operators.</li>
        </ul>

        <h2>3. Purpose and Legal Basis for Processing</h2>
        <p>Data is processed strictly for the performance of financial policy verification and transaction settlement:</p>
        <ul>
          <li>Enforcing budget limits, per-transaction ceilings, and merchant whitelists prior to payment initiation.</li>
          <li>Routing exceptions exceeding policy thresholds to authorized human reviewers.</li>
          <li>Interfacing with payment networks (including PayPal sandbox and live rails) upon verified operator authorization.</li>
          <li>Maintaining immutable audit logs for regulatory and governance compliance.</li>
        </ul>

        <h2>4. Data Minimization &amp; Local Containment</h2>
        <p>Mandate adheres to strict data minimization principles. Operational telemetry and temporary drafting sessions are maintained locally in browser storage and customer-hosted backend instances. Mandate does not sell, rent, monetize, or harvest customer financial data.</p>

        <h2>5. Security Safeguards</h2>
        <p>All platform communication utilizes Transport Layer Security (TLS 1.3). Cryptographic hashing and deterministic validation verify mandate integrity. Administrative endpoints require explicit operator credentials.</p>

        <h2>6. Operator Rights &amp; Data Control</h2>
        <p>Operators maintain complete autonomy over their data. Through the platform console, operators may at any time inspect audit trails, export ledger histories, or execute a complete clean slate wipe of all stored records and mandates.</p>
      </div>`;
  }

  function renderTerms() {
    return `${pageHeader("Terms and conditions", "Operating rules, agent governance responsibilities, and commercial terms of service.", "Legal agreement")}
      <div class="legal-card">
        <div class="legal-badge-row">
          <span class="status-pill approved">Version 2.4</span>
          <span class="tag">Effective: October 2026</span>
          <span class="tag">Fintech Governance Standard</span>
        </div>
        <h2>1. Acceptance of Terms</h2>
        <p>By deploying, accessing, or configuring the Mandate console, you agree to be bound by these Terms and Conditions. If you are operating the platform on behalf of an enterprise or entity, you represent and warrant that you hold the requisite authority to bind such entity.</p>

        <h2>2. Autonomous Agent Governance &amp; Operator Responsibility</h2>
        <p>Mandate provides governance software enabling operators to define parameters, constraints, and approval workflows for autonomous agents. Operators acknowledge and agree that:</p>
        <ul>
          <li>The operator retains full responsibility for configuring appropriate budget caps, merchant allowlists, and review thresholds.</li>
          <li>Mandate enforces deterministic policy rules as defined by the operator. Transactions meeting all defined criteria will be authorized for execution.</li>
          <li>Payments exceeding review thresholds or violating policy bounds will be held in the Approvals queue or blocked in accordance with configured rules.</li>
        </ul>

        <h2>3. Payment Rail Integration &amp; Sandbox Operations</h2>
        <p>The platform facilitates direct integration with the PayPal developer rail and payment processing APIs. When operating in sandbox mode, all transactions represent verified API simulations without actual money movement. When live payment credentials are configured, executed payments commit real funds in accordance with the underlying payment processor's terms.</p>

        <h2>4. Acceptable Use Policy</h2>
        <p>Operators shall not utilize the platform for unlawful financial activities, unauthorized fund transfers, evasion of sanctions, or transactions involving prohibited merchants. Mandate reserves the right to terminate access or enforce automated policy locks upon detection of malicious operations.</p>

        <h2>5. Limitation of Liability &amp; Disclaimers</h2>
        <p>Mandate provides the software console on an as-is and as-available basis. To the maximum extent permitted by applicable law, Mandate shall not be liable for indirect, incidental, or consequential damages resulting from autonomous agent spend decisions, third-party rail downtime, or misconfigured mandate limits.</p>

        <h2>6. Governing Law &amp; Severability</h2>
        <p>These terms shall be governed by and construed in accordance with applicable commercial laws. If any provision of these terms is deemed unenforceable, the remaining provisions shall remain in full force and effect.</p>
      </div>`;
  }

  window.MANDATE_APP = {
    get state() { return state; },
    setState(next) { state = next; },
    reset() { state = initialState(); },
    render, persist, navigate, toast, fairTotals, fairSummaryHtml,
    initialState, routes: ROUTES, data: D, ICONS
  };

  // Real-time synchronization with Express backend via SSE stream
  if (window.MANDATE_API) {
    if (typeof window.MANDATE_API.subscribe === "function") {
      window.MANDATE_API.subscribe((type, data) => {
        let needsRender = false;
        if (type === "init") {
          if (Array.isArray(data.mandates) && data.mandates.length > 0) {
            state.mandates = data.mandates;
            needsRender = true;
          } else if (Array.isArray(state.mandates) && state.mandates.length > 0) {
            state.mandates.forEach((m) => {
              window.MANDATE_API.createMandate(m).catch(() => {});
            });
          }
          if (Array.isArray(data.approvals)) {
            state.approvals = data.approvals;
            needsRender = true;
          }
          if (Array.isArray(data.auditLog) && data.auditLog.length > 0) {
            state.activity = data.auditLog.map((entry) => ({
              id: entry.id,
              title: `${entry.details?.merchant || entry.action} - ${entry.decision}`,
              merchant: entry.details?.merchant || entry.action,
              amount: Number(entry.details?.amount) || 0,
              agent: entry.details?.mandateId || "Policy engine",
              status: entry.decision === "approved" ? "approved" : entry.decision === "blocked" ? "blocked" : "review",
              decision: entry.reason,
            }));
            needsRender = true;
          }
          if (Array.isArray(data.cfoInvoices) && data.cfoInvoices.length > 0) {
            state.cfo = state.cfo || {};
            state.cfo.invoices = data.cfoInvoices;
            needsRender = true;
          }
          if (Array.isArray(data.triageQueue) && data.triageQueue.length > 0) {
            state.triage = state.triage || {};
            state.triage.queue = data.triageQueue;
            needsRender = true;
          }
          if (Array.isArray(data.inventoryStore) && data.inventoryStore.length > 0) {
            state.inventory = state.inventory || {};
            state.inventory.items = data.inventoryStore;
            if (!state.inventory.sku) {
              const first = data.inventoryStore[0];
              state.inventory.sku = first.sku;
              state.inventory.item = first.item;
              state.inventory.stock = String(first.stock);
              state.inventory.threshold = String(first.threshold);
              state.inventory.supplierA = first.supplierA || "";
              state.inventory.priceA = String(first.priceA || "");
              state.inventory.daysA = String(first.daysA || "");
              state.inventory.supplierB = first.supplierB || "";
              state.inventory.priceB = String(first.priceB || "");
              state.inventory.daysB = String(first.daysB || "");
            }
            needsRender = true;
          }
          if (Array.isArray(data.escrowContracts) && data.escrowContracts.length > 0) {
            state.escrow = state.escrow || {};
            state.escrow.contracts = data.escrowContracts;
            needsRender = true;
          }
          if (Array.isArray(data.procurementScans) && data.procurementScans.length > 0) {
            state.procurement = state.procurement || {};
            state.procurement.scans = data.procurementScans;
            needsRender = true;
          }
          if (data.fxRates && data.fxRates.rates) {
            state.cfo = state.cfo || {};
            state.cfo.liveRates = data.fxRates.rates;
            state.cfo.rateProvider = data.fxRates.provider;
            needsRender = true;
          }
          if (data.dashboard) {
            state._dashLatency = data.dashboard.settlementLatency || "0.00s";
            needsRender = true;
          }
        } else if (type === "mandate_created" || type === "mandate_updated") {
          const idx = state.mandates.findIndex((m) => m.id === data.id);
          if (idx >= 0) {
            state.mandates[idx] = data;
          } else {
            data._highlight = true;
            setTimeout(() => { delete data._highlight; render(); }, 3500);
            state.mandates.unshift(data);
          }
          persist();
          needsRender = true;
        } else if (type === "mandate_deleted") {
          state.mandates = state.mandates.filter((m) => m.id !== data.id);
          persist();
          needsRender = true;
        } else if (type === "approval_created" || type === "approval_updated") {
          const idx = state.approvals.findIndex((a) => a.id === data.id);
          if (idx >= 0) {
            state.approvals[idx] = data;
          } else {
            state.approvals.unshift(data);
          }
          needsRender = true;
        } else if (type === "audit_entry") {
          const newAct = {
            id: data.id,
            title: `${data.details?.merchant || data.action} - ${data.decision}`,
            merchant: data.details?.merchant || data.action,
            amount: Number(data.details?.amount) || 0,
            agent: data.details?.mandateId || "Policy engine",
            status: data.decision === "approved" ? "approved" : data.decision === "blocked" ? "blocked" : "review",
            decision: data.reason,
          };
          if (!state.activity.some((a) => a.id === newAct.id)) {
            state.activity.unshift(newAct);
            if (state.activity.length > 80) state.activity.pop();
            needsRender = true;
          }
        } else if (type === "invoice_created") {
          state.cfo = state.cfo || {};
          state.cfo.invoices = state.cfo.invoices || [];
          if (!state.cfo.invoices.some((i) => i.id === data.id)) {
            state.cfo.invoices.unshift(data);
            needsRender = true;
          }
        } else if (type === "domain_updated") {
          if (data && data.domain) {
            // Update domain label in topbar if visible
            const domainLabel = document.getElementById("topbar-domain-label");
            if (domainLabel) domainLabel.textContent = data.domain;
            try { localStorage.setItem("mandate_custom_domain", data.domain); } catch (_) {}
          }
        } else if (type === "dashboard") {
          if (data && data.settlementLatency) {
            state._dashLatency = data.settlementLatency;
          }
          needsRender = true;
        } else if (type === "triage_created") {
          state.triage = state.triage || { queue: [] };
          state.triage.queue = state.triage.queue || [];
          if (!state.triage.queue.some((t) => t.id === data.id)) {
            state.triage.queue.unshift(data);
          }
          needsRender = true;
        } else if (type === "triage_updated") {
          state.triage = state.triage || { queue: [] };
          state.triage.queue = state.triage.queue || [];
          const idx = state.triage.queue.findIndex((t) => t.id === data.id);
          if (idx >= 0) {
            state.triage.queue[idx] = data;
          } else {
            state.triage.queue.unshift(data);
          }
          needsRender = true;
        } else if (type === "triage_deleted") {
          state.triage = state.triage || { queue: [] };
          state.triage.queue = (state.triage.queue || []).filter((t) => t.id !== data.id);
          needsRender = true;
        } else if (type === "vitals_tick") {
          state.triage = state.triage || {};
          state.triage.liveVitals = data;
          const hrEl = document.getElementById("live-vitals-hr");
          if (hrEl) hrEl.textContent = `${data.hr} bpm`;
          const bpEl = document.getElementById("live-vitals-bp");
          if (bpEl) bpEl.textContent = data.bp;
          const spo2El = document.getElementById("live-vitals-spo2");
          if (spo2El) spo2El.textContent = `${data.spo2}%`;
          const tempEl = document.getElementById("live-vitals-temp");
          if (tempEl) tempEl.textContent = `${data.temp}°F`;
        } else if (type === "paypal_status") {
          const badge = document.getElementById("paypal-status-badge");
          if (badge) {
            if (data.connected) {
              badge.innerHTML = `<span class="status-dot" style="background:#003087; box-shadow:0 0 0 3px #00308740; animation: pulse 2s infinite"></span>PayPal ✓ Connected`;
              badge.style.color = "#003087";
            } else {
              badge.innerHTML = `<span class="status-dot" style="background:#f59e0b"></span>PayPal Simulated`;
              badge.style.color = "";
            }
          }
        } else if (type === "inventory_updated") {
          state.inventory = state.inventory || {};
          state.inventory.items = state.inventory.items || [];
          const idx = state.inventory.items.findIndex((it) => it.id === data.id || it.sku === data.sku);
          if (idx >= 0) {
            state.inventory.items[idx] = data;
          } else {
            state.inventory.items.unshift(data);
          }
          if (state.inventory.sku === data.sku) {
            state.inventory.stock = String(data.stock);
          }
          needsRender = true;
        } else if (type === "escrow_updated") {
          state.escrow = state.escrow || {};
          state.escrow.contracts = state.escrow.contracts || [];
          const idx = state.escrow.contracts.findIndex((c) => c.id === data.id);
          if (idx >= 0) {
            state.escrow.contracts[idx] = data;
          } else {
            state.escrow.contracts.unshift(data);
          }
          needsRender = true;
        } else if (type === "vault_updated") {
          if (data && (data.defaultVault !== undefined || data.currentVault !== undefined)) {
            state.defaultVault = data.defaultVault || 50000;
            state.vault = data.currentVault !== undefined ? data.currentVault : state.defaultVault;
            needsRender = true;
          }
        } else if (type === "user_authenticated") {
          if (data && data.user) {
            state.currentUser = data.user;
            needsRender = true;
          }
        } else if (type === "procurement_scanned") {
          state.procurement = state.procurement || {};
          state.procurement.scans = state.procurement.scans || [];
          if (!state.procurement.scans.some((sc) => sc.id === data.id)) {
            state.procurement.scans.unshift(data);
          }
          state.procurement.lastScan = data;
          needsRender = true;
        } else if (type === "reset") {
          state = initialState();
          persist();
          needsRender = true;
        }

        if (needsRender) {
          syncChrome();
          render();
        }
      });
    }

    // Initial fallback check & live data synchronization across all tabs
    if (typeof window.MANDATE_API.checkHealth === "function") {
      window.MANDATE_API.checkHealth().then(async (health) => {
        if (health.status === "ok") {
          if (typeof window.MANDATE_API.connectRealtime === "function") {
            window.MANDATE_API.connectRealtime();
          }
          try {
            const [m, a, d, t, inv, esc, sc, rates, vaultData, meData] = await Promise.all([
              typeof window.MANDATE_API.getMandates === "function" ? window.MANDATE_API.getMandates().catch(() => null) : null,
              typeof window.MANDATE_API.getApprovals === "function" ? window.MANDATE_API.getApprovals().catch(() => null) : null,
              typeof window.MANDATE_API.getDashboard === "function" ? window.MANDATE_API.getDashboard().catch(() => null) : null,
              typeof window.MANDATE_API.getTriageQueue === "function" ? window.MANDATE_API.getTriageQueue().catch(() => null) : null,
              typeof window.MANDATE_API.getInventory === "function" ? window.MANDATE_API.getInventory().catch(() => null) : null,
              typeof window.MANDATE_API.getEscrow === "function" ? window.MANDATE_API.getEscrow().catch(() => null) : null,
              typeof window.MANDATE_API.getProcurementScans === "function" ? window.MANDATE_API.getProcurementScans().catch(() => null) : null,
              typeof window.MANDATE_API.getRates === "function" ? window.MANDATE_API.getRates(state.cfo?.sourceCurrency || "USD").catch(() => null) : null,
              typeof window.MANDATE_API.getVault === "function" ? window.MANDATE_API.getVault().catch(() => null) : null,
              typeof window.MANDATE_API.getAuthMe === "function" ? window.MANDATE_API.getAuthMe().catch(() => null) : null,
            ]);
            if (Array.isArray(m) && m.length > 0) state.mandates = m;
            if (Array.isArray(a)) state.approvals = a;
            if (t && Array.isArray(t.queue)) {
              state.triage = state.triage || {};
              state.triage.queue = t.queue;
            }
            if (inv && Array.isArray(inv.items)) {
              state.inventory = state.inventory || {};
              state.inventory.items = inv.items;
              if (!state.inventory.sku && inv.items.length > 0) {
                const first = inv.items[0];
                state.inventory.sku = first.sku;
                state.inventory.item = first.item;
                state.inventory.stock = String(first.stock);
                state.inventory.threshold = String(first.threshold);
                state.inventory.supplierA = first.supplierA || "";
                state.inventory.priceA = String(first.priceA || "");
                state.inventory.daysA = String(first.daysA || "");
                state.inventory.supplierB = first.supplierB || "";
                state.inventory.priceB = String(first.priceB || "");
                state.inventory.daysB = String(first.daysB || "");
              }
            }
            if (esc && Array.isArray(esc.contracts)) {
              state.escrow = state.escrow || {};
              state.escrow.contracts = esc.contracts;
            }
            if (Array.isArray(sc) && sc.length > 0) {
              state.procurement = state.procurement || {};
              state.procurement.scans = sc;
            }
            if (rates && rates.rates) {
              state.cfo = state.cfo || {};
              state.cfo.liveRates = rates.rates;
              state.cfo.rateProvider = rates.provider;
            }
            if (vaultData && vaultData.defaultVault !== undefined) {
              state.defaultVault = vaultData.defaultVault;
              state.vault = vaultData.currentVault;
            }
            if (meData && meData.user) {
              state.currentUser = meData.user;
            }
            if (d && d.settlementLatency) state._dashLatency = d.settlementLatency;
            syncChrome();
            render();
          } catch (_) {}
        }
      }).catch(() => {});
    }
  }

  render();
})();
