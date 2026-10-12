# Mandate | Autonomous Agent Finance Command Center

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20Live-003087.svg)](https://developer.paypal.com/)
[![Real-Time](https://img.shields.io/badge/Backend-100%25%20Real--Time%20Telemetry-purple.svg)]()
[![License](https://img.shields.io/badge/License-MIT-black.svg)]()

> Production console for scoped autonomous agent finance mandates, real-time policy guardrails, human-in-the-loop approvals, conversational AI CFO financial operations, predictive dispute resolution, and connected PayPal Sandbox settlement rails.

---

## 🌟 Key Architecture & Real-Time Features

### 1. Zero Hardcoded Mock Data & Dynamic Operating Vault
- **Clean Slate On Startup**: No hardcoded mock approvals, mock users, or pre-seeded balances.
- **Dynamic Vault Capital Configuration via Auth**: Operators enter their desired operating capital (e.g., `$50,000`, `$85,000`, or `$125,000`) directly in the Authentication / OAuth dialog. The workspace operates according to the user's exact treasury requirement.
- **Universal Email & OAuth 2.0 Identity**: Fast single sign-on with Google, PayPal, and GitHub OAuth, plus valid email/password registration with persistence in the backend user store.

---

### 2. Human-in-the-Loop Approvals Queue
The Approvals Queue starts clean (`[]`) and only populates when real operational sections require human authorization:
- **Procurement Dual-Scan Discrepancies**: When automated comparison between supplier invoices and purchase orders flags line-item, quantity, or total price variances, it automatically escalates an approval item (`appr-proc-...`) requiring human sign-off before payout release.
- **Autonomous Inventory Agent Reorder Gate**: When sensor telemetry detects that stock falls at or below threshold (`stock <= threshold`), the purchase gate routes to Approvals (`appr-inv-...`) for manual human review.
- **Developer Bounty Escrow (Stage 2 Human Authorisation)**: When GitHub PR / commit evidence is verified in Stage 1, it advances to Stage 2 Human Authorisation, creating an approval item (`appr-escrow-...`) that must be approved before unlocking Stage 3 PayPal Checkout.
- **Spend Firewall Policy Breaches**: High-risk or budget-exceeding transactions route to the queue for manual intervention.
- **Module Synchronization**: Approving or denying items in the Approvals Queue instantly synchronizes back to the originating module (authorizing inventory restock, releasing procurement payout, or unlocking developer escrow release).

---

### 3. Freelancer CFO: Natural Language Financial Intelligence Engine
A conversational treasury assistant powered by real-time financial NLP:
- **Real-Time Client Invoice Generation**: Prompts such as:
  - *"Invoice Acme Creative for 3,500 EUR"*
  - *"Bill Spotify $4,800 USD for backend API integration"*
  - *"Charge Studio Alpha 2500 GBP"*
  automatically parse client names, amounts, and currencies, generate formal invoice records in backend receivables (`cfoInvoices`), and update the **Active Receivables** table in real time.
- **Live Google Finance & Market Parity Exchange**: Prompts such as:
  - *"What is the market parity between 5,000 EUR and USD?"*
  - *"Convert 2,500 GBP to USD at market rate"*
  query live Google Finance / Interbank parity rates, update the **Live Currency Converter** card, and calculate exact exchange amounts with zero retail bank markup.
- **Tax Withholding & Reserve Calculations**: Prompts such as *"How much tax should I save if I earned $40,000?"* compute self-employment withholding, required vault reserves, net take-home, and quarterly payment dates.
- **Profit Margin & Overhead Analysis**: Prompts analyzing revenue and expenses (e.g. *"Revenue $25,000, expenses $6,500"*) calculate net profit, operating leverage, and margin percentages.
- **Value-Based Pricing & Rate Calculator**: Computes target billable hours and recommends hourly, daily, and monthly retainer rates based on desired net compensation.
- **Payment Follow-Ups & Chasing**: Analyzes outstanding invoices and drafts customized, professional payment reminder notices with PayPal settlement links.
- **Convenient Quick-Prompt Shortcuts**: One-click prompt chips allow rapid execution with a single click or by pressing **Enter**.

---

### 4. Autonomous Inventory Agent with Connected PayPal Checkout
- **Dynamic Warehouse Telemetry (Not Hardcoded)**:
  - Add custom hardware items via `POST /api/inventory/items` or the **"+ Add Monitored Hardware SKU"** modal.
  - Multi-supplier quote comparison (lowest price and shortest fulfillment lead time).
- **Live ESP32 Sensor Telemetry Depletion**:
  - Simulate real-time sensor consumption via `POST /api/inventory/telemetry` or the **"-1 Unit (Sensor)"** button, observing live stock depletion that triggers the reorder gate dynamically.
- **Connected PayPal Sandbox Checkout**:
  - Restock purchase execution routes directly through the `@paypal/paypal-server-sdk` Orders API (`POST /api/inventory/checkout`).
  - Restocks warehouse units (+5 units), logs transaction receipts, and automatically deducts the payment from `vaultConfig.currentVault` in real time.

---

### 5. Dispute Resolver with Real-Time Predictive Case Outlook & Estimated Recovery
- **Real-Time Predictive Win Rate**:
  - Evaluates case evidence dynamically on every keystroke:
    - **Baseline (Awaiting records)**: `20%`
    - **Confirmed Transaction Reference ID**: `+20%` ($40\%$ total)
    - **Carrier Shipping Evidence & POD (FedEx, UPS, DHL, USPS)**: `+35%` ($75\%–85\%$ total, **Strong Protection Tier 1**)
    - **Rebuttal Narrative Package Compiled**: `+20%` ($90\%$ total)
    - **Transmitted to PayPal Resolution Center**: `+10%` ($98\%$ total)
- **Live Estimated Dollar Recovery**:
  $$\text{Estimated Recovery} = \frac{\text{Disputed Claim Amount} \times \text{Win Rate \%}}{100}$$
  Scales dynamically with the editable **Disputed Claim Amount ($ USD)** input field.
- **Interactive Visual Feedback**:
  - Animated visual progress bar that updates its fill and color dynamically.
  - Live 4-point verification checklist lighting up green as evidence is assembled.
  - Formal Merchant Rebuttal package transmission to the PayPal Resolution Center with generated submission ID (`PPDISP-...`).

---

### 6. Developer Bounty Escrow (3-Stage Workflow)
- **Stage 1 (Evidence Reference)**: Verify GitHub Pull Request / Commit hash against contract terms.
- **Stage 2 (Human Authorisation)**: Escalates to Approvals Queue for manual sign-off before payout unlock.
- **Stage 3 (PayPal Checkout Release)**: Executes cryptographic PayPal Payout to developer's verified wallet.

---

### 7. Clinical Triage & Medical Billing
- Sensor vitals telemetry stream (`vitals_tick` every 5s).
- Offline-capable severity triaging (Critical, Urgent, Routine).
- Automated copay and insurance claim dispatch with PayPal Sandbox invoicing.

---

### 8. FairShare Context-Aware Expense Splitting
- Natural-language split adjustments (e.g. *"Alice didn't drink alcohol, Charlie covered the car deposit"*).
- Instant calculation of owed balances and individual PayPal payment requests.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express 5, `@paypal/paypal-server-sdk`, CORS, Dotenv |
| **Frontend** | Vanilla JavaScript (ES6+), Semantic HTML5, Zero heavy frameworks |
| **Styling** | Vanilla CSS3 Design System with CSS Tokens, Dark/Light/Forest themes |
| **Real-Time** | Server-Sent Events (SSE) `/api/events` & WebSocket telemetry broadcast |
| **Payments** | PayPal Sandbox & Live Checkout Orders API, Vault reserve ledger |
| **Persistence** | In-Memory backend store with `localStorage` client synchronization |

---

## 📂 Project Structure

```
├── server.js           # Express server, PayPal SDK wiring, REST API, & SSE broadcast
├── api-client.js       # Frontend REST client with error recovery & retry logic
├── app.js              # View renderers for all 10 domain consoles & navigation
├── interactions.js     # Real-time event handlers, keystroke listeners, dialog managers
├── data.js             # Initial state tokens, design concepts, and baseline schema
├── backend.html        # Interactive API Developer Console & Live Endpoint Tester
├── index.html          # Main application shell with theme toggles & topbar
├── styles.css          # Fintech design system (Light, Dark, Forest themes)
├── package.json        # Node dependencies & start scripts
└── .env.example        # Environment variable template for PayPal credentials
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mayukhbyte/Paypaal.git
cd Paypaal

# Install dependencies
npm install
```

### 3. Configure PayPal Sandbox Credentials (Optional)
Create a `.env` file in the root directory (or copy `.env.example`):
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
PAYPAL_ENVIRONMENT=sandbox
PORT=3000
```
*(If no credentials are provided, the console operates in high-fidelity simulated sandbox mode with realistic transaction order IDs).*

### 4. Run the Application
```bash
# Start server
npm start

# Or with nodemon for active development
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔌 API Reference Highlights

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | `POST` | User authentication & custom vault capital registration |
| `/api/auth/me` | `GET` | Returns active user session & profile |
| `/api/vault` | `GET`, `POST` | Retrieve or adjust operating treasury vault capital |
| `/api/approvals` | `GET` | Retrieve pending human review approvals queue |
| `/api/approvals/:id/approve` | `POST` | Manually approve pending review item & sync originating module |
| `/api/ai/cfo-chat` | `POST` | Natural language CFO prompts (invoices, market parity, tax, pricing) |
| `/api/cfo/invoices` | `GET`, `POST` | Retrieve active receivables or create new client invoice |
| `/api/inventory` | `GET` | Retrieve active hardware stock telemetry & supplier quotes |
| `/api/inventory/items` | `POST` | Register dynamic hardware SKU into warehouse ledger |
| `/api/inventory/telemetry` | `POST` | Simulate real-time ESP32 sensor stock depletion |
| `/api/inventory/checkout` | `POST` | Execute PayPal Sandbox restock order & deduct vault balance |
| `/api/ai/dispute-outlook` | `POST` | Calculate real-time win probability & expected dollar recovery |
| `/api/ai/draft-dispute` | `POST` | Compile automated merchant narrative rebuttal package |
| `/api/ai/submit-dispute` | `POST` | Transmit rebuttal package to PayPal Dispute Resolution Center |
| `/api/escrow` | `GET`, `POST` | Retrieve escrow contracts or fund a new milestone contract |
| `/api/escrow/:id/evidence` | `POST` | Submit GitHub PR evidence reference (advances to Stage 2 Human Review) |
| `/api/escrow/:id/checkout` | `POST` | Stage 3 PayPal Checkout escrow payout release |
| `/api/procurement/scan` | `POST` | Dual-document invoice vs purchase order comparison scanner |
| `/api/events` | `GET` | Server-Sent Events (SSE) real-time event stream |

---

## 📄 License
MIT License. Open-source and built for pair-programming autonomous agent financial systems.
