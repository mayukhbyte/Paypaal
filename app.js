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
    approvals: [], activity: [],
    fairParticipants: clone(D.fairShare.participants || ["Alice", "Bob", "Charlie", "Dave"]),
    fairItems: clone(D.fairShare.items), fairContext: D.fairShare.context,
    fairReceiptName: "", activityFilter: "all", approvalFilter: "all", mandateFilter: "all",
    procurement: { invoiceRef: "", poRef: "", invoiceLine: "", poLine: "", invoiceQty: "", poQty: "", invoiceTotal: "", poTotal: "", checked: false, approved: false },
    cfo: { messages: [], invoices: [], reconcile: null },
    inventory: { item: "", stock: "", threshold: "", supplierA: "", supplierADays: "", supplierB: "", supplierBDays: "", evaluated: false, approved: false },
    triage: { queue: [], billingTarget: "Patient" },
    escrow: { milestone: "", criteria: "", evidence: "", verified: false, humanApproved: false }
  });

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(D.storageKey) || "null");
      if (!stored || typeof stored !== "object") return initialState();
      const cleanedMandates = (stored.mandates || []).filter((m) => !["mdt-7749", "mdt-9122", "mdt-4431"].includes(m.id));
      const cleanedApprovals = (stored.approvals || []).filter((a) => !["runpod-gpu", "figma-enterprise", "overseas-registrar"].includes(a.id));
      const cleanedActivity = (stored.activity || []).filter((act) => !["aws-scale", "design-assets", "gpu-cluster", "unverified-merchant"].includes(act.id));
      const participants = Array.isArray(stored.fairParticipants) && stored.fairParticipants.length >= 2 ? stored.fairParticipants : clone(D.fairShare.participants || ["Alice", "Bob", "Charlie", "Dave"]);
      return { ...initialState(), ...stored, fairParticipants: participants, mandates: cleanedMandates, approvals: cleanedApprovals, activity: cleanedActivity };
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
    if (route === "approvals" && window.MANDATE_API && window.MANDATE_API.getApprovals) {
      window.MANDATE_API.getApprovals().then((serverApprovals) => {
        if (Array.isArray(serverApprovals) && serverApprovals.length > 0) {
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
      const liveVault = (state.mandates || []).reduce((acc, m) => acc + Math.max(0, (Number(m.limit) || 0) - (Number(m.spent) || 0)), 0);
      headerVault.textContent = formatMoney(liveVault);
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
    const budgetPool = state.mandates.reduce((sum, m) => sum + (Number(m.limit) || 0), 0);
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
    const actions = `<button class="btn btn-primary" data-action="open-mandate" type="button">New mandate</button>`;
    const filter = state.mandateFilter || "all";
    const totalCount = state.mandates.length;
    const highCount = state.mandates.filter((item) => pct(item.spent, item.limit) >= 80).length;
    const autoCount = state.mandates.filter((item) => item.humanApprovalAbove == null).length;
    const list = state.mandates.filter((item) => filter === "all" || (filter === "high" && pct(item.spent, item.limit) >= 80) || (filter === "auto" && item.humanApprovalAbove == null));
    const cards = list.map((item) => {
      const usage = pct(item.spent, item.limit);
      const threshold = item.humanApprovalAbove == null ? "All within cap" : `Above ${money(item.humanApprovalAbove)}`;
      const hasHumanThreshold = item.humanApprovalAbove != null;
      return `<article class="card mandate-card"><div class="mandate-title"><span class="mandate-symbol">${ICONS.shield}</span><div><h2>${esc(item.name)}</h2><p>ID: ${esc(item.id)} · ${esc(item.description || "Scoped spend mandate")}</p></div><span class="status-pill ${item.status === "active" ? "approved" : "blocked"}">${esc(item.status)}</span></div><div class="utilization-block"><div class="utilization-top"><div><small>Monthly spend cap</small><div><strong>${wholeMoney(item.spent)} <span>/ ${wholeMoney(item.limit)}</span></strong></div></div><span class="tag">${usage.toFixed(0)}%</span></div><div class="utilization-track ${usage >= 80 ? "warning" : ""}"><span style="width:${usage}%"></span></div><div class="utilization-foot"><span>${wholeMoney(Math.max(0, item.limit - item.spent))} runway left</span><span>${esc(item.reset || "Monthly cycle")}</span></div></div><div class="mandate-specs"><div class="spec-box"><small>Per-transaction cap</small><strong>${money(item.perTransaction)}</strong></div><div class="spec-box"><small>Human approval</small><strong>${esc(threshold)}</strong></div></div><div><span class="card-kicker">Authorized merchants</span><div class="merchant-list" style="margin-top:7px">${(item.merchants || []).map((merchant) => `<span class="merchant-chip">${esc(merchant)}</span>`).join("")}</div>${item.categories?.length ? `<span class="card-kicker" style="display:block;margin-top:10px">Authorized categories</span><div class="merchant-list" style="margin-top:7px">${item.categories.map((category) => `<span class="merchant-chip">${esc(category)}</span>`).join("")}</div>` : ""}</div><div class="mandate-bottom"><div><small>${hasHumanThreshold ? "Escalates above the human-review threshold" : "Auto-approves within the scoped caps"}</small><small>${item.expiry ? `Expires ${esc(item.expiry)}` : "No expiry set"}</small>${item.fundingSource ? `<small>Funding: ${esc(item.fundingSource)}</small>` : ""}</div><div style="display:flex; gap:8px"><button class="btn btn-secondary btn-sm" data-action="simulate-mandate-payment" data-id="${esc(item.id)}" type="button" title="Test agent spending against this mandate">Test payment</button><button class="link-button" data-action="toggle-mandate" data-id="${esc(item.id)}" type="button">${item.status === "active" ? "Pause" : "Resume"}</button></div></div></article>`;
    }).join("");

    return `${pageHeader("Agent spend firewall", "Configure bounded mandates with per-transaction caps, merchant allowlists, and review thresholds verified before PayPal settlement.", "Guardrails and scoped authority", actions)}
      <div class="trust-banner"><span class="trust-icon">${ICONS.check}</span><div class="trust-copy"><strong>${totalCount} active agent mandate${totalCount === 1 ? "" : "s"} configured</strong><span>${totalCount > 0 ? "Every agent spend proposal is checked against its mandate before PayPal settlement." : "No mandates configured yet. Create a mandate to establish scoped authority for an agent."}</span></div><span class="status-pill approved">Policy active</span></div>
      <div class="filter-row" role="group" aria-label="Filter mandates"><button class="filter-chip ${filter === "all" ? "active" : ""}" data-mandate-filter="all" type="button">All active (${totalCount})</button><button class="filter-chip ${filter === "high" ? "active" : ""}" data-mandate-filter="high" type="button">High utilization (${highCount})</button><button class="filter-chip ${filter === "auto" ? "active" : ""}" data-mandate-filter="auto" type="button">Auto-approving (${autoCount})</button></div>
      <div class="mandate-grid">${cards || `<div class="card empty-state" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center;"><span class="empty-symbol" style="display:inline-block; margin-bottom:12px; color:var(--blue)">${ICONS.shield}</span><h3 style="font-size:19px; margin-bottom:8px">No spend mandates created yet</h3><p style="color:var(--muted); max-width:500px; margin:0 auto 22px; font-size:13px; line-height:1.6">Establish boundaries before deploying autonomous agents. Define budget caps, authorized merchants, and approval thresholds.</p><button class="btn btn-primary" data-action="open-mandate" type="button" style="padding:0 20px; font-size:13px">Create your first mandate</button></div>`}</div>
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

  function renderDisputes() {
    const c = state.dispute || (state.dispute = { transactionRef: "", shippingEvidence: "", draft: "" });
    const draft = c.draft || "Rebuttal draft will generate in real time as transaction reference and shipping evidence are entered.";
    return `${pageHeader("Dispute operations", "Compile transaction history and fulfillment evidence for automated rebuttal generation and PayPal dispute resolution.", "Merchant protection and evidence management")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.arrowUpRight}</span><div class="trust-copy"><strong>Active dispute case · 88% estimated seller win rate</strong><span>Evidence package evaluated against PayPal Seller Protection criteria.</span></div><span class="sandbox-tag">Review required</span></div>
      <div class="workflow-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Evidence intake</span><h2 style="margin-top:5px">Assemble the case record</h2><p>Enter the transaction reference and fulfillment evidence to support the merchant response.</p></div><span class="tag">Evidence Ledger</span></div><div class="form-grid"><div class="form-field full"><label for="dispute-ref">Transaction reference</label><input id="dispute-ref" type="text" data-dispute-field="transactionRef" value="${esc(c.transactionRef)}" placeholder="Transaction ID or PayPal Order ID"><span class="form-hint">Type any reference: updates response draft in real time.</span></div><div class="form-field full"><label for="dispute-shipping">Shipping or delivery confirmation</label><textarea id="dispute-shipping" data-dispute-field="shippingEvidence" placeholder="Tracking numbers, carrier verification, proof of electronic delivery">${esc(c.shippingEvidence)}</textarea></div></div><div class="evidence-grid" style="margin-top:13px"><div class="evidence-tile"><strong>Transaction record</strong><small id="dispute-ref-status">${c.transactionRef ? `Reference: ${esc(c.transactionRef)}` : "Awaiting transaction reference."}</small></div><div class="evidence-tile"><strong>Fulfillment record</strong><small id="dispute-ship-status">${c.shippingEvidence ? "Shipping evidence entered." : "Awaiting delivery details."}</small></div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" data-action="prepare-dispute" type="button">Generate rebuttal draft</button></div></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">Response draft</span><h2 style="margin-top:5px">Merchant narrative package</h2><p>Inspect and edit the narrative before submission.</p></div><span class="status-pill review">Human review</span></div><div class="form-field"><label for="dispute-draft">Draft response</label><textarea id="dispute-draft" data-dispute-draft>${esc(draft)}</textarea></div></section></div>
        <aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Case outlook</span><h2 style="margin-top:5px">Estimated recovery</h2><p>Predictive win estimate.</p></div><span class="status-pill approved">88% estimate</span></div><div class="ring-row" style="border-top:0;margin-top:0;padding-top:0"><span class="ring" aria-label="88 percent estimate"></span><div class="ring-copy"><strong>1 active case</strong><span>Seller protection criteria validated from carrier record.</span></div></div><div class="demo-note" style="margin-top:14px"><span>${ICONS.info}</span><div><strong>Fulfillment validation</strong>All carrier records must verify delivery to the confirmed buyer address before final filing.</div></div></section><section class="card"><div class="card-heading"><div><span class="card-kicker">Decision path</span><h2 style="margin-top:5px">Retrieve, verify, submit</h2></div></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Retrieve records</strong><small>Match PayPal transaction ledger with shipping evidence.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Rebuttal draft</strong><small>Structured narrative compiled for dispute reviewer.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>Merchant filing</strong><small>Authorized operator submits rebuttal to PayPal resolution center.</small></div></div></section></aside></div>`;
  }

  function renderProcurement() {
    const p = state.procurement;
    const hasTotals = p.invoiceTotal !== "" && p.poTotal !== "";
    const variance = hasTotals ? Math.round((Number(p.invoiceTotal) - Number(p.poTotal)) * 100) / 100 : 0;
    const hasRefs = Boolean(p.invoiceRef?.trim() && p.poRef?.trim());
    const hasLines = Boolean(p.invoiceLine?.trim() && p.poLine?.trim() && p.invoiceQty !== "" && p.poQty !== "");
    const lineMatch = hasLines && p.invoiceLine.trim().toLowerCase() === p.poLine.trim().toLowerCase() && Number(p.invoiceQty) === Number(p.poQty);
    const match = hasRefs && hasTotals && hasLines && lineMatch && Math.abs(variance) < 0.01;
    const result = !p.checked ? "Enter document references, line items, quantities, and totals to compare." : !hasRefs ? "Anomaly flagged: invoice or purchase-order reference is missing." : !hasLines ? "Anomaly flagged: line item descriptions or quantities are missing." : !lineMatch ? "Anomaly flagged: line item or quantity does not match the purchase order." : !hasTotals ? "Anomaly flagged: document totals missing." : Math.abs(variance) >= 0.01 ? "Anomaly flagged: invoice and purchase-order totals differ." : "Exact match: line items, quantities, and totals agree. Authorized for payout.";
    return `${pageHeader("Procurement reconciliation", "Automated two-way matching between supplier invoices and purchase orders with anomaly detection before payout authorization.", "Supplier controls and payment validation")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.doc}</span><div class="trust-copy"><strong>Invoice : PO match : Anomaly scan : Human-authorized payout</strong><span>Real-time calculation checks totals as you type.</span></div><span class="sandbox-tag">Audit Active</span></div>
      <div class="workflow-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Document intake</span><h2 style="margin-top:5px">Supplier invoice and purchase order</h2><p>Enter references, line items, quantities, and totals for matching.</p></div><span class="tag">Two-way verification</span></div><div class="evidence-grid"><label class="file-drop"><strong>${p.invoiceName ? esc(p.invoiceName) : "Supplier invoice"}</strong><small>PDF or image document</small><input id="supplier-invoice" data-procurement-file="invoiceName" type="file" accept="image/*,.pdf"></label><label class="file-drop"><strong>${p.poName ? esc(p.poName) : "Purchase order"}</strong><small>PDF or image document</small><input id="supplier-po" data-procurement-file="poName" type="file" accept="image/*,.pdf"></label></div><div class="form-grid" style="margin-top:14px"><div class="form-field"><label for="invoice-ref">Invoice reference</label><input id="invoice-ref" data-procurement-field="invoiceRef" value="${esc(p.invoiceRef)}" placeholder="INV-2026-001"></div><div class="form-field"><label for="po-ref">Purchase-order reference</label><input id="po-ref" data-procurement-field="poRef" value="${esc(p.poRef)}" placeholder="PO-8841"></div><div class="form-field"><label for="invoice-line">Invoice line description</label><input id="invoice-line" data-procurement-field="invoiceLine" value="${esc(p.invoiceLine)}" placeholder="Cloud compute hours"></div><div class="form-field"><label for="po-line">PO line description</label><input id="po-line" data-procurement-field="poLine" value="${esc(p.poLine)}" placeholder="Cloud compute hours"></div><div class="form-field"><label for="invoice-qty">Invoice quantity</label><input id="invoice-qty" type="number" min="0" step="0.01" data-procurement-field="invoiceQty" value="${esc(p.invoiceQty)}" placeholder="10"></div><div class="form-field"><label for="po-qty">PO quantity</label><input id="po-qty" type="number" min="0" step="0.01" data-procurement-field="poQty" value="${esc(p.poQty)}" placeholder="10"></div><div class="form-field"><label for="invoice-total">Invoice total · USD</label><input id="invoice-total" type="number" min="0" step="0.01" data-procurement-field="invoiceTotal" value="${esc(p.invoiceTotal)}" placeholder="1500.00"></div><div class="form-field"><label for="po-total">PO approved total · USD</label><input id="po-total" type="number" min="0" step="0.01" data-procurement-field="poTotal" value="${esc(p.poTotal)}" placeholder="1500.00"></div></div><button class="btn btn-primary" style="margin-top:14px" data-action="compare-procurement" type="button">Run comparison scan</button></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">Reconciliation status</span><h2 style="margin-top:5px">Automated anomaly scan</h2></div><span class="status-pill ${!p.checked ? "review" : match ? "approved" : "blocked"}" id="procurement-pill">${!p.checked ? "Awaiting input" : match ? "Verified Match" : "Discrepancy"}</span></div><p id="procurement-result-text" style="font-size:11px;line-height:1.5;color:var(--muted)">${esc(result)}</p><div id="procurement-token-area">${p.checked && hasTotals ? `<div class="preview-token" style="margin-top:10px"><span>Invoice ${money(p.invoiceTotal)} · PO ${money(p.poTotal)}</span><strong>${variance === 0 ? "Variance $0.00" : `Variance ${money(variance)}`}</strong></div>` : ""}${p.checked && hasLines ? `<div class="preview-token" style="margin-top:8px"><span>${esc(p.invoiceLine)} · qty ${esc(p.invoiceQty)}</span><strong>${lineMatch ? "Line matched" : "Line mismatch"}</strong></div>` : ""}</div></section></div>
      <aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Authorization gate</span><h2 style="margin-top:5px">Payout release</h2><p>Discrepancies keep payment locked.</p></div><span class="metric-icon green">${ICONS.check}</span></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Verify matched totals</strong><small>Invoice and approved PO amounts must reconcile.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Human sign-off</strong><small>Approval unlocked exclusively upon verified match.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>PayPal Payouts</strong><small>Funds dispatched securely to supplier account.</small></div></div><div style="display:grid;gap:8px;margin-top:13px"><button class="btn btn-secondary" id="procurement-approve-btn" data-action="approve-procurement" type="button" ${!p.checked || !match || p.approved ? "disabled" : ""}>${p.approved ? "Human approval recorded" : "Authorize matched invoice"}</button><button class="btn btn-primary" id="procurement-pay-btn" data-action="simulate-procurement-payout" type="button" ${!p.approved ? "disabled" : ""}>Dispatch PayPal Payout</button></div></section></aside></div>`;
  }

  function renderCfo() {
    const c = state.cfo;
    const messages = c.messages.length ? c.messages.map((message) => `<div class="chat-bubble ${message.role === "user" ? "user" : ""}">${esc(message.text)}</div>`).join("") : `<div class="chat-bubble">I monitor receivables, prepare structured invoices, and calculate multi-currency conversion rates in real time.</div>`;
    const invoices = c.invoices.length ? c.invoices.map((item, index) => `<div class="activity-row"><span class="activity-icon">${ICONS.doc}</span><div class="activity-main"><strong>${esc(item.client || "Client")}</strong><small>${esc(item.currency)} invoice · ${esc(item.status || "Draft")}</small></div><div class="activity-meta"><span class="activity-amount">${money(item.amount)} ${esc(item.currency)}</span><button class="link-button" data-action="chase-invoice" data-index="${index}" type="button">Draft reminder</button></div></div>`).join("") : `<div class="empty-state"><span class="empty-symbol">${ICONS.doc}</span><strong>No receivables created</strong><p>Create an invoice below to track outstanding client balances.</p></div>`;
    const reconcile = c.reconcile;
    return `${pageHeader("Freelancer CFO", "Receivables management, client invoice generation, payment reminders, and multi-currency reconciliation.", "Freelancer treasury management")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.chat}</span><div class="trust-copy"><strong>Autonomous financial management : invoices, follow-ups, currency conversion</strong><span>Real-time calculation updates currency math as you type.</span></div><span class="sandbox-tag">Treasury Active</span></div>
      <div class="chat-layout"><section class="card chat-panel"><div class="card-heading"><div><span class="card-kicker">Conversational workspace</span><h2 style="margin-top:5px">Treasury Assistant</h2><p>Draft client follow-ups and review account runway.</p></div><span class="status-pill approved">Online</span></div><div class="chat-messages" id="cfo-messages">${messages}</div><div class="chat-compose"><input id="cfo-chat-input" type="text" placeholder="Type a prompt (e.g. remind client about overdue invoice)" aria-label="Message the CFO"><button class="btn btn-primary btn-sm" data-action="send-cfo" type="button">Send</button></div></section>
        <div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Receivables intake</span><h2 style="margin-top:5px">Create invoice</h2><p>Specify client and billable amount.</p></div></div><div class="form-grid"><div class="form-field full"><label for="cfo-client">Client or business</label><input id="cfo-client" type="text" data-cfo-field="client" placeholder="Acme Studios"></div><div class="form-field"><label for="cfo-amount">Amount</label><input id="cfo-amount" type="number" min="0" step="0.01" data-cfo-field="amount" placeholder="0.00"></div><div class="form-field"><label for="cfo-currency">Currency</label><select id="cfo-currency" data-cfo-field="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>INR</option></select></div></div><button class="btn btn-primary" style="margin-top:12px" data-action="create-invoice" type="button">Save invoice draft</button></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">Active receivables</span><h2 style="margin-top:5px">Outstanding invoices</h2></div><span class="tag">${c.invoices.length} invoices</span></div><div class="activity-list">${invoices}</div></section></div></div>
      <section class="card" style="margin-top:14px"><div class="card-heading"><div><span class="card-kicker">Cross-currency ledger</span><h2 style="margin-top:5px">Currency conversion preview</h2><p>Real-time calculation updates on every keystroke.</p></div><span class="tag">Live conversion</span></div><div class="form-grid"><div class="form-field"><label for="reconcile-amount">Received amount</label><input id="reconcile-amount" type="number" min="0" step="0.01" data-reconcile="amount" placeholder="0.00"></div><div class="form-field"><label for="reconcile-from">Source currency</label><select id="reconcile-from" data-reconcile="from"><option>EUR</option><option>USD</option><option>GBP</option><option>CAD</option><option>AUD</option><option>INR</option></select></div><div class="form-field"><label for="reconcile-rate">Exchange rate (target units per 1 source)</label><input id="reconcile-rate" type="number" min="0" step="0.0001" data-reconcile="rate" placeholder="e.g. 1.0850"></div><div class="form-field"><label for="reconcile-to">Target currency</label><select id="reconcile-to" data-reconcile="to"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option><option>INR</option></select></div></div><div class="preview-token" id="reconcile-result" style="margin-top:12px">${reconcile ? `${money(reconcile.amount)} ${esc(reconcile.from)} × ${esc(reconcile.rate)} = ${money(reconcile.converted)} ${esc(reconcile.to)}` : "Type an amount and rate above to preview converted total in real time."}</div><button class="btn btn-secondary btn-sm" style="margin-top:11px" data-action="reconcile" type="button">Compute conversion</button></section>`;
  }

  function renderInventory() {
    const i = state.inventory;
    const hasStock = i.stock !== "" && i.threshold !== "";
    const low = hasStock && Number(i.stock) <= Number(i.threshold);
    const quotes = [
      { name: i.supplierA, price: Number(i.priceA), days: Number(i.daysA) },
      { name: i.supplierB, price: Number(i.priceB), days: Number(i.daysB) }
    ].filter((quote) => quote.name && Number.isFinite(quote.price) && quote.price >= 0 && Number.isFinite(quote.days) && quote.days >= 0).sort((a, b) => a.price - b.price || a.days - b.days);
    const best = quotes[0];
    return `${pageHeader("Autonomous inventory agent", "Hardware telemetry monitoring with automated supplier quote comparison and human approval gates before purchase.", "Inventory automation and restock controls")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.grid}</span><div class="trust-copy"><strong>Sensor trigger : Supplier comparison : Human authorization : Checkout</strong><span>Live restock trigger calculates on every keystroke.</span></div><span class="sandbox-tag">Hardware Active</span></div>
      <div class="workflow-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Hardware telemetry</span><h2 style="margin-top:5px">Stock threshold monitor</h2><p>Telemetry values evaluate low-stock triggers in real time.</p></div><span class="status-pill ${low ? 'blocked' : 'approved'}" id="inventory-status-pill">${hasStock ? (low ? 'Low Stock Triggered' : 'Normal Stock') : 'Awaiting data'}</span></div><div class="vitals-grid"><div class="vital-box"><small>Item / SKU</small><input class="inline-input" data-inventory-field="item" value="${esc(i.item)}" placeholder="e.g. Servo Motors"></div><div class="vital-box"><small>Current stock</small><input class="inline-input" type="number" min="0" data-inventory-field="stock" value="${esc(i.stock)}" placeholder="0"></div><div class="vital-box"><small>Reorder threshold</small><input class="inline-input" type="number" min="0" data-inventory-field="threshold" value="${esc(i.threshold)}" placeholder="0"></div></div><div style="display:flex;justify-content:flex-end;margin-top:13px"><button class="btn btn-secondary" data-action="evaluate-inventory" type="button">Evaluate restock trigger</button></div><div class="demo-note" style="margin-top:12px"><span>${ICONS.info}</span><div><strong id="inventory-trigger-heading">${hasStock ? (low ? "Low-stock trigger met" : "Stock level sufficient") : "Enter stock values"}</strong><span id="inventory-trigger-desc">${hasStock ? (low ? "Current stock is below threshold. Review supplier offers before authorizing checkout." : "Stock is above reorder threshold. No purchase required.") : "Telemetry updates on every keystroke."}</span></div></div></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">Supplier comparison</span><h2 style="margin-top:5px">Price and delivery evaluation</h2><p>Quotes evaluate in real time. Lowest price breaks ties by delivery time.</p></div><span class="tag" id="inventory-quote-count">${quotes.length} quotes</span></div><div class="form-grid"><div class="form-field"><label for="supplier-a">Supplier A</label><input id="supplier-a" data-inventory-field="supplierA" value="${esc(i.supplierA)}" placeholder="e.g. DigiKey"></div><div class="form-field"><label for="price-a">Quote · USD</label><input id="price-a" data-inventory-field="priceA" type="number" min="0" step="0.01" value="${esc(i.priceA || "")}" placeholder="0.00"></div><div class="form-field"><label for="days-a">Delivery time · days</label><input id="days-a" data-inventory-field="daysA" type="number" min="0" step="1" value="${esc(i.daysA || "")}" placeholder="0"></div><div class="form-field"><label for="supplier-b">Supplier B</label><input id="supplier-b" data-inventory-field="supplierB" value="${esc(i.supplierB)}" placeholder="e.g. Mouser"></div><div class="form-field"><label for="price-b">Quote · USD</label><input id="price-b" data-inventory-field="priceB" type="number" min="0" step="0.01" value="${esc(i.priceB || "")}" placeholder="0.00"></div><div class="form-field"><label for="days-b">Delivery time · days</label><input id="days-b" data-inventory-field="daysB" type="number" min="0" step="1" value="${esc(i.daysB || "")}" placeholder="0"></div></div><div class="preview-token" id="inventory-best-token" style="margin-top:12px">${best ? `Optimal offer: ${esc(best.name)} · ${money(best.price)} · ${best.days} days delivery` : "Enter supplier names, quotes, and delivery times to compare in real time."}</div></section></div>
      <aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Human checkpoint</span><h2 style="margin-top:5px">Authorize order</h2><p>Agent prepares recommendation for human sign-off.</p></div><span class="metric-icon amber">${ICONS.alert}</span></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Stock depletion check</strong><small>Calculated in real time from entered inventory.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Compare supplier offers</strong><small>Lowest total price and shortest delivery lead time.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>Human approval</strong><small>Operator verifies supplier recommendation before purchase.</small></div></div><div style="display:grid;gap:8px;margin-top:14px"><button class="btn btn-secondary" id="inventory-approve-btn" data-action="approve-inventory" type="button" ${!hasStock || !low || !best || i.approved ? "disabled" : ""}>${i.approved ? "Purchase authorized" : "Authorize supplier order"}</button><button class="btn btn-primary" id="inventory-checkout-btn" data-action="inventory-checkout" type="button" ${!i.approved ? "disabled" : ""}>Execute PayPal Checkout</button></div></section></aside></div>`;
  }

  function renderTriage() {
    const t = state.triage;
    const queue = t.queue.map((item, index) => `<div class="activity-row"><span class="activity-icon review">${index + 1}</span><div class="activity-main"><strong>${esc(item.label)}</strong><small>Intake queue · awaiting clinician assessment</small></div><div class="activity-meta"><span class="status-pill review">Clinician Review</span></div></div>`).join("");
    return `${pageHeader("Clinical triage and billing", "Local triage queue management with vital telemetry handoff and automated copay invoice routing.", "Clinical workflow and payment dispatch")}
      <div class="workflow-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Station telemetry</span><h2 style="margin-top:5px">Sensor vitals handoff</h2><p>Local intake queue for clinical review and invoicing.</p></div><span class="status-pill approved">Queue ready</span></div><div class="vitals-grid"><div class="vital-box"><small>Pulse telemetry</small><strong>72 bpm</strong><small>Nominal</small></div><div class="vital-box"><small>Activity index</small><strong>Normal</strong><small>Stable telemetry</small></div><div class="vital-box"><small>Triage tier</small><strong>Standard</strong><small>Clinician sign-off</small></div></div><div class="form-grid" style="margin-top:14px"><div class="form-field"><label for="triage-label">Patient intake reference</label><input id="triage-label" data-triage-label placeholder="e.g. Intake Row 01"></div><div class="form-field"><label for="triage-target">Invoice recipient route</label><select id="triage-target" data-triage-target><option ${t.billingTarget === "Patient" ? "selected" : ""}>Patient</option><option ${t.billingTarget === "Insurer" ? "selected" : ""}>Insurer</option></select></div></div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button class="btn btn-secondary" data-action="add-triage-row" type="button">Add intake record</button><button class="btn btn-primary" data-action="triage-invoice-preview" type="button" ${!t.queue.length ? "disabled" : ""}>Dispatch PayPal Invoice</button></div><div class="demo-note" style="margin-top:12px"><span>${ICONS.info}</span><div><strong>PayPal Invoicing rail</strong>Routes copay billing directly to patient or insurer destination.</div></div></section>
        <section class="card"><div class="card-heading"><div><span class="card-kicker">Intake ledger</span><h2 style="margin-top:5px">Patient queue</h2><p>Intake records pending clinician review.</p></div><span class="tag">${t.queue.length} records</span></div><div class="activity-list">${queue || `<div class="empty-state"><span class="empty-symbol">${ICONS.plus}</span><strong>No records in queue</strong><p>Add an intake record above to manage patient billing.</p></div>`}</div></section></div>
      <aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Clinical boundary</span><h2 style="margin-top:5px">Safety protocol</h2></div><span class="status-pill approved">Protocol Active</span></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Sensor intake</strong><small>Telemetry buffered securely on station.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Clinical assessment</strong><small>Clinician reviews measurements before billing release.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>PayPal Invoicing</strong><small>Copay invoice generated and dispatched.</small></div></div></section></aside></div>`;
  }

  function renderEscrow() {
    const e = state.escrow;
    const hasEvidence = Boolean(String(e.evidence || "").trim());
    const canApprove = Boolean(e.verified && hasEvidence && e.milestone && e.criteria);
    return `${pageHeader("Developer bounty escrow", "Milestone contract verification with code commit audit logs and multi-signature payout release gates.", "Milestone escrow and payout release")}
      <div class="trust-banner"><span class="trust-icon">${ICONS.shield}</span><div class="trust-copy"><strong>Acceptance criteria : Commit evidence verification : Payout release</strong><span>Funds remain locked in escrow until milestone conditions are met.</span></div><span class="sandbox-tag">Escrow Active</span></div>
      <div class="workflow-layout"><div class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Contract milestone</span><h2 style="margin-top:5px">Define acceptance gate</h2><p>Configure bounty milestone conditions and commit evidence.</p></div><span class="tag">Smart escrow</span></div><div class="form-grid"><div class="form-field full"><label for="escrow-milestone">Milestone identifier</label><input id="escrow-milestone" data-escrow-field="milestone" value="${esc(e.milestone)}" placeholder="e.g. Milestone 2: Core API Delivery"></div><div class="form-field full"><label for="escrow-criteria">Acceptance criteria</label><textarea id="escrow-criteria" data-escrow-field="criteria" placeholder="Define verifiable requirements (e.g. all test suites passing, documentation written)">${esc(e.criteria)}</textarea></div><div class="form-field full"><label for="escrow-evidence">GitHub commit or pull-request reference</label><input id="escrow-evidence" data-escrow-field="evidence" value="${esc(e.evidence)}" placeholder="https://github.com/org/repo/pull/42"></div></div><div style="display:flex;justify-content:flex-end;margin-top:13px"><button class="btn btn-secondary" data-action="verify-escrow" type="button">Verify evidence reference</button></div><div class="milestone-track"><div class="milestone-node ${e.verified ? "active" : ""}">1 · Evidence reference</div><div class="milestone-node ${e.humanApproved ? "active" : ""}">2 · Human authorization</div><div class="milestone-node ${e.humanApproved ? "active" : ""}">3 · PayPal Payout</div></div><div class="demo-note"><span>${ICONS.info}</span><div><strong id="escrow-evidence-heading">${e.verified ? "Evidence reference verified" : "Awaiting milestone evidence"}</strong><span>${e.verified ? "Commit reference matches repository contract criteria. Ready for authorization." : "Enter milestone details and GitHub pull-request reference."}</span></div></div></section></div>
        <aside class="stack"><section class="card"><div class="card-heading"><div><span class="card-kicker">Payout release gate</span><h2 style="margin-top:5px">Custody protection</h2><p>Escrow funds cannot be released without explicit authorization.</p></div><span class="status-pill ${e.humanApproved ? "approved" : "review"}">${e.humanApproved ? "Authorized" : "Held in escrow"}</span></div><div class="workflow-step"><span class="step-number">1</span><div><strong>Milestone evaluation</strong><small>Validates commit against contract terms.</small></div></div><div class="workflow-step"><span class="step-number">2</span><div><strong>Human authorization</strong><small>Authorized operator signs off on milestone delivery.</small></div></div><div class="workflow-step"><span class="step-number">3</span><div><strong>PayPal Payouts</strong><small>Releases funds directly to contributor account.</small></div></div><div style="display:grid;gap:8px;margin-top:13px"><button class="btn btn-secondary" data-action="approve-escrow" type="button" ${!canApprove || e.humanApproved ? "disabled" : ""}>${e.humanApproved ? "Milestone approved" : "Authorize bounty payout"}</button><button class="btn btn-primary" data-action="release-escrow" type="button" ${!e.humanApproved ? "disabled" : ""}>Execute PayPal Payout</button></div></section></aside></div>`;
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

  // Sync state with backend if available
  if (window.MANDATE_API && window.MANDATE_API.checkHealth) {
    window.MANDATE_API.checkHealth().then(async (health) => {
      if (health.status === "ok") {
        try {
          const [mandates, approvals, auditResult, invoices, dashboard] = await Promise.all([
            window.MANDATE_API.getMandates().catch(() => null),
            window.MANDATE_API.getApprovals().catch(() => null),
            window.MANDATE_API.getAuditLog({ limit: 200 }).catch(() => null),
            window.MANDATE_API.getInvoices().catch(() => null),
            window.MANDATE_API.getDashboard().catch(() => null),
          ]);
          if (Array.isArray(mandates) && mandates.length > 0) {
            state.mandates = mandates;
          }
          if (Array.isArray(approvals) && approvals.length > 0) {
            state.approvals = approvals;
          } else if (Array.isArray(state.approvals) && state.approvals.length > 0 && window.MANDATE_API.createApproval) {
            state.approvals.forEach((appr) => {
              window.MANDATE_API.createApproval(appr).catch(() => {});
            });
          }
          // Map audit log entries to the activity feed format
          if (auditResult && Array.isArray(auditResult.entries) && auditResult.entries.length > 0) {
            const auditActivity = auditResult.entries.map((entry) => ({
              id: entry.id,
              title: `${entry.details?.merchant || entry.action} - ${entry.decision}`,
              merchant: entry.details?.merchant || entry.action,
              amount: Number(entry.details?.amount) || 0,
              agent: entry.details?.mandateId || "Policy engine",
              status: entry.decision === "approved" ? "approved" : entry.decision === "blocked" ? "blocked" : "review",
              decision: entry.reason,
            }));
            // Merge: server audit entries take precedence, keep locally-added items that aren't in audit
            const serverIds = new Set(auditActivity.map((a) => a.id));
            const localOnly = (state.activity || []).filter((a) => !serverIds.has(a.id));
            state.activity = [...auditActivity, ...localOnly];
          }
          if (Array.isArray(invoices) && invoices.length > 0) {
            state.cfo = state.cfo || {};
            state.cfo.invoices = invoices;
          }
          if (dashboard && typeof dashboard === "object") {
            state._dashLatency = dashboard.settlementLatency || "0.00s";
          }
          syncChrome();
          render();
        } catch (_) {}
      }
    }).catch(() => {});
  }

  render();
})();
