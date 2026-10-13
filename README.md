# Mandate | Autonomous Agent Finance & Treasury Command Center

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20Live-003087.svg)](https://developer.paypal.com/)
[![Real-Time Market](https://img.shields.io/badge/Market-Live%20Google%20FX%20%26%20Yahoo%20Finance-00c853.svg)]()
[![Bots](https://img.shields.io/badge/Bots-Telegram%20%26%20WhatsApp%20Rails-25D366.svg)]()
[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

> **Mandate** is a production-grade command center for scoped autonomous agent finance, real-time policy guardrails, human-in-the-loop approvals, conversational AI CFO operations with live Google currency parity, multi-rail invoice settlement (PayPal, WhatsApp Bot, Telegram Bot), live stock inventory with multi-factor AI trading signals, and a high-tech AI neural dispute resolver under PayPal Seller Protection.

---

## 🌟 Key Architecture & Real-Time Modules

### 1. Scoped Autonomous Agent Mandates & Policy Guardrails
- **Deterministic Spend Limits**: Enforce strict per-transaction and monthly cumulative ceilings across autonomous agent workflows.
- **Merchant & Category Whitelists**: Restrict agent spend to approved vendors (e.g., AWS, GitHub, Cloudflare, OpenAI) while blocking restricted categories.
- **Spend Firewall & Guardrail Evaluation**: Automatic evaluation of transactions against policy rules (`POST /api/guardrails/evaluate`) before settlement release.

---

### 2. Real-Time Hardware Stocks & Multi-Factor AI Stock Advisor
- **100% Zero Mock Data**: Every stock quote (price, intraday high/low, volume, 5-minute price series) is fetched directly from live Yahoo Finance market chart feeds.
- **Custom Stock Addition & Tracking**: Operators can register any custom stock ticker (e.g. `AAPL`, `MSFT`, `TSLA`, `GOOGL`, `NVDA`) with custom target prices and track live quotes immediately.
- **High-Definition Interactive Chart**: Real-time canvas rendering of 5-minute intraday price curves with dynamic gradient fills and session high/low markers.
- **Multi-Factor AI Stock Advisor Engine**:
  - Eliminates generic static signals. Evaluates 10 nuanced, multi-factor rules based on **RSI (Relative Strength Index)**, **intraday SMA**, **day change percentage**, and **unrealized P&L bands**.
  - Generates actionable, differentiated recommendations: `BUY DIP / ACCUMULATE`, `WATCH & ACCUMULATE (ACCUMULATE ON WEAKNESS)`, `TRIM / TAKE PROFIT`, `STOP-LOSS CAUTION`, or `ACCUMULATE / RIDE TREND`.
- **Instantaneous Vault Balance Synchronization**:
  - **Buy Stock**: Deducts capital directly from the operational vault balance in real time.
  - **Sell Stock**: Liquidates shares and immediately deposits net proceeds back into the vault balance with live SSE broadcast.

---

### 3. Freelancer CFO: Live Google Currency Parity & Natural Language AI Assistant
- **Live Google Finance & Interbank Currency Parity Engine**:
  - Connects to real-time market feeds (`POST /api/fx/convert` & `GET /api/rates`) for **EUR, USD, GBP, INR, JPY, CAD, AUD, CHF, SGD**.
  - Accurate market rates with zero mock data and zero bank markup (e.g., `1 EUR = 1.1171 USD`, `1 USD = 95.91 INR`).
- **Conversational AI Treasury Engine (`/api/ai/cfo-chat`)**:
  - **Real-Time Client Invoicing**: Prompts like *"Invoice Studio Alpha for 4500 EUR"* or *"Bill Spotify 3200 GBP"* automatically parse client, amount, and currency, generate official invoice records, and update the active receivables table in real time.
  - **Live Market Parity Conversions**: Prompts like *"Market parity 2000 EUR to USD"* or *"Convert 1500 USD to INR"* calculate exact conversions using live Google Finance parity rates and dynamically update the interactive converter card.
  - **Late Payment Follow-Ups**: Prompts like *"Draft payment reminder for late receivables"* inspect unpaid invoices and generate executive payment reminder notices with PayPal payment links.
  - **Tax Reserves & Runway Intelligence**: Computes self-employment tax withholding (28%) and calculates treasury runway based on burn rate.
- **Multi-Rail Invoice Settlement**:
  - Outstanding invoices can be settled directly in real time via:
    - 💳 **PayPal Sandbox Rail**
    - 🟢 **WhatsApp Bot Payment Webhook**
    - ✈️ **Telegram Bot Settlement Rail**
  - Instant settlement marks invoices as paid, logs cryptographic transaction receipts, credits the operating vault balance, and dispatches automated bot settlement confirmations.

---

### 4. AI Neural Dispute Arbitrator & Statutory Seller Protection Console
- **High-Tech Cyber/Fintech HUD**:
  - Dark glassmorphism command console with animated scanlines, status indicator LEDs, and live endpoint latency monitors:
    - `POST /api/ai/dispute-outlook` · `24ms · ACTIVE`
    - `POST /api/ai/draft-dispute` · `NEURAL SYNTHESIZER READY`
    - `POST /api/ai/submit-dispute` · `PAYPAL RESOLUTION RAIL SYNCED`
- **1-Click Evidence Preset Ingestion**:
  - Instant scenario buttons (`⚡ FedEx Express POD`, `⚡ UPS Signature POD`, `⚡ DHL Express Geostamp`) automatically inject carrier tracking numbers, signature scans, and GPS stamps.
- **Real-Time Predictive Win Rate & Capital Recovery**:
  - Dynamically calculates seller win probability (up to **98%**) and expected dollar recovery against editable disputed claim amounts:
    $$\text{Estimated Recovery} = \frac{\text{Claim Amount} \times \text{Win Rate \%}}{100}$$
- **Statutory Legal Rebuttal Synthesizer**:
  - Synthesizes comprehensive legal merchant defense packages invoking **PayPal Seller Protection Policy (Section 11)** with verified carrier proof of delivery (POD) records.
  - Direct API transmission to the PayPal Dispute Resolution Center with official submission receipts (`DISP-...`) and PayPal Case IDs (`PP-D-...`).

---

### 5. Multi-Channel Bot Rails: Telegram & WhatsApp
- **Telegram Bot (`bots/telegram-bot.js`)**: Real-time command interface supporting `/mandates`, `/balance`, `/stocks`, and `/pay` with inline keyboards and webhook notifications.
- **WhatsApp Bot (`bots/whatsapp-bot.js`)**: Interactive WhatsApp Business messaging rail for remote executive approvals, emergency spending alerts, and invoice payment confirmations.
- **Cross-Module Telemetry**: Bot payments record verified transactions in the central audit ledger and broadcast live telemetry to the dashboard via SSE.

---

### 6. Developer Bounty Escrow (3-Stage Workflow)
- **Stage 1 (Evidence Ingestion)**: Verification of GitHub Pull Requests, commit hashes, or milestone deliverables against smart contract terms.
- **Stage 2 (Human Authorisation Gate)**: Automatic escalation to the Human Approvals Queue before unlocking checkout.
- **Stage 3 (PayPal Checkout Release)**: Direct release to the developer's verified PayPal wallet with automatic deduction from escrow reserve capital.

---

### 7. Dual-Scan Procurement & Autonomous Inventory Depletion
- **Dual-Document Matcher**: Compares supplier invoices against purchase orders to detect line-item variances, quantity mismatches, and price discrepancies.
- **ESP32 Sensor Telemetry**: Simulates live hardware inventory depletion that automatically triggers supplier reorders and PayPal restock purchases when stock falls below threshold.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend Core** | Node.js (ES Modules / CommonJS), Express 5, CORS, Dotenv |
| **Payment Rails** | `@paypal/paypal-server-sdk`, PayPal Orders API v2, Payouts API |
| **Market Data** | Yahoo Finance Real-Time Chart API, Open Exchange Rates / Google Parity API |
| **Bot Integrations** | Node Telegram Bot API, WhatsApp Cloud API / Webhook Engine |
| **Real-Time Transport** | Server-Sent Events (SSE) `/api/events`, bidirectional state syncing |
| **Frontend Architecture** | Vanilla JavaScript (ES6+), Semantic HTML5, Zero heavy client dependencies |
| **Styling & HUD** | Vanilla CSS3 Design System, Cyberpunk Glassmorphism HUD, Dark/Light themes |

---

## 📂 Project Structure

```
├── server.js               # Express API, live FX engine, stock market quotes, PayPal SDK
├── api-client.js           # Frontend REST client with error recovery & retry logic
├── app.js                  # View renderers for all 10 domain consoles & navigation
├── interactions.js         # Real-time event handlers, keystroke listeners, dialog managers
├── styles.css              # Design system, high-tech HUD cards, theme tokens
├── backend.html            # Interactive API Developer Console & Live Endpoint Tester
├── index.html              # Main application shell with theme toggles & topbar
├── bots/
│   ├── telegram-bot.js     # Telegram Bot settlement rail and command listeners
│   ├── whatsapp-bot.js     # WhatsApp Bot webhook engine and notification dispatcher
│   └── payment-core.js     # Shared bot payment routing and PayPal bridging
├── package.json            # Node dependencies and execution scripts
└── .env                    # Environment configuration (PayPal, Telegram, Port)
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

### 3. Environment Configuration
Create or configure your `.env` file in the root directory:
```env
PORT=3000
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_ENVIRONMENT=sandbox

# Optional Bot Credentials
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=MandateFinanceBot
WHATSAPP_TOKEN=your_whatsapp_cloud_api_token
```
*(If PayPal credentials are not provided, the application runs seamlessly in high-fidelity simulated sandbox mode).*

### 4. Running the Application
```bash
# Start server
npm start

# Or run with nodemon for active development
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔌 Real-Time REST & SSE API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/rates` | `GET` | Retrieve real-time Google Finance & interbank currency parity rates |
| `/api/fx/convert` | `POST` | Convert cross-currency amounts using live Google parity quotes |
| `/api/ai/cfo-chat` | `POST` | Natural language CFO prompts (invoice creation, parity, reminders) |
| `/api/cfo/invoices` | `GET`, `POST` | Retrieve active receivables or create new client invoice |
| `/api/cfo/invoices/:id/pay` | `POST` | Settle invoice via PayPal Sandbox, WhatsApp Bot, or Telegram Bot |
| `/api/inventory/stocks` | `GET` | Retrieve live stock market telemetry from Yahoo Finance |
| `/api/inventory/stocks` | `POST` | Add custom stock ticker for live tracking and chart rendering |
| `/api/inventory/stocks/:ticker/ai-suggestion` | `GET` | Multi-factor AI trading recommendations (RSI, SMA, P&L bands) |
| `/api/inventory/stocks/:ticker/buy` | `POST` | Purchase shares and deduct cost basis from operational vault |
| `/api/inventory/stocks/:ticker/sell` | `POST` | Liquidate shares and deposit proceeds back into vault |
| `/api/ai/dispute-outlook` | `POST` | Calculate real-time win probability & expected dollar recovery |
| `/api/ai/draft-dispute` | `POST` | Synthesize statutory merchant legal rebuttal (Seller Protection Sec. 11) |
| `/api/ai/submit-dispute` | `POST` | Transmit rebuttal package to PayPal Dispute Resolution Center rail |
| `/api/vault` | `GET`, `POST` | Retrieve or adjust operating treasury vault capital |
| `/api/approvals` | `GET` | Retrieve pending human review approvals queue |
| `/api/approvals/:id/approve` | `POST` | Manually approve pending review item & sync originating module |
| `/api/escrow` | `GET`, `POST` | Retrieve escrow contracts or fund a new milestone contract |
| `/api/escrow/:id/evidence` | `POST` | Submit milestone evidence (advances to Stage 2 Human Review) |
| `/api/escrow/:id/checkout` | `POST` | Stage 3 PayPal Checkout escrow payout release |
| `/api/procurement/scan` | `POST` | Dual-document invoice vs purchase order comparison scanner |
| `/api/events` | `GET` | Server-Sent Events (SSE) real-time event telemetry stream |

---

## 📄 License
This project is licensed under the **MIT License**. Open-source and built for autonomous agent financial operations.
