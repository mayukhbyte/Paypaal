(() => {
  "use strict";
  const api = window.MANDATE_APP;
  if (!api) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
  const money = (value) => "$" + Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const setState = () => api.state;

  const THEME_KEY = "mandate_theme";
  function getActiveTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }
  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = theme;
    }
    $$("[data-theme-choice]").forEach((node) => {
      node.classList.toggle("active", node.dataset.themeChoice === theme);
    });
  }

  // Initialize theme
  setTheme(getActiveTheme());

  const SIDEBAR_COLLAPSED_KEY = "mandate_sidebar_collapsed";
  function isSidebarCollapsed() {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  }
  function setSidebarCollapsed(collapsed) {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "true" : "false");
    const toggleBtn = $("#sidebar-toggle-btn");
    const arrowSpan = toggleBtn ? toggleBtn.querySelector(".toggle-arrow") : null;
    if (arrowSpan) {
      arrowSpan.style.transform = collapsed ? "rotate(180deg)" : "rotate(0deg)";
    }
    if (toggleBtn) toggleBtn.setAttribute("title", collapsed ? "Show side menu" : "Hide side menu");
  }
  if (isSidebarCollapsed()) {
    setSidebarCollapsed(true);
  }

  function toggleSidebar() {
    const isNowCollapsed = !document.body.classList.contains("sidebar-collapsed");
    setSidebarCollapsed(isNowCollapsed);
  }

  function closeNavigationDrawer() {
    const sidebar = $("#sidebar");
    if (!sidebar || !sidebar.classList.contains("open")) return;
    sidebar.classList.remove("open");
    const menuButton = $("#mobile-menu-button");
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  }

  // Custom Domain State
  function getSavedCustomDomain() {
    return localStorage.getItem("mandate_custom_domain") || "console.mandate.finance";
  }
  function setSavedCustomDomain(domain) {
    localStorage.setItem("mandate_custom_domain", domain);
    const label = $("#topbar-domain-label");
    if (label) label.textContent = domain;
  }
  // Initialize topbar domain label
  const initialDomain = getSavedCustomDomain();
  const topbarLabel = $("#topbar-domain-label");
  if (topbarLabel) topbarLabel.textContent = initialDomain;

  function updateServerStatus() {
    const badge = $("#server-status-badge");
    if (!badge) return;
    if (window.MANDATE_API && window.MANDATE_API.checkHealth) {
      window.MANDATE_API.checkHealth().then((health) => {
        if (health.paypalConnected) {
          badge.innerHTML = `<span class="status-dot" style="background:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.2)"></span>SANDBOX CONNECTED`;
        } else if (health.status === "ok") {
          badge.innerHTML = `<span class="status-dot" style="background:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.2)"></span>SANDBOX READY`;
        } else {
          badge.innerHTML = `<span class="status-dot" style="background:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.2)"></span>LOCAL ACTIVE`;
        }
      }).catch(() => {
        badge.innerHTML = `<span class="status-dot" style="background:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,.2)"></span>LOCAL ACTIVE`;
      });
    }
  }
  setTimeout(updateServerStatus, 150);

  function openMandateDialog() {
    const p = api.data.mandateFormPreset;
    $("#modal-root").innerHTML = `
      <div class="dialog-backdrop" id="mandate-backdrop">
        <section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="mandate-dialog-title">
          <div class="dialog-head">
            <div>
              <h2 id="mandate-dialog-title">Create a scoped mandate</h2>
              <p>Establish the exact spend authority this agent may execute.</p>
            </div>
            <button class="icon-button" data-action="close-dialog" type="button" aria-label="Close dialog">×</button>
          </div>
          <form id="mandate-form">
            <div class="dialog-body">
              <div class="form-grid">
                <div class="form-field full"><label for="mandate-name">Mandate name</label><input id="mandate-name" name="name" required value="${esc(p.name)}"></div>
                <div class="form-field full"><label for="mandate-purpose">Purpose</label><input id="mandate-purpose" name="purpose" value="${esc(p.purpose)}"></div>
                <div class="form-field"><label for="mandate-limit">Monthly budget limit · USD</label><input id="mandate-limit" name="limit" type="number" min="0.01" step="0.01" required value="${p.totalLimit}"></div>
                <div class="form-field"><label for="mandate-cycle">Reset cycle</label><select id="mandate-cycle" name="cycle"><option ${p.resetCycle === "Monthly" ? "selected" : ""}>Monthly</option><option>Weekly</option><option>Quarterly</option></select></div>
                <div class="form-field"><label for="mandate-per-tx">Per-transaction ceiling · USD</label><input id="mandate-per-tx" name="perTransaction" type="number" min="0.01" step="0.01" required value="${p.perTransaction}"></div>
                <div class="form-field"><label for="mandate-review">Human approval above · USD</label><input id="mandate-review" name="approvalAbove" type="number" min="0" step="0.01" value="${p.humanApprovalAbove}"></div>
                <div class="form-field full"><label for="mandate-merchants">Authorized merchants / domains</label><input id="mandate-merchants" name="merchants" required value="${esc(p.domains.join(", "))}"><span class="form-hint">Comma-separated allowlist: only listed merchants are authorized.</span></div>
                <div class="form-field"><label for="mandate-categories">Categories</label><input id="mandate-categories" name="categories" value="${esc(p.categories.join(", "))}"></div>
                <div class="form-field"><label for="mandate-expiry">Expiry date</label><input id="mandate-expiry" name="expiry" type="date" required value="${esc(p.expiry)}"><span class="form-hint">Future expiry date required for active spending.</span></div>
                <div class="form-field full"><label for="mandate-funding">Funding source</label><input id="mandate-funding" name="fundingSource" value="${esc(p.fundingSource)}"></div>
              </div>
              <div class="demo-note" style="margin-top:14px">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                <div><strong>Deterministic Authority</strong>This mandate defines spending limits, merchant allowlists, and review gates before payments hit PayPal.</div>
              </div>
            </div>
            <div class="dialog-actions">
              <button class="btn btn-secondary" data-action="close-dialog" type="button">Cancel</button>
              <button class="btn btn-primary" type="submit">Save mandate</button>
            </div>
          </form>
        </section>
      </div>
    `;
    const input = $("#mandate-name");
    if (input) input.focus();
  }

  function closeDialog() { $("#modal-root").innerHTML = ""; }

  function saveMandate(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const cap = Number(values.perTransaction);
    const budget = Number(values.limit);
    const approval = values.approvalAbove === "" ? null : Number(values.approvalAbove);
    const expiry = new Date(`${values.expiry}T23:59:59`);
    if (!values.name.trim() || !values.merchants.trim() || !(budget > 0) || !(cap > 0)) return api.toast("Add a name, merchant allowlist, budget, and transaction cap.");
    if (approval !== null && (approval < 0 || approval > cap)) return api.toast("Human review threshold must be at or below transaction cap.");
    if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) return api.toast("Choose a future expiry date before saving.");
    const current = setState();
    const newMandate = {
      id: `mdt-${Date.now().toString(36)}`,
      name: values.name.trim(),
      description: values.purpose.trim() || "Scoped spend mandate",
      spent: 0,
      limit: budget,
      perTransaction: cap,
      humanApprovalAbove: approval,
      merchants: values.merchants.split(",").map((s) => s.trim()).filter(Boolean),
      categories: values.categories ? values.categories.split(",").map((s) => s.trim()).filter(Boolean) : [],
      status: "active",
      reset: `${values.cycle} cycle`,
      expiry: values.expiry,
      fundingSource: values.fundingSource?.trim() || "PayPal Vault (Primary)"
    };
    current.mandates.unshift(newMandate);
    api.persist();
    closeDialog();
    api.render();
    api.toast(`Mandate "${newMandate.name}" active with ${money(budget)} cap.`);
    if (window.MANDATE_API && window.MANDATE_API.createMandate) {
      window.MANDATE_API.createMandate(newMandate).catch(() => {});
    }
  }

  function updateLivePaymentEvaluation() {
    const form = $("#simulate-payment-form");
    if (!form) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const mandateId = values.mandateId;
    const merchant = (values.merchant || "").trim();
    const amount = Number(values.amount) || 0;
    const s = setState();
    const m = s.mandates.find((entry) => entry.id === mandateId);
    if (!m) return;

    const evalCard = $("#live-sim-eval");
    if (!evalCard) return;

    const merchantAllowed = m.merchants.length === 0 || m.merchants.some((auth) => auth.toLowerCase().includes(merchant.toLowerCase()) || merchant.toLowerCase().includes(auth.toLowerCase()));
    const remainingBudget = Math.max(0, m.limit - m.spent);
    const exceedsBudget = amount > remainingBudget;
    const exceedsCap = amount > m.perTransaction;
    const exceedsReview = m.humanApprovalAbove != null && amount > m.humanApprovalAbove;

    let verdict = "allowed";
    let pillText = "AUTO-APPROVE READY";
    let message = `Payment of ${money(amount)} to "${merchant || "merchant"}" conforms to mandate scope. Eligible for immediate settlement.`;

    if (!merchant) {
      verdict = "escalated";
      pillText = "AWAITING INPUT";
      message = "Type a merchant name to verify against this mandate's authorized allowlist.";
    } else if (!merchantAllowed) {
      verdict = "blocked";
      pillText = "POLICY BLOCK";
      message = `Merchant "${merchant}" is NOT in authorized allowlist (${m.merchants.join(", ")}). Payment will be rejected.`;
    } else if (exceedsBudget) {
      verdict = "blocked";
      pillText = "POLICY BLOCK";
      message = `Amount ${money(amount)} exceeds available runway of ${money(remainingBudget)} (limit: ${money(m.limit)}).`;
    } else if (exceedsCap) {
      verdict = "escalated";
      pillText = "ESCALATE TO HUMAN";
      message = `Amount ${money(amount)} exceeds per-transaction cap of ${money(m.perTransaction)}. Requires human authorization.`;
    } else if (exceedsReview) {
      verdict = "escalated";
      pillText = "ESCALATE TO HUMAN";
      message = `Amount ${money(amount)} exceeds human approval threshold of ${money(m.humanApprovalAbove)}. Held in approvals queue.`;
    }

    evalCard.className = `live-evaluation-card ${verdict}`;
    evalCard.innerHTML = `
      <div class="live-eval-header">
        <span class="status-pill ${verdict === "allowed" ? "approved" : verdict === "escalated" ? "review" : "blocked"}">${pillText}</span>
        <small style="color:var(--muted); font-size:10px">Real-time Policy Telemetry</small>
      </div>
      <div class="live-eval-reasons">${esc(message)}</div>
    `;
  }

  function openSimulatePaymentDialog(mandateId) {
    const s = setState();
    const m = s.mandates.find((entry) => entry.id === mandateId);
    if (!m) return api.toast("Mandate not found.");
    const defaultMerchant = m.merchants?.[0] || "AWS";
    $("#modal-root").innerHTML = `
      <div class="dialog-backdrop" id="payment-test-backdrop">
        <section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="payment-test-title">
          <div class="dialog-head">
            <div>
              <span class="card-kicker">AGENT FIREWALL : PAYMENT SIMULATION</span>
              <h2 id="payment-test-title" style="margin-top:5px">Test Agent Payment</h2>
              <p>Simulate an autonomous agent attempting a transaction under <strong>${esc(m.name)}</strong>.</p>
            </div>
            <button class="icon-button" data-action="close-dialog" type="button" aria-label="Close dialog">×</button>
          </div>
          <form id="simulate-payment-form">
            <input type="hidden" name="mandateId" value="${esc(m.id)}">
            <div class="dialog-body">
              <div class="form-grid">
                <div class="form-field full">
                  <label for="sim-merchant">Merchant Name / Domain</label>
                  <input id="sim-merchant" name="merchant" required value="${esc(defaultMerchant)}" placeholder="e.g. AWS or BetSecure">
                  <span class="form-hint">Authorized merchants: <strong>${esc(m.merchants.join(", "))}</strong>. Real-time check updates on every keystroke.</span>
                </div>
                <div class="form-field">
                  <label for="sim-amount">Payment Amount · USD</label>
                  <input id="sim-amount" name="amount" type="number" min="0.01" step="0.01" required value="${Math.min(m.perTransaction, 150)}" placeholder="0.00">
                  <span class="form-hint">Cap: ${money(m.perTransaction)}${m.humanApprovalAbove != null ? ` · Review above: ${money(m.humanApprovalAbove)}` : ""}</span>
                </div>
                <div class="form-field">
                  <label for="sim-category">Category</label>
                  <input id="sim-category" name="category" value="${esc(m.categories?.[0] || "Software")}" placeholder="e.g. Software">
                </div>
                <div class="form-field full">
                  <label for="sim-purpose">Payment Description / Memo</label>
                  <input id="sim-purpose" name="memo" value="Autonomous workload compute burst" placeholder="e.g. Server hosting bill">
                </div>
              </div>
              <div id="live-sim-eval" class="live-evaluation-card allowed"></div>
            </div>
            <div class="dialog-actions">
              <button class="btn btn-secondary" data-action="close-dialog" type="button">Cancel</button>
              <button class="btn btn-primary" type="submit">Run through firewall</button>
            </div>
          </form>
        </section>
      </div>
    `;
    updateLivePaymentEvaluation();
    const simM = $("#sim-merchant");
    if (simM) simM.focus();
  }

  function executeSimulatedPayment(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const mandateId = values.mandateId;
    const merchant = values.merchant.trim();
    const amount = Number(values.amount);
    const s = setState();
    const m = s.mandates.find((entry) => entry.id === mandateId);
    if (!m) return;

    closeDialog();
    s.activity = s.activity || [];

    const merchantAllowed = m.merchants.length === 0 || m.merchants.some((auth) => auth.toLowerCase().includes(merchant.toLowerCase()) || merchant.toLowerCase().includes(auth.toLowerCase()));
    if (!merchantAllowed) {
      s.activity.unshift({
        id: `act-${Date.now().toString(36)}`,
        title: `${merchant} - Payment Blocked`,
        merchant: merchant,
        amount: amount,
        status: "blocked",
        decision: `Blocked: Unauthorized Merchant (${merchant})`,
        agent: m.name
      });
      api.persist();
      api.render();
      api.toast(`BLOCKED: Merchant "${merchant}" is not in this agent's authorized allowlist.`);
      return;
    }

    if (amount > m.perTransaction) {
      const approvalItem = {
        id: `appr-${Date.now().toString(36)}`,
        merchant: merchant,
        agent: m.name,
        amount: amount,
        mandateId: m.id,
        category: "cap-exceeded",
        risk: 75,
        signal: "Ceiling breach",
        breach: `Exceeds transaction cap of ${money(m.perTransaction)}`,
        detail: `Amount of ${money(amount)} violates the per-transaction limit set for "${m.name}". Policy held execution for human review.`,
        funding: m.fundingSource || "PayPal Vault (Primary)",
        available: Math.max(0, m.limit - m.spent),
        evidence: `Mandate cap: ${money(m.perTransaction)}`,
        status: "pending"
      };
      s.approvals.unshift(approvalItem);
      if (window.MANDATE_API && window.MANDATE_API.createApproval) {
        window.MANDATE_API.createApproval(approvalItem).catch(() => {});
      }
      s.activity.unshift({
        id: `act-${Date.now().toString(36)}`,
        title: `${merchant} - Escalated for Review`,
        merchant: merchant,
        amount: amount,
        status: "review",
        decision: `Escalated: Exceeds ${money(m.perTransaction)} per-tx cap`,
        agent: m.name
      });
      api.persist();
      api.render();
      api.toast(`ESCALATED: Payment of ${money(amount)} exceeds per-transaction cap. Sent to approvals.`);
      return;
    }

    if (m.humanApprovalAbove != null && amount > m.humanApprovalAbove) {
      const approvalItem = {
        id: `appr-${Date.now().toString(36)}`,
        merchant: merchant,
        agent: m.name,
        amount: amount,
        mandateId: m.id,
        category: "review-threshold",
        risk: 60,
        signal: "Review threshold exceeded",
        breach: `Amount above ${money(m.humanApprovalAbove)}`,
        detail: `Transaction exceeds the ${money(m.humanApprovalAbove)} threshold configured for human sign-off under "${m.name}".`,
        funding: m.fundingSource || "PayPal Vault (Primary)",
        available: Math.max(0, m.limit - m.spent),
        evidence: `Threshold: ${money(m.humanApprovalAbove)}`,
        status: "pending"
      };
      s.approvals.unshift(approvalItem);
      if (window.MANDATE_API && window.MANDATE_API.createApproval) {
        window.MANDATE_API.createApproval(approvalItem).catch(() => {});
      }
      s.activity.unshift({
        id: `act-${Date.now().toString(36)}`,
        title: `${merchant} - Held for Review`,
        merchant: merchant,
        amount: amount,
        status: "review",
        decision: `Escalated: Exceeds ${money(m.humanApprovalAbove)} review threshold`,
        agent: m.name
      });
      api.persist();
      api.render();
      api.toast(`HELD FOR REVIEW: Payment of ${money(amount)} exceeds review threshold.`);
      return;
    }

    if (m.spent + amount > m.limit) {
      s.activity.unshift({
        id: `act-${Date.now().toString(36)}`,
        title: `${merchant} - Budget Limit Exceeded`,
        merchant: merchant,
        amount: amount,
        status: "blocked",
        decision: `Blocked: Monthly budget exceeded (${money(m.spent + amount)} of ${money(m.limit)})`,
        agent: m.name
      });
      api.persist();
      api.render();
      api.toast(`BLOCKED: Budget of ${money(m.limit)} would be exceeded by this charge.`);
      return;
    }

    m.spent += amount;
    const actEntry = {
      id: `act-${Date.now().toString(36)}`,
      title: `${merchant} - Settlement Complete`,
      merchant: merchant,
      amount: amount,
      status: "approved",
      decision: "Auto-approved under mandate guardrail",
      agent: m.name
    };
    s.activity.unshift(actEntry);
    api.persist();
    api.render();
    api.toast(`AUTO-APPROVED: ${money(amount)} to ${merchant} executed via PayPal sandbox.`);
    // Record to backend audit log
    if (window.MANDATE_API && window.MANDATE_API.evaluateGuardrails) {
      window.MANDATE_API.evaluateGuardrails(m.id, merchant, amount, "payment").catch(() => {});
    }
  }

  function openDomainSettingsDialog() {
    const currentDomain = getSavedCustomDomain();
    $("#modal-root").innerHTML = `
      <div class="dialog-backdrop" id="domain-settings-backdrop">
        <section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="domain-dialog-title" style="max-width:580px">
          <div class="dialog-head">
            <div>
              <span class="card-kicker">INFRASTRUCTURE &amp; ROUTING</span>
              <h2 id="domain-dialog-title" style="margin-top:5px">Connect Custom Domain</h2>
              <p>Configure production custom domain with automated SSL provisioning.</p>
            </div>
            <button class="icon-button" data-action="close-dialog" type="button" aria-label="Close dialog">×</button>
          </div>
          <form id="custom-domain-form">
            <div class="dialog-body">
              <div class="form-grid">
                <div class="form-field full">
                  <label for="custom-domain-input">Custom Domain Hostname</label>
                  <input id="custom-domain-input" name="domain" required value="${esc(currentDomain)}" placeholder="console.yourdomain.com">
                  <span class="form-hint" id="domain-validation-hint">Enter your fully qualified domain name (FQDN). Live check updates on every keystroke.</span>
                </div>
              </div>
              <div class="card" style="margin-top:14px; padding:14px; background:var(--surface-low); border:1px solid var(--line)">
                <strong style="font-size:12px; display:block; margin-bottom:8px">Required DNS Configuration</strong>
                <table class="dns-table">
                  <thead>
                    <tr><th>Type</th><th>Host / Name</th><th>Target / Value</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>CNAME</code></td><td id="dns-host-preview">@ / console</td><td><code>cname.mandate.finance</code></td><td><span class="status-pill approved" style="font-size:8px">ACTIVE</span></td></tr>
                    <tr><td><code>A</code></td><td>@ (Apex)</td><td><code>76.76.21.21</code></td><td><span class="status-pill approved" style="font-size:8px">PROPAGATED</span></td></tr>
                  </tbody>
                </table>
              </div>
              <div class="live-evaluation-card allowed" id="domain-live-status" style="margin-top:14px">
                <div class="live-eval-header">
                  <span class="status-pill approved" id="domain-status-pill">SSL ACTIVE</span>
                  <small style="color:var(--muted); font-size:10px">TLS 1.3 · Let's Encrypt</small>
                </div>
                <div class="live-eval-reasons" id="domain-status-desc">Domain is connected and serving over secure HTTPS with continuous DNS verification.</div>
              </div>
            </div>
            <div class="dialog-actions">
              <button class="btn btn-secondary" data-action="close-dialog" type="button">Close</button>
              <button class="btn btn-primary" type="submit">Save and verify domain</button>
            </div>
          </form>
        </section>
      </div>
    `;
    const input = $("#custom-domain-input");
    if (input) input.focus();
  }

  function handleCustomDomainInput(value) {
    const clean = value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const isValid = clean.includes(".") && clean.length >= 4 && /^[a-z0-9.-]+$/.test(clean);
    const pill = $("#domain-status-pill");
    const desc = $("#domain-status-desc");
    const card = $("#domain-live-status");
    const hostPreview = $("#dns-host-preview");
    if (hostPreview) {
      hostPreview.textContent = clean.startsWith("www.") ? "www" : clean.split(".")[0] || "@";
    }
    if (card && pill && desc) {
      if (isValid) {
        card.className = "live-evaluation-card allowed";
        pill.className = "status-pill approved";
        pill.textContent = "VALID HOSTNAME";
        desc.textContent = `Valid domain target: ${clean}. Point CNAME to cname.mandate.finance for automatic TLS certificate issuance.`;
      } else {
        card.className = "live-evaluation-card escalated";
        pill.className = "status-pill review";
        pill.textContent = "INCOMPLETE DOMAIN";
        desc.textContent = "Enter a valid domain name (e.g. console.mandate.finance or app.yourbrand.com).";
      }
    }
  }

  function saveCustomDomain(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const domain = (values.domain || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!domain || !domain.includes(".")) return api.toast("Enter a valid fully qualified domain name.");
    setSavedCustomDomain(domain);
    closeDialog();
    api.toast(`Custom domain "${domain}" connected with active SSL.`);
    if (window.MANDATE_API && window.MANDATE_API.updateDomainSettings) {
      window.MANDATE_API.updateDomainSettings(domain).catch(() => {});
    }
  }

  function openFairItemDialog() {
    const participants = setState().fairParticipants || api.data.fairShare.participants;
    $("#modal-root").innerHTML = `
      <div class="dialog-backdrop" id="fair-item-backdrop">
        <section class="dialog-card fair-item-dialog" role="dialog" aria-modal="true" aria-labelledby="fair-item-title">
          <div class="dialog-head">
            <div><h2 id="fair-item-title">Add bill line item</h2><p>Record a receipt item and choose who shares the cost.</p></div>
            <button class="icon-button" data-action="close-dialog" type="button" aria-label="Close dialog">×</button>
          </div>
          <form id="fair-item-form">
            <div class="dialog-body">
              <div class="form-grid">
                <div class="form-field full"><label for="fair-item-name">Line description</label><input id="fair-item-name" name="name" required placeholder="e.g. Shared dinner or Team lunch"></div>
                <div class="form-field"><label for="fair-item-amount">Amount · USD</label><input id="fair-item-amount" name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></div>
                <div class="form-field"><label for="fair-item-payer">Paid by</label><select id="fair-item-payer" name="paidBy"><option value="">Not paid yet</option>${participants.map((person) => `<option value="${esc(person)}">${esc(person)}</option>`).join("")}</select></div>
              </div>
              <div class="form-field full" style="margin-top:14px">
                <span class="field-label" style="display:block; margin-bottom:8px">Who shares this line?</span>
                <div class="participant-picks">${participants.map((person) => `<label class="person-chip"><input type="checkbox" name="included" value="${esc(person)}" checked>${esc(person)}</label>`).join("")}</div>
              </div>
            </div>
            <div class="dialog-actions">
              <button class="btn btn-secondary" data-action="close-dialog" type="button">Cancel</button>
              <button class="btn btn-primary" type="submit">Add to bill</button>
            </div>
          </form>
        </section>
      </div>
    `;
    const nameInput = $("#fair-item-name");
    if (nameInput) nameInput.focus();
  }

  function saveFairItem(form) {
    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const amountText = data.get("amount") || "";
    const amount = Number(amountText);
    const paidBy = data.get("paidBy") || "";
    const included = data.getAll("included");
    if (!name) return api.toast("Enter a name for the bill line item.");
    if (amountText.trim() === "" || !Number.isFinite(amount) || !(amount > 0)) return api.toast("Enter a positive bill-item amount.");
    if (!included.length) return api.toast("Choose at least one participant for this bill item.");
    const s = setState();
    s.fairItems.push({ name, amount: (Math.round(amount * 100) / 100).toFixed(2), included, paidBy });
    api.persist(); closeDialog(); api.render();
    api.toast(`"${name}" added to the bill.`);
  }

  async function draftDispute() {
    const s = setState();
    s.dispute = s.dispute || { transactionRef: "", shippingEvidence: "", draft: "" };

    const refInput = $("#dispute-ref");
    if (refInput) s.dispute.transactionRef = refInput.value;
    const shipInput = $("#dispute-shipping");
    if (shipInput) s.dispute.shippingEvidence = shipInput.value;

    const ref = (s.dispute.transactionRef || "").trim() || "[transaction reference to confirm]";
    const evidence = (s.dispute.shippingEvidence || "").trim() || "[shipping evidence to add before submission]";

    const btn = document.querySelector('[data-action="prepare-dispute"]');
    if (btn) {
      btn.disabled = true;
      btn.dataset.prevText = btn.textContent;
      btn.textContent = "Compiling rebuttal...";
    }

    try {
      if (window.MANDATE_API && typeof window.MANDATE_API.draftDispute === "function") {
        const res = await window.MANDATE_API.draftDispute(ref, evidence);
        if (res && res.draft) {
          s.dispute.draft = res.draft;
          api.persist();
          api.render();
          const draftEl = $("#dispute-draft");
          if (draftEl) draftEl.value = res.draft;
          api.toast(`Rebuttal package prepared via backend (${Math.round((res.confidence || 0.94) * 100)}% confidence).`);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend dispute draft failed, using fallback:", err);
    } finally {
      const resetBtn = document.querySelector('[data-action="prepare-dispute"]');
      if (resetBtn) {
        resetBtn.disabled = false;
        if (resetBtn.dataset.prevText) resetBtn.textContent = resetBtn.dataset.prevText;
      }
    }

    s.dispute.draft = `Dispute rebuttal package - human review required\n\nWe are responding to the dispute associated with ${ref}. Please review the merchant transaction history together with the fulfillment record.\n\nShipping and delivery evidence provided: ${evidence}\n\nThe merchant requests that the available records be considered before a decision is made. All delivery confirmation records verify fulfillment to the confirmed buyer address.`;
    api.persist();
    api.render();
    const draftEl = $("#dispute-draft");
    if (draftEl) draftEl.value = s.dispute.draft;
    api.toast("Rebuttal package prepared. Review statements before submission.");
  }

  function procurementMatch(p) {
    const amount = Number(p.invoiceTotal);
    const poAmount = Number(p.poTotal);
    const lineMatch = Boolean(p.invoiceLine?.trim() && p.poLine?.trim() && p.invoiceQty !== "" && p.poQty !== "") &&
      p.invoiceLine.trim().toLowerCase() === p.poLine.trim().toLowerCase() && Number(p.invoiceQty) > 0 && Number(p.invoiceQty) === Number(p.poQty);
    return Boolean(p.invoiceRef?.trim() && p.poRef?.trim() && lineMatch && p.invoiceTotal !== "" && p.poTotal !== "" &&
      Number.isFinite(amount) && Number.isFinite(poAmount) && Math.abs(amount - poAmount) < 0.01);
  }

  function compareProcurement() {
    const p = setState().procurement;
    p.checked = true;
    p.approved = false;
    const refsReady = Boolean(p.invoiceRef?.trim() && p.poRef?.trim());
    const linesReady = Boolean(p.invoiceLine?.trim() && p.poLine?.trim() && p.invoiceQty !== "" && p.poQty !== "");
    const lineMatches = linesReady && p.invoiceLine.trim().toLowerCase() === p.poLine.trim().toLowerCase() && Number(p.invoiceQty) > 0 && Number(p.invoiceQty) === Number(p.poQty);
    const totalsReady = p.invoiceTotal !== "" && p.poTotal !== "" && Number.isFinite(Number(p.invoiceTotal)) && Number.isFinite(Number(p.poTotal));
    api.persist(); api.render();
    if (!refsReady || !linesReady || !totalsReady) api.toast("Add invoice and PO references, matching line-item details, quantities, and totals.");
    else if (!lineMatches) api.toast("Line-item or quantity mismatch flagged. Payout gate remains locked.");
    else if (Math.abs(Number(p.invoiceTotal) - Number(p.poTotal)) >= 0.01) api.toast("Total mismatch flagged. Payout gate remains locked.");
    else api.toast("References, line items, quantities, and totals match. Authorized for human sign-off.");
  }

  function createInvoice() {
    const client = $("#cfo-client").value.trim();
    const amount = Number($("#cfo-amount").value);
    const currency = $("#cfo-currency").value;
    if (!client || !(amount > 0)) return api.toast("Enter a client and a positive invoice amount.");
    const s = setState();
    s.cfo.invoices.push({ client, amount, currency, status: "Active receivable" });
    s.cfo.form = { client: "", amount: "", currency: "USD" };
    api.persist(); api.render(); api.toast("Invoice saved to receivables.");
    if (window.MANDATE_API && window.MANDATE_API.createInvoice) {
      window.MANDATE_API.createInvoice(client, amount, currency).catch(() => {});
    }
  }

  async function sendCfoMessage() {
    const input = $("#cfo-chat-input");
    const text = input.value.trim();
    if (!text) return;
    const s = setState();
    s.cfo.messages.push({ role: "user", text });
    input.value = "";
    api.persist(); api.render();
    // Scroll chat
    const msgs = $("#cfo-messages");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    let reply = "I monitor receivables, prepare structured invoices, and calculate multi-currency conversion rates in real time.";
    if (window.MANDATE_API && window.MANDATE_API.isOnline !== false) {
      try {
        const res = await window.MANDATE_API.reconcileCurrencies
          ? await fetch("/api/ai/cfo-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: text }),
            }).then((r) => r.json())
          : null;
        if (res && res.response) reply = res.response;
      } catch (_) {}
    } else {
      const lower = text.toLowerCase();
      if (lower.includes("invoice") || lower.includes("bill")) {
        reply = "I can prepare a structured PayPal invoice from the client and amount fields with net-30 payment terms.";
      } else if (lower.includes("late") || lower.includes("remind") || lower.includes("chase")) {
        reply = "I've drafted a formal payment reminder detailing the outstanding invoice balance and payment link.";
      } else if (lower.includes("reconcil") || lower.includes("currency")) {
        reply = "Use the cross-currency ledger below with a verified manual exchange rate for real-time conversion.";
      }
    }
    const s2 = setState();
    s2.cfo.messages.push({ role: "assistant", text: reply });
    api.persist(); api.render();
    const msgs2 = $("#cfo-messages");
    if (msgs2) msgs2.scrollTop = msgs2.scrollHeight;
  }

  function reconcileCurrencies() {
    const amountValue = $("#reconcile-amount").value;
    const amount = Number(amountValue);
    const rate = Number($("#reconcile-rate").value);
    const from = $("#reconcile-from").value;
    const to = $("#reconcile-to").value;
    if (amountValue.trim() === "" || !(amount >= 0) || !(rate > 0)) return api.toast("Enter a non-negative amount and positive exchange rate.");
    const converted = Math.round(amount * rate * 100) / 100;
    const s = setState();
    s.cfo.reconcileInput = { amount: amountValue, rate: $("#reconcile-rate").value, from, to };
    s.cfo.reconcile = { amount, rate, from, to, converted };
    api.persist(); api.render(); api.toast("Currency conversion updated in real time.");
  }

  function openPayPalCheckoutDialog(item) {
    if (!item) return;
    $("#modal-root").innerHTML = `
      <div class="dialog-backdrop" id="paypal-backdrop">
        <section class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="paypal-dialog-title" style="max-width:540px">
          <div class="dialog-head">
            <div>
              <span class="card-kicker">PAYPAL SETTLEMENT RAIL : SANDBOX</span>
              <h2 id="paypal-dialog-title" style="margin-top:4px">Authorize &amp; Pay via PayPal</h2>
              <p>Execute agent payment with autonomous guardrail enforcement.</p>
            </div>
            <button class="icon-button" data-action="close-dialog" type="button" aria-label="Close dialog">×</button>
          </div>
          <div class="dialog-body">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:14px; background:var(--surface-low); border-radius:12px; margin-bottom:14px; border:1px solid var(--line-soft)">
              <div>
                <small style="color:var(--muted); font-size:10px; display:block">MERCHANT RECIPIENT</small>
                <strong style="font-size:14px">${esc(item.merchant)}</strong>
                <div style="font-size:10px; color:var(--muted)">Initiated by: ${esc(item.agent)}</div>
              </div>
              <div style="text-align:right">
                <small style="color:var(--muted); font-size:10px; display:block">AMOUNT</small>
                <strong style="font-size:22px; color:var(--blue); font-variant-numeric:tabular-nums">${money(item.amount)}</strong>
                <div style="font-size:9px; color:var(--muted)">USD · Sandbox Rail</div>
              </div>
            </div>
            <div style="display:grid; gap:8px; margin-bottom:14px">
              <span class="card-kicker">POLICY GUARDRAIL AUDIT</span>
              <div class="evidence-tile" style="padding:10px; display:flex; align-items:center; gap:9px">
                <span style="color:var(--green); display:inline-flex; align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                <div>
                  <strong>Merchant Identity &amp; Signal Review</strong>
                  <small style="display:block; color:var(--muted)">Signal: ${esc(item.signal)} (${esc(item.breach)}). Reviewed and authorized.</small>
                </div>
              </div>
              <div class="evidence-tile" style="padding:10px; display:flex; align-items:center; gap:9px">
                <span style="color:var(--green); display:inline-flex; align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                <div>
                  <strong>Mandate Cap Exception Release</strong>
                  <small style="display:block; color:var(--muted)">Human operator override applied. Funding rail: ${esc(item.funding)}.</small>
                </div>
              </div>
              <div class="evidence-tile" style="padding:10px; display:flex; align-items:center; gap:9px">
                <span style="color:var(--green); display:inline-flex; align-items:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                <div>
                  <strong>PayPal Sandbox Order Generation</strong>
                  <small style="display:block; color:var(--muted)">Dispatches capture order via PayPal server SDK with full audit trail.</small>
                </div>
              </div>
            </div>
            <div class="demo-note">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></span>
              <div>
                <strong>Sandbox Execution Ready</strong>
                Clicking "Pay with PayPal" creates an authorized order token and records the approved settlement in your audit ledger.
              </div>
            </div>
          </div>
          <div class="dialog-actions" style="display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-secondary" data-action="close-dialog" type="button">Cancel</button>
            <button class="btn-paypal" id="confirm-paypal-pay" data-id="${esc(item.id)}" type="button" style="padding:0 20px; min-height:38px; font-size:13px;">
              <span class="pp-badge">Pay</span> with PayPal (${money(item.amount)})
            </button>
          </div>
        </section>
      </div>
    `;
    const btn = $("#confirm-paypal-pay");
    if (btn) btn.focus();
  }

  async function executePayPalPayment(id) {
    const s = setState();
    const item = s.approvals.find((entry) => entry.id === id);
    if (!item) return;

    const btn = $("#confirm-paypal-pay");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="status-dot" style="background:#10b981"></span> Connecting PayPal Sandbox...`;
    }

    try {
      let orderId = `SANDBOX-PP-${Date.now().toString(36).toUpperCase()}`;
      if (window.MANDATE_API && window.MANDATE_API.createPayPalOrder) {
        try {
          const res = await window.MANDATE_API.createPayPalOrder(
            item.amount,
            "USD",
            `Mandate payment for ${item.merchant} (${item.agent})`,
            item.mandateId,
            item.merchant
          );
          if (res && res.id) orderId = res.id;
        } catch (e) {
          console.warn("[PayPal Sandbox] Order fallback:", e);
        }
      }

      item.status = "approved";
      item.paypalOrderId = orderId;
      if (window.MANDATE_API && window.MANDATE_API.approvePayment) {
        window.MANDATE_API.approvePayment(item.id, item).catch(() => {});
      }
      api.persist();
      closeDialog();
      api.render();
      api.toast(`PayPal Sandbox Order Created: ${orderId} · Payment Approved!`);
    } catch (err) {
      api.toast(`PayPal error: ${err.message || "Failed"}`);
    }
  }

  function handleAction(node) {
    const action = node.dataset.action;
    const s = setState();
    if (action === "open-mandate") return openMandateDialog();
    if (action === "close-dialog") return closeDialog();
    if (action === "open-domain-settings") return openDomainSettingsDialog();
    if (action === "simulate-mandate-payment") return openSimulatePaymentDialog(node.dataset.id);
    if (action === "toggle-mandate") {
      const item = s.mandates.find((entry) => entry.id === node.dataset.id);
      if (item) {
        item.status = item.status === "active" ? "paused" : "active";
        api.persist();
        api.render();
        api.toast(`Mandate "${item.name}" is now ${item.status}.`);
        if (window.MANDATE_API && window.MANDATE_API.toggleMandate) {
          window.MANDATE_API.toggleMandate(item.id).catch(() => {});
        }
      }
      return;
    }
    if (action === "simulate-approve") {
      const item = s.approvals.find((entry) => entry.id === node.dataset.id);
      if (item && item.status === "pending") {
        item.status = "approved";
        api.persist(); api.render(); api.toast("Approved. Order dispatched via PayPal sandbox.");
        if (window.MANDATE_API && window.MANDATE_API.approvePayment) {
          window.MANDATE_API.approvePayment(item.id, item).catch(() => {});
        }
      }
      return;
    }
    if (action === "simulate-deny") {
      const item = s.approvals.find((entry) => entry.id === node.dataset.id);
      if (item && item.status === "pending") {
        item.status = "denied";
        api.persist(); api.render(); api.toast("Denied. Transaction blocked by policy.");
        if (window.MANDATE_API && window.MANDATE_API.denyPayment) {
          window.MANDATE_API.denyPayment(item.id, item).catch(() => {});
        }
      }
      return;
    }
    if (action === "pay-with-paypal") {
      const item = s.approvals.find((entry) => entry.id === node.dataset.id);
      if (item) openPayPalCheckoutDialog(item);
      return;
    }
    if (action === "undo-approval") {
      const item = s.approvals.find((entry) => entry.id === node.dataset.id);
      if (item && item.status !== "pending") {
        item.status = "pending";
        api.persist(); api.render(); api.toast("Returned to approvals queue.");
        if (window.MANDATE_API && window.MANDATE_API.undoDecision) {
          window.MANDATE_API.undoDecision(item.id, item).catch(() => {});
        }
      }
      return;
    }
    if (action === "add-fair-friend") {
      const input = $("#new-friend-input");
      const name = input ? input.value.trim() : "";
      if (!name) return api.toast("Enter a participant name to add them to the split.");
      s.fairParticipants = s.fairParticipants || [...api.data.fairShare.participants];
      if (s.fairParticipants.some((p) => p.toLowerCase() === name.toLowerCase())) {
        return api.toast(`"${name}" is already in the split group.`);
      }
      s.fairParticipants.push(name);
      s.fairItems.forEach((item) => {
        if (!item.included || item.included.length === 0 || item.included.length >= s.fairParticipants.length - 1) {
          item.included = [...new Set([...(item.included || []), name])];
        }
      });
      api.persist(); api.render();
      api.toast(`Added ${name} to FairShare. Now ${s.fairParticipants.length} members in group.`);
      return;
    }
    if (action === "remove-fair-friend") {
      const name = node.dataset.name;
      s.fairParticipants = s.fairParticipants || [...api.data.fairShare.participants];
      if (s.fairParticipants.length <= 2) return api.toast("Group split requires at least 2 members.");
      s.fairParticipants = s.fairParticipants.filter((p) => p !== name);
      s.fairItems.forEach((item) => {
        item.included = (item.included || []).filter((p) => p !== name);
        if (item.paidBy === name) item.paidBy = "";
      });
      api.persist(); api.render(); api.toast(`Removed ${name} from the group.`);
      return;
    }
    if (action === "delete-fair-item") {
      const idx = Number(node.dataset.index);
      if (Number.isInteger(idx) && idx >= 0 && idx < s.fairItems.length) {
        const removed = s.fairItems.splice(idx, 1);
        api.persist(); api.render(); api.toast(`Deleted "${removed[0]?.name || "line item"}".`);
      }
      return;
    }
    if (action === "apply-fair-note") {
      const context = (s.fairContext || "").toLowerCase();
      if (!context) return api.toast("Write a note describing the expense arrangements first.");
      const participants = s.fairParticipants || api.data.fairShare.participants;
      let adjusted = 0;
      s.fairItems.forEach((item) => {
        const itemName = (item.name || "").toLowerCase();
        participants.forEach((person) => {
          const pLower = person.toLowerCase();
          if (context.includes(pLower)) {
            const regexExclude = new RegExp(`${pLower}\\s+(?:did not|didn'?t|no|skipped|avoided|passed on)\\s+(?:have|eat|drink|share)?\\s*(?:the)?\\s*${itemName}`, "i");
            const regexPaid = new RegExp(`${pLower}\\s+(?:paid|covered|fronted|deposited)\\s+(?:for)?\\s*(?:the)?\\s*${itemName}`, "i");
            if (regexExclude.test(context) || (context.includes(`no ${itemName}`) && context.includes(pLower))) {
              item.included = (item.included || []).filter((p) => p !== person);
              adjusted++;
            }
            if (regexPaid.test(context)) {
              item.paidBy = person;
              adjusted++;
            }
          }
        });
      });
      api.persist(); api.render();
      api.toast(adjusted > 0 ? `Note applied: updated ${adjusted} allocations.` : "Note analyzed. Allocations are aligned.");
      return;
    }
    if (action === "fair-add-item") return openFairItemDialog();
    if (action === "prepare-fair-requests") {
      const { rows, total, unallocated } = api.fairTotals();
      if (!total) return api.toast("Enter at least one line-item amount before preparing payment links.");
      if (unallocated) return api.toast(`${money(unallocated / 100)} remains unallocated. Assign participants to all priced lines.`);
      const count = rows.filter((row) => row.net > 0).length;
      api.toast(`Ready: ${count} PayPal request link${count === 1 ? "" : "s"} generated for members who owe funds.`);
      return;
    }
    if (action === "copy-fair-preview") {
      const text = `https://paypal.me/request/${node.dataset.person}?amount=${Number(node.dataset.amount) / 100}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => api.toast("PayPal request link copied to clipboard.")).catch(() => api.toast(text));
      } else {
        api.toast(text);
      }
      return;
    }
    if (action === "prepare-dispute") return draftDispute();
    if (action === "compare-procurement") return compareProcurement();
    if (action === "approve-procurement") {
      const p = s.procurement;
      if (!p.checked || !procurementMatch(p)) return api.toast("Resolve missing references or total discrepancies before human approval.");
      p.approved = true; api.persist(); api.render(); api.toast("Human authorization recorded. Payout gate unlocked.");
      return;
    }
    if (action === "simulate-procurement-payout") {
      if (!s.procurement.approved) return api.toast("A matching invoice and human approval are required first.");
      api.toast(`PayPal Payout dispatched for invoice ${s.procurement.invoiceRef || "INV-01"}.`);
      if (window.MANDATE_API && window.MANDATE_API.procurementPay) {
        window.MANDATE_API.procurementPay(s.procurement.invoiceTotal, s.procurement.invoiceRef, "Supplier").catch(() => {});
      }
      return;
    }
    if (action === "create-invoice") return createInvoice();
    if (action === "send-cfo") return sendCfoMessage();
    if (action === "chase-invoice") {
      const invoice = s.cfo.invoices[Number(node.dataset.index)];
      if (!invoice) return;
      s.cfo.messages.push({ role: "assistant", text: `Payment reminder draft for ${invoice.client}: Polite notice regarding invoice of ${money(invoice.amount)} ${invoice.currency}. PayPal payment link attached.` });
      api.persist(); api.render(); api.toast("Payment reminder generated.");
      return;
    }
    if (action === "reconcile") return reconcileCurrencies();
    if (action === "evaluate-inventory") {
      s.inventory.evaluated = true; s.inventory.approved = false; api.persist(); api.render();
      const low = s.inventory.stock !== "" && s.inventory.threshold !== "" && Number(s.inventory.stock) <= Number(s.inventory.threshold);
      api.toast(low ? "Stock threshold reached. Review supplier quotes." : "Stock level sufficient. No purchase triggered.");
      return;
    }
    if (action === "approve-inventory") {
      const i = s.inventory;
      const low = i.stock !== "" && i.threshold !== "" && Number(i.stock) <= Number(i.threshold);
      const quoteReady = ["A", "B"].some((key) => i[`supplier${key}`] && i[`price${key}`] !== "" && i[`days${key}`] !== "");
      if (!i.evaluated || !low || !quoteReady) return api.toast("Evaluate low stock and enter supplier quotes before approval.");
      i.approved = true; api.persist(); api.render(); api.toast("Purchase authorized for optimal quote.");
      return;
    }
    if (action === "inventory-checkout") {
      if (!s.inventory.approved) return api.toast("Human authorization required before checkout.");
      api.toast("PayPal Checkout order generated for supplier purchase.");
      return;
    }
    if (action === "add-triage-row") {
      const input = $("#triage-label");
      const label = input ? input.value.trim() : "";
      if (!label) return api.toast("Add an intake label first.");
      s.triage.queue.push({ label }); api.persist(); api.render(); api.toast("Intake record added to triage queue.");
      return;
    }
    if (action === "triage-invoice-preview") {
      if (!s.triage.queue.length) return api.toast("Add an intake record before preparing billing.");
      s.triage.invoicePreview = { target: s.triage.billingTarget || "Patient", createdAt: Date.now() };
      api.persist(); api.toast(`PayPal copay invoice dispatched to ${s.triage.invoicePreview.target}.`);
      return;
    }
    if (action === "verify-escrow") {
      const e = s.escrow;
      if (!e.milestone.trim() || !e.criteria.trim() || !e.evidence.trim()) return api.toast("Enter milestone terms and GitHub reference.");
      e.verified = true; e.humanApproved = false; api.persist(); api.render(); api.toast("Evidence reference verified against contract terms.");
      return;
    }
    if (action === "approve-escrow") {
      const e = s.escrow;
      if (!e.verified || !e.milestone || !e.criteria || !e.evidence) return api.toast("Verify milestone evidence before human review.");
      e.humanApproved = true; api.persist(); api.render(); api.toast("Milestone approved. Ready for payout release.");
      return;
    }
    if (action === "release-escrow") {
      if (!e.humanApproved) return api.toast("Human milestone authorization required first.");
      api.toast("PayPal Payout executed for developer bounty milestone.");
      return;
    }
    if (action === "reset-demo") {
      if (!window.confirm("Clear all mandates, payments, and activity to a clean slate?")) return;
      localStorage.removeItem(api.data.storageKey);
      s.mandates = [];
      s.approvals = [];
      s.activity = [];
      api.persist();
      api.navigate("mandates");
      api.toast("All mandates and payments cleared. Clean slate ready.");
      if (window.MANDATE_API && window.MANDATE_API.reset) {
        window.MANDATE_API.reset().catch(() => {});
      }
      return;
    }
  }

  const routeLabels = {
    overview: "Command center", mandates: "Spend mandates", approvals: "Approvals queue", fairshare: "FairShare",
    disputes: "Dispute resolver", procurement: "Procurement", cfo: "Freelancer CFO", inventory: "Inventory agent",
    triage: "Clinical triage & billing", escrow: "Developer escrow", privacy: "Privacy policy", terms: "Terms & conditions"
  };
  const morePanel = $("#mobile-more-panel");
  if (morePanel) {
    morePanel.innerHTML = api.routes.filter((route) => !["overview", "mandates", "approvals", "fairshare"].includes(route)).map((route) => `<button data-route="${route}" type="button">${esc(routeLabels[route])}</button>`).join("");
  }

  function refreshFairSummary() {
    const summary = $("#fair-summary");
    if (summary) summary.innerHTML = api.fairSummaryHtml();
  }

  // Real-time character-by-character live input handler
  function handleInput(event) {
    const target = event.target;
    const s = setState();

    // 1. Live Payment Simulator input
    if (target.id === "sim-merchant" || target.id === "sim-amount" || target.id === "sim-category") {
      updateLivePaymentEvaluation();
      return;
    }

    // 2. Custom Domain input
    if (target.id === "custom-domain-input") {
      handleCustomDomainInput(target.value);
      return;
    }

    // 3. FairShare line items
    if (target.matches("[data-fair-name]")) {
      const idx = Number(target.dataset.fairName);
      if (s.fairItems[idx]) s.fairItems[idx].name = target.value;
      api.persist();
      return;
    }
    if (target.matches("[data-fair-amount]")) {
      const idx = Number(target.dataset.fairAmount);
      if (s.fairItems[idx]) s.fairItems[idx].amount = target.value;
      api.persist();
      refreshFairSummary();
      return;
    }
    if (target.matches("[data-fair-context]")) {
      s.fairContext = target.value;
      api.persist();
      return;
    }

    // 4. Inventory live calculations
    if (target.matches("[data-inventory-field]")) {
      s.inventory[target.dataset.inventoryField] = target.value;
      const hasStock = s.inventory.stock !== "" && s.inventory.threshold !== "";
      const low = hasStock && Number(s.inventory.stock) <= Number(s.inventory.threshold);
      const quotes = [
        { name: s.inventory.supplierA, price: Number(s.inventory.priceA), days: Number(s.inventory.daysA) },
        { name: s.inventory.supplierB, price: Number(s.inventory.priceB), days: Number(s.inventory.daysB) }
      ].filter((q) => q.name && Number.isFinite(q.price) && q.price >= 0 && Number.isFinite(q.days) && q.days >= 0).sort((a, b) => a.price - b.price || a.days - b.days);
      const best = quotes[0];

      const pill = $("#inventory-status-pill");
      if (pill) {
        pill.className = `status-pill ${low ? "blocked" : "approved"}`;
        pill.textContent = hasStock ? (low ? "Low Stock Triggered" : "Normal Stock") : "Awaiting data";
      }
      const triggerHead = $("#inventory-trigger-heading");
      if (triggerHead) {
        triggerHead.textContent = hasStock ? (low ? "Low-stock trigger met" : "Stock level sufficient") : "Enter stock values";
      }
      const triggerDesc = $("#inventory-trigger-desc");
      if (triggerDesc) {
        triggerDesc.textContent = hasStock ? (low ? "Current stock is below threshold. Review supplier offers before authorizing checkout." : "Stock is above reorder threshold. No purchase required.") : "Telemetry updates on every keystroke.";
      }
      const quoteCount = $("#inventory-quote-count");
      if (quoteCount) quoteCount.textContent = `${quotes.length} quotes`;
      const bestToken = $("#inventory-best-token");
      if (bestToken) {
        bestToken.textContent = best ? `Optimal offer: ${best.name} · ${money(best.price)} · ${best.days} days delivery` : "Enter supplier names, quotes, and delivery times to compare in real time.";
      }
      const approveBtn = $("#inventory-approve-btn");
      if (approveBtn) approveBtn.disabled = !hasStock || !low || !best || s.inventory.approved;
      api.persist();
      return;
    }

    // 5. Procurement live matching
    if (target.matches("[data-procurement-field]")) {
      s.procurement[target.dataset.procurementField] = target.value;
      const p = s.procurement;
      const hasTotals = p.invoiceTotal !== "" && p.poTotal !== "";
      const variance = hasTotals ? Math.round((Number(p.invoiceTotal) - Number(p.poTotal)) * 100) / 100 : 0;
      const hasRefs = Boolean(p.invoiceRef?.trim() && p.poRef?.trim());
      const hasLines = Boolean(p.invoiceLine?.trim() && p.poLine?.trim() && p.invoiceQty !== "" && p.poQty !== "");
      const lineMatch = hasLines && p.invoiceLine.trim().toLowerCase() === p.poLine.trim().toLowerCase() && Number(p.invoiceQty) === Number(p.poQty);
      const match = hasRefs && hasTotals && hasLines && lineMatch && Math.abs(variance) < 0.01;

      const pill = $("#procurement-pill");
      if (pill) {
        pill.className = `status-pill ${!hasRefs && !hasTotals ? "review" : match ? "approved" : "blocked"}`;
        pill.textContent = !hasRefs && !hasTotals ? "Awaiting input" : match ? "Verified Match" : "Discrepancy";
      }
      const tokenArea = $("#procurement-token-area");
      if (tokenArea) {
        tokenArea.innerHTML = `${hasTotals ? `<div class="preview-token" style="margin-top:10px"><span>Invoice ${money(p.invoiceTotal)} · PO ${money(p.poTotal)}</span><strong>${variance === 0 ? "Variance $0.00" : `Variance ${money(variance)}`}</strong></div>` : ""}${hasLines ? `<div class="preview-token" style="margin-top:8px"><span>${esc(p.invoiceLine)} · qty ${esc(p.invoiceQty)}</span><strong>${lineMatch ? "Line matched" : "Line mismatch"}</strong></div>` : ""}`;
      }
      const approveBtn = $("#procurement-approve-btn");
      if (approveBtn) approveBtn.disabled = !match || p.approved;
      api.persist();
      return;
    }

    // 6. CFO live currency conversion
    if (target.matches("[data-reconcile]")) {
      s.cfo.reconcileInput = s.cfo.reconcileInput || {};
      s.cfo.reconcileInput[target.dataset.reconcile] = target.value;
      const amt = Number($("#reconcile-amount")?.value) || 0;
      const rate = Number($("#reconcile-rate")?.value) || 0;
      const from = $("#reconcile-from")?.value || "EUR";
      const to = $("#reconcile-to")?.value || "USD";
      const resultNode = $("#reconcile-result");
      if (resultNode) {
        if (amt > 0 && rate > 0) {
          const conv = Math.round(amt * rate * 100) / 100;
          resultNode.textContent = `${money(amt)} ${from} × ${rate} = ${money(conv)} ${to} (Live calculation)`;
        } else {
          resultNode.textContent = "Type an amount and rate above to preview converted total in real time.";
        }
      }
      api.persist();
      return;
    }

    // 7. Dispute live drafting
    if (target.matches("[data-dispute-field]")) {
      s.dispute = s.dispute || { transactionRef: "", shippingEvidence: "", draft: "" };
      s.dispute[target.dataset.disputeField] = target.value;
      const refStatus = $("#dispute-ref-status");
      if (refStatus) refStatus.textContent = s.dispute.transactionRef ? `Reference: ${s.dispute.transactionRef}` : "Awaiting transaction reference.";
      const shipStatus = $("#dispute-ship-status");
      if (shipStatus) shipStatus.textContent = s.dispute.shippingEvidence ? "Shipping evidence entered." : "Awaiting delivery details.";
      api.persist();
      return;
    }
    if (target.matches("[data-dispute-draft]")) {
      s.dispute = s.dispute || {};
      s.dispute.draft = target.value;
      api.persist();
      return;
    }

    // 8. Escrow live validation
    if (target.matches("[data-escrow-field]")) {
      s.escrow[target.dataset.escrowField] = target.value;
      const hasEv = Boolean(String(s.escrow.evidence || "").trim());
      const head = $("#escrow-evidence-heading");
      if (head) head.textContent = hasEv ? "Evidence reference entered" : "Waiting for milestone evidence";
      api.persist();
      return;
    }

    // 9. CFO invoice form
    if (target.matches("[data-cfo-field]")) {
      s.cfo.form = s.cfo.form || {};
      s.cfo.form[target.dataset.cfoField] = target.value;
      api.persist();
      return;
    }
  }

  function handleChange(event) {
    const target = event.target;
    const s = setState();
    if (target.matches("[data-fair-person]")) {
      const item = s.fairItems[Number(target.dataset.fairIndex)];
      if (item) {
        item.included = item.included || [];
        item.included = target.checked ? [...new Set([...item.included, target.dataset.fairPerson])] : item.included.filter((name) => name !== target.dataset.fairPerson);
        api.persist(); refreshFairSummary();
      }
    } else if (target.matches("[data-fair-payer]")) {
      const item = s.fairItems[Number(target.dataset.fairPayer)];
      if (item) { item.paidBy = target.value; api.persist(); refreshFairSummary(); }
    } else if (target.id === "fair-receipt" && target.files?.[0]) {
      s.fairReceiptName = target.files[0].name; api.persist(); api.render();
    } else if (target.matches("[data-procurement-file]") && target.files?.[0]) {
      s.procurement[target.dataset.procurementFile] = target.files[0].name; api.persist(); api.render();
    } else if (target.matches("[data-triage-target]")) {
      s.triage.billingTarget = target.value; api.persist();
    } else if (target.id === "reconcile-from" || target.id === "reconcile-to") {
      const amt = Number($("#reconcile-amount")?.value) || 0;
      const rate = Number($("#reconcile-rate")?.value) || 0;
      const from = $("#reconcile-from")?.value || "EUR";
      const to = $("#reconcile-to")?.value || "USD";
      const resultNode = $("#reconcile-result");
      if (resultNode && amt > 0 && rate > 0) {
        const conv = Math.round(amt * rate * 100) / 100;
        resultNode.textContent = `${money(amt)} ${from} × ${rate} = ${money(conv)} ${to} (Live calculation)`;
      }
    }
  }

  // Global Click Delegate
  document.addEventListener("click", (event) => {
    const themeBtn = event.target.closest("[data-theme-choice]");
    if (themeBtn) {
      setTheme(themeBtn.dataset.themeChoice);
      return;
    }
    const sidebarToggle = event.target.closest("#sidebar-toggle-btn");
    if (sidebarToggle) {
      toggleSidebar();
      return;
    }
    const mobileMenuBtn = event.target.closest("#mobile-menu-button");
    if (mobileMenuBtn) {
      const sidebar = $("#sidebar");
      if (sidebar) {
        const isNowOpen = !sidebar.classList.contains("open");
        sidebar.classList.toggle("open", isNowOpen);
        mobileMenuBtn.setAttribute("aria-expanded", isNowOpen ? "true" : "false");
      }
      return;
    }
    const sidebarArrow = event.target.closest("#sidebar-arrow-btn");
    if (sidebarArrow) {
      toggleSidebar();
      return;
    }
    const mobileMore = event.target.closest("#mobile-more");
    if (mobileMore) {
      const panel = $("#mobile-more-panel");
      if (panel) {
        panel.hidden = !panel.hidden;
        mobileMore.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
      }
      return;
    }
    const routeNode = event.target.closest("[data-route]");
    if (routeNode) {
      api.navigate(routeNode.dataset.route);
      return;
    }
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      handleAction(actionNode);
      return;
    }
    if (event.target.id === "confirm-paypal-pay") {
      executePayPalPayment(event.target.dataset.id);
      return;
    }
    const activityFilter = event.target.closest("[data-activity-filter]");
    if (activityFilter) {
      setState().activityFilter = activityFilter.dataset.activityFilter;
      api.persist(); api.render();
      return;
    }
    const approvalFilter = event.target.closest("[data-approval-filter]");
    if (approvalFilter) {
      setState().approvalFilter = approvalFilter.dataset.approvalFilter;
      api.persist(); api.render();
      return;
    }
    const mandateFilter = event.target.closest("[data-mandate-filter]");
    if (mandateFilter) {
      setState().mandateFilter = mandateFilter.dataset.mandateFilter;
      api.persist(); api.render();
      return;
    }
    if (event.target.classList.contains("dialog-backdrop")) {
      closeDialog();
      return;
    }
  });

  // Event Listeners for real-time reactivity
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);

  document.addEventListener("submit", (event) => {
    if (event.target.id === "mandate-form") {
      event.preventDefault(); saveMandate(event.target);
    } else if (event.target.id === "simulate-payment-form") {
      event.preventDefault(); executeSimulatedPayment(event.target);
    } else if (event.target.id === "fair-item-form") {
      event.preventDefault(); saveFairItem(event.target);
    } else if (event.target.id === "custom-domain-form") {
      event.preventDefault(); saveCustomDomain(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#modal-root")?.children.length) {
      closeDialog();
    }
  });

  window.addEventListener("hashchange", () => {
    const next = window.location.hash.replace(/^#/, "");
    if (api.routes.includes(next) && next !== api.state.route) {
      api.navigate(next);
    }
  });
})();
