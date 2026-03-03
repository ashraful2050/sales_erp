# Changelog

All notable changes to **Sales ERP** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-03-03

### Added

#### Core Architecture

- Multi-tenant SaaS architecture with shared-database company isolation
- Plans & Subscriptions module for SaaS feature gating
- SuperAdmin → Admin → Sub-user permission delegation hierarchy
- Granular role-based access control per module and feature
- Full audit log and login history tracking
- Affiliate & conversion tracking system

#### Accounting Module

- Chart of Accounts with account groups and type classification
- Journal Entries with debit/credit lines and audit trail
- Debit, Credit, and Contra Vouchers with approval workflows
- Opening Balances import for fiscal year initialization
- Payment Methods configuration (cash, bank, card, mobile)
- Service Payments and Cash Adjustments
- Voucher approval and locking

#### Sales Module

- Invoices with tax, discount, and customer AR integration
- Quotations with conversion-to-invoice tracking
- Credit Notes / Sales Returns linked to original invoices
- Delivery Notes with draft → dispatched → delivered status
- Customer master with credit terms and segmentation
- Pricing Rules (product, customer group, quantity-based)
- Discount Rules and Coupons (global and targeted)
- Loyalty Programs (earn/redeem points on sales and POS)
- Commission Structures per sales volume, product, or margin
- Sales Channels for channel-level profitability tracking

#### CRM Module

- Lead capture, status tracking (new → contacted → qualified → won/lost)
- Lead Activities and follow-up logging
- Customer Segments (behavior, geography, value-based)

#### Purchase Module

- Purchase Orders with approval and GRN linkage
- Vendor master management
- Goods Receipts (GRN) with quantity verification
- Purchase-side Debit Notes for returns and overbilling corrections

#### Inventory Module

- Product master (codes, UOM, cost, price, category)
- Multi-warehouse stock tracking
- Product Categories
- Stock Movements (transfers, adjustments, corrections)

#### Finance Module

- Payments (AR/AP allocation against invoices and bills)
- Bank Account master and reconciliation configuration
- Expense logging with categories

#### HR & Payroll Module

- Employee records with department and designation links
- Salary Structure configuration
- Payroll cycle runs with accounting integration
- Leave types and employee leave requests

#### Assets Module

- Fixed Asset Register with cost, location, and useful life
- Depreciation schedules (straight-line and other methods)

#### POS Module

- POS Terminal for front-desk retail sales
- Loyalty point accrual at POS
- POS Reports (daily takings, cashier performance)

#### Reports Module

- Financial: Trial Balance, Profit & Loss, Balance Sheet, Cash Flow, Income Statement
- Operational: General Ledger, Aged Receivables, Aged Payables, Sales Report, Purchase Report
- Specialized: Tax Report, Payroll Report, Expense Report, Stock Report, Asset Register

#### Analytics & AI Module

- Sales Dashboard with KPI visualizations over time
- Customer Feedback collection and satisfaction metrics
- Sales Forecasts

#### Industrial Engineering (IE) Module

- Process Optimization (lead-to-cash and quote-to-cash timelines)
- Workload Balancing (volume by user/department)
- KPI & Performance Analytics (conversion rate, deal size, cycle time, on-time delivery)
- Demand Forecasting (historical invoice-based projections)
- Order Fulfillment Analytics (promised vs actual delivery)
- Standardization & Automation (pricing/discount variability analysis)
- Lean Waste Dashboard (rework, returns, cancellations)
- Cost-to-Serve Analysis (per customer/segment profitability)
- Simulation & What-If scenario modeling
- Continuous Improvement tracking (PDCA/Kaizen)

#### Tasks & Support Module

- Task Management with owners, due dates, priorities, and comments
- Support Tickets with SLA tracking and ticket replies
- Links between tasks, leads, customers, and sales documents

#### Settings & Configuration

- Company settings and branding
- Tax Rates configuration
- Multi-currency support
- Fiscal Year management
- Units of Measure

#### FAQ / Knowledge Base

- FAQ Categories and Articles
- Self-service search

#### Frontend & UX

- React 18 + Inertia.js SPA experience (no separate API)
- Tailwind CSS 3 responsive design
- Headless UI accessible components
- Recharts data visualizations
- Lucide React icon set
- Vite 7 with Hot Module Replacement for development

---

_For support and update notifications, see the CodeCanyon item page._
