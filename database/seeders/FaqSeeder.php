<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $company   = Company::first();
        $companyId = $company?->id ?? 1;

        // ── Categories ────────────────────────────────────────────────────────────
        $categories = [
            ['name' => 'Getting Started',     'icon' => '🚀', 'color' => '#6366f1', 'desc' => 'New to AccounTech BD? Start here.'],
            ['name' => 'Dashboard',           'icon' => '📊', 'color' => '#0ea5e9', 'desc' => 'Understanding your home dashboard.'],
            ['name' => 'Sales Management',    'icon' => '💰', 'color' => '#22c55e', 'desc' => 'Invoices, quotations, customers, credit notes.'],
            ['name' => 'Purchase Management', 'icon' => '🛒', 'color' => '#f59e0b', 'desc' => 'Vendors, purchase orders, goods receipts.'],
            ['name' => 'Accounting',          'icon' => '📒', 'color' => '#8b5cf6', 'desc' => 'Chart of accounts, journals, cost centres.'],
            ['name' => 'Finance',             'icon' => '🏦', 'color' => '#06b6d4', 'desc' => 'Bank accounts, payments, reconciliation.'],
            ['name' => 'Inventory',           'icon' => '📦', 'color' => '#10b981', 'desc' => 'Products, warehouses, stock movements.'],
            ['name' => 'Human Resources',     'icon' => '👥', 'color' => '#ec4899', 'desc' => 'Employees, payroll, leaves, departments.'],
            ['name' => 'Point of Sale (POS)', 'icon' => '🖥️', 'color' => '#f97316', 'desc' => 'POS sessions, quick sales at counter.'],
            ['name' => 'Fixed Assets',        'icon' => '🏗️', 'color' => '#64748b', 'desc' => 'Asset register, depreciation, categories.'],
            ['name' => 'Reports',             'icon' => '📈', 'color' => '#7c3aed', 'desc' => 'Financial and operational reporting.'],
            ['name' => 'Settings',            'icon' => '⚙️', 'color' => '#475569', 'desc' => 'Company config, taxes, currencies, fiscal years.'],
            ['name' => 'Users & Permissions', 'icon' => '🔐', 'color' => '#dc2626', 'desc' => 'Roles, permissions, access control.'],
            ['name' => 'Audit & Security',    'icon' => '🛡️', 'color' => '#b45309', 'desc' => 'Audit logs, login history, security.'],
        ];

        $catMap = [];
        foreach ($categories as $i => $cat) {
            $record = FaqCategory::firstOrCreate(
                ['company_id' => $companyId, 'slug' => Str::slug($cat['name'])],
                [
                    'name'       => $cat['name'],
                    'description'=> $cat['desc'],
                    'icon'       => $cat['icon'],
                    'color'      => $cat['color'],
                    'sort_order' => $i + 1,
                    'is_active'  => true,
                ]
            );
            $catMap[$cat['name']] = $record->id;
        }

        // ── FAQ Data ───────────────────────────────────────────────────────────────
        $faqs = [

            // ── Getting Started ───────────────────────────────────────────────────
            ['Getting Started', 'What is AccounTech BD?',
             'AccounTech BD is a complete cloud-based ERP solution designed for Bangladeshi businesses. It covers accounting, sales, purchase, inventory, HR, payroll, POS, and more in a single unified platform.',
             ['erp', 'overview', 'introduction']],

            ['Getting Started', 'How do I log in for the first time?',
             'Navigate to your AccounTech BD URL and enter your email and password on the login page. Use the credentials provided by the Super Admin. If you have forgotten your password, click "Forgot Password" to reset it via email.',
             ['login', 'first-time', 'password']],

            ['Getting Started', 'What should I set up first after installation?',
             'Start by going to Settings → Company to fill in your business details (name, address, logo, currency, fiscal year). Then set up your Chart of Accounts, tax rates, and create user accounts.',
             ['setup', 'configuration', 'onboarding']],

            ['Getting Started', 'Can multiple users log in at the same time?',
             'Yes. AccounTech BD is a multi-user system. Each user is assigned a role that controls which modules and actions they can access. Concurrent logins are fully supported.',
             ['multi-user', 'concurrent', 'users']],

            ['Getting Started', 'Does AccounTech BD support multiple companies?',
             'Yes. The Super Admin can create multiple company accounts. Each company has its own isolated data — accounts, contacts, transactions, and settings.',
             ['multi-company', 'tenant']],

            ['Getting Started', 'Is there a mobile-friendly interface?',
             'Yes. The entire interface is built with responsive Tailwind CSS and works on tablets and mobile browsers. A dedicated mobile app is on the product roadmap.',
             ['mobile', 'responsive']],

            ['Getting Started', 'How do I change my profile and password?',
             'Click your avatar/name at the top-right corner → Profile. You can update your name, email, and change your password there.',
             ['profile', 'password', 'account']],

            // ── Dashboard ──────────────────────────────────────────────────────────
            ['Dashboard', 'What does the dashboard show?',
             'The dashboard shows a real-time overview of your business: revenue vs. expense charts, top customers, recent invoices, outstanding receivables/payables, inventory alerts, and key financial KPIs.',
             ['dashboard', 'kpi', 'overview']],

            ['Dashboard', 'Can I customise the dashboard widgets?',
             'The current version shows a standard set of KPI cards and charts. Per-user widget customisation is on the roadmap for a future release.',
             ['dashboard', 'widgets', 'customise']],

            ['Dashboard', 'Why are some dashboard figures showing zero?',
             'Dashboard figures reflect posted transactions. If you have just set up the system and have not yet created invoices, payments, or journal entries, values will show zero.',
             ['dashboard', 'zero', 'data']],

            ['Dashboard', 'What does the "Outstanding Receivables" card mean?',
             'This is the total amount owed to your company by customers whose invoices are approved but not yet fully paid. Reducing this figure improves your cash flow.',
             ['dashboard', 'receivables', 'outstanding']],

            ['Dashboard', 'What does the "Outstanding Payables" card mean?',
             'This is the total amount your company owes to vendors based on approved purchase orders or supplier invoices that are not yet fully paid.',
             ['dashboard', 'payables', 'outstanding']],

            // ── Sales Management ───────────────────────────────────────────────────
            ['Sales Management', 'How do I create a new sales invoice?',
             'Go to Sales → Invoices → click "New Invoice". Select the customer, add line items (product/service, quantity, unit price, tax), set the due date, and save. You can save as draft or submit to approve it.',
             ['sales', 'invoice', 'create']],

            ['Sales Management', 'What is the difference between Draft and Approved invoice status?',
             'A Draft invoice can be edited freely and does not affect the general ledger. An Approved invoice is locked and posts journal entries to Accounts Receivable and the revenue accounts.',
             ['invoice', 'draft', 'approved', 'status']],

            ['Sales Management', 'How do I send an invoice to a customer?',
             'After approving the invoice, click "Print" or "Export PDF" to download it. You can share or email the PDF directly to your customer.',
             ['invoice', 'send', 'pdf', 'email']],

            ['Sales Management', 'How do I mark an invoice as paid?',
             'Go to the invoice detail page and click "Record Payment". Select the payment date, bank account, amount, and method. If the amount equals the invoice total, the invoice will be marked "Paid".',
             ['invoice', 'payment', 'paid']],

            ['Sales Management', 'What is a credit note, and when do I use it?',
             'A credit note reverses or partially reverses a sales invoice. Use it when a customer returns goods, you over-billed, or you need to issue a discount after the fact. It reduces the customer\'s outstanding balance.',
             ['credit-note', 'return', 'reversal']],

            ['Sales Management', 'How do I create a quotation?',
             'Go to Sales → Quotations → New Quotation. Add the customer, line items, validity date, and notes. The customer can be emailed the PDF. Once accepted, convert it to an invoice with one click.',
             ['quotation', 'estimate', 'quote']],

            ['Sales Management', 'How do I convert a quotation to an invoice?',
             'Open the approved quotation and click "Convert to Invoice". A new invoice will be created with all the same line items pre-filled. Review and submit.',
             ['quotation', 'convert', 'invoice']],

            ['Sales Management', 'How do I create a new customer?',
             'Go to Sales → Customers → New Customer. Fill in name, email, phone, billing/shipping address, default currency, payment terms, and credit limit.',
             ['customer', 'contact', 'create']],

            ['Sales Management', 'Can I apply a discount to an invoice line?',
             'Yes. Each invoice line has a "Discount %" and "Discount Amount" field. Any discount is subtracted from the line total before tax is applied.',
             ['invoice', 'discount', 'line-item']],

            ['Sales Management', 'What is a delivery note?',
             'A delivery note (DN) records that goods have been physically dispatched to a customer. It is linked to a sales invoice and helps track fulfilment separately from billing.',
             ['delivery-note', 'fulfilment', 'dispatch']],

            ['Sales Management', 'How do I view overdue invoices?',
             'In Sales → Invoices, use the Status filter to select "Overdue". The system flags any approved, unpaid invoice whose due date has passed.',
             ['invoice', 'overdue', 'filter']],

            ['Sales Management', 'Can I apply partial payments to an invoice?',
             'Yes. You can record multiple payments against the same invoice. The invoice status will show "Partial" until the full amount is paid.',
             ['invoice', 'partial-payment']],

            ['Sales Management', 'How do I add taxes to a sales invoice?',
             'When adding a line item, select the applicable tax rate from the Tax dropdown. The tax rates are configured in Settings → Tax Rates.',
             ['invoice', 'tax', 'vat']],

            // ── Purchase Management ─────────────────────────────────────────────────
            ['Purchase Management', 'How do I create a purchase order?',
             'Go to Purchase → Purchase Orders → New PO. Select the vendor, add line items, quantities, unit costs, and expected delivery date. Save as draft or submit for approval.',
             ['purchase-order', 'po', 'create']],

            ['Purchase Management', 'What is a goods receipt note (GRN)?',
             'A GRN records the physical receipt of goods against a purchase order. When a GRN is posted, stock levels in the warehouse are updated automatically.',
             ['grn', 'goods-receipt', 'stock']],

            ['Purchase Management', 'How do I create a vendor?',
             'Go to Purchase → Vendors → New Vendor. Add company name, contact person, email, phone, address, payment terms, default currency, and bank details.',
             ['vendor', 'supplier', 'create']],

            ['Purchase Management', 'What is a debit note?',
             'A debit note is issued to a vendor to request a credit when you have returned goods or been over-charged. It reduces the amount you owe the vendor.',
             ['debit-note', 'return', 'vendor']],

            ['Purchase Management', 'How do I record a vendor bill?',
             'After receiving goods (GRN), go to the purchase order and click "Create Vendor Bill". This converts the purchase into a payable entry in accounting.',
             ['vendor-bill', 'payable', 'accounting']],

            ['Purchase Management', 'Can I partially receive goods on a purchase order?',
             'Yes. When creating a GRN, you can enter the quantity actually received, which may be less than the ordered quantity. The PO stays open until fully received.',
             ['partial-receipt', 'grn', 'po']],

            ['Purchase Management', 'How are purchase costs linked to accounting?',
             'When a purchase order is approved and a GRN is posted, it updates stock valuation. When a vendor bill is approved, it posts to Accounts Payable and the appropriate expense/inventory account.',
             ['purchase', 'accounting', 'journal']],

            // ── Accounting ──────────────────────────────────────────────────────────
            ['Accounting', 'What is the Chart of Accounts?',
             'The Chart of Accounts (CoA) is a list of all GL accounts used to classify financial transactions: Assets, Liabilities, Equity, Revenue, and Expenses. You can customise it in Accounting → Accounts.',
             ['chart-of-accounts', 'coa', 'gl']],

            ['Accounting', 'How do I create a manual journal entry?',
             'Go to Accounting → Journal Entries → New Entry. Select the date, reference, and add debit/credit lines ensuring they balance. Attach documents if needed, then post.',
             ['journal', 'manual', 'entry']],

            ['Accounting', 'What is a cost centre?',
             'Cost centres let you track income and expenses by department, project, or business unit — e.g. Marketing, Operations, Project Alpha. Assign cost centres to journal lines for detailed P&L.',
             ['cost-centre', 'department', 'project']],

            ['Accounting', 'How do I set up account groups?',
             'Go to Accounting → Account Groups. Groups organise accounts into hierarchy (e.g. Current Assets → Cash & Bank → Petty Cash). Each account must belong to a group.',
             ['account-group', 'hierarchy', 'coa']],

            ['Accounting', 'What is a budget, and how do I configure one?',
             'A budget lets you set monthly or annual spending/revenue targets per account or cost centre. Go to Accounting → Budgets → New Budget. Reports will show actual vs. budget variances.',
             ['budget', 'forecast', 'variance']],

            ['Accounting', 'What does "posting" a journal entry mean?',
             'Posting permanently records the journal entry in the general ledger, updates account balances, and generates a unique journal number. Posted entries cannot be deleted — only reversed via a counter-entry.',
             ['journal', 'post', 'gl']],

            ['Accounting', 'How do I view an account ledger?',
             'Go to Reports → Ledger Report. Select the account, date range, and click View. You will see all debit/credit transactions affecting that account with running balance.',
             ['ledger', 'report', 'account']],

            // ── Finance ─────────────────────────────────────────────────────────────
            ['Finance', 'How do I record a payment to a vendor?',
             'Go to Finance → Payments → New Payment. Choose type "Vendor Payment", select the vendor, bank account, amount, date, and method. The system will automatically apply it to open payables.',
             ['payment', 'vendor', 'pay']],

            ['Finance', 'How do I record a customer receipt?',
             'Go to Finance → Payments → New Payment. Choose type "Customer Receipt". Select the customer and it will show outstanding invoices. Enter the amount received and confirm.',
             ['receipt', 'customer', 'payment']],

            ['Finance', 'What is bank reconciliation?',
             'Bank reconciliation matches your AccounTech BD bank account transactions with the actual bank statement. Go to Finance → Bank Reconciliation, import or enter your bank statement, and match items.',
             ['bank-reconciliation', 'bank', 'statement']],

            ['Finance', 'How do I add a bank account?',
             'Go to Finance → Bank Accounts → New Account. Enter bank name, account number, currency, and the linked GL account. You can have multiple accounts in different currencies.',
             ['bank-account', 'finance', 'setup']],

            ['Finance', 'How do I record a business expense?',
             'Go to Finance → Expenses → New Expense. Fill in date, description, expense category account, amount, and the bank/cash account used. Attach a receipt image if needed.',
             ['expense', 'record', 'finance']],

            ['Finance', 'Can I process payments in foreign currencies?',
             'Yes. Select the currency when recording a payment. AccounTech BD uses the exchange rate configured in Settings → Currencies. Unrealised/realised forex gains and losses are tracked automatically.',
             ['currency', 'forex', 'payment']],

            // ── Inventory ───────────────────────────────────────────────────────────
            ['Inventory', 'How do I add a new product?',
             'Go to Inventory → Products → New Product. Fill in name, SKU, category, unit of measure, cost price, selling price, tax rate, and the warehouse location. Enable "Track Inventory" to manage stock.',
             ['product', 'inventory', 'create']],

            ['Inventory', 'How do I create a product category?',
             'Go to Inventory → Product Categories → New Category. Give it a name and optionally a parent category for hierarchical classification.',
             ['product-category', 'inventory']],

            ['Inventory', 'How do I add or manage warehouses?',
             'Go to Inventory → Warehouses → New Warehouse. Enter the warehouse name, code, and address. Multiple warehouses allow stock tracking per location.',
             ['warehouse', 'location', 'inventory']],

            ['Inventory', 'What is a stock movement?',
             'A stock movement is a record of any change in inventory quantity: sales (out), purchases (in), transfers between warehouses, or manual adjustments. All movements are logged with date and reference.',
             ['stock-movement', 'inventory', 'log']],

            ['Inventory', 'How do I do a stock adjustment?',
             'Go to Inventory → Stock Movements → New Adjustment. Select the product, warehouse, adjustment type (add/remove), quantity, and reason. This updates stock immediately.',
             ['stock-adjustment', 'inventory', 'manual']],

            ['Inventory', 'How does AccounTech BD calculate stock valuation?',
             'Stock is valued using the Average Cost method by default. When goods are received, the weighted average unit cost is recalculated. Cost flows are linked to the COGS account when goods are sold.',
             ['valuation', 'cogs', 'average-cost']],

            ['Inventory', 'Can I set a reorder level for products?',
             'Yes. In the product form, set the "Minimum Stock" (reorder point). Inventory reports and dashboard alerts will flag products when stock falls below this level.',
             ['reorder', 'minimum-stock', 'alert']],

            ['Inventory', 'How do I transfer stock between warehouses?',
             'Go to Inventory → Stock Movements → New Transfer. Select source warehouse, destination warehouse, product, and quantity. This creates two movements (out from source, in to destination).',
             ['transfer', 'warehouse', 'inventory']],

            // ── HR ──────────────────────────────────────────────────────────────────
            ['Human Resources', 'How do I add an employee?',
             'Go to HR → Employees → New Employee. Fill in personal details, contact information, department, designation, joining date, and the applicable salary structure.',
             ['employee', 'hr', 'add']],

            ['Human Resources', 'How do I run payroll?',
             'Go to HR → Payroll → New Payroll Run. Select the pay period, choose employees (or select all), and click "Generate". The system calculates earnings and deductions based on salary components. Post after review.',
             ['payroll', 'hr', 'salary']],

            ['Human Resources', 'What are salary components?',
             'Salary components are individual earning or deduction items — e.g. Basic Salary, House Rent Allowance, Medical Allowance, Provident Fund, Tax Deduction. Configure them in HR → Salary Components.',
             ['salary-component', 'payroll', 'hr']],

            ['Human Resources', 'How do I manage leave requests?',
             'Employees submit leave requests via HR → Leaves → New Request. Managers can approve or reject. The system tracks leave balances per employee per leave type.',
             ['leave', 'hr', 'absence']],

            ['Human Resources', 'How do I set up leave types?',
             'Go to HR → Leave Types → New. Define the leave name (e.g. Annual Leave, Sick Leave), allowed days per year, whether it is paid, and if it carries over.',
             ['leave-type', 'hr', 'policy']],

            ['Human Resources', 'How do I create departments and designations?',
             'Go to HR → Departments → New. Then HR → Designations → New. These are used when creating employees and in org-chart reporting.',
             ['department', 'designation', 'hr']],

            ['Human Resources', 'Can I export payroll to a bank transfer file?',
             'AccounTech BD generates a payroll summary report that can be exported to PDF or CSV. Direct bank-file export (e.g. BEFTN format) is on the product roadmap.',
             ['payroll', 'export', 'bank']],

            // ── POS ─────────────────────────────────────────────────────────────────
            ['Point of Sale (POS)', 'How do I start a POS session?',
             'Go to POS from the main menu. Click "Open Session". The POS screen will launch in full-screen mode. Select products, add to basket, choose payment method, and complete the transaction.',
             ['pos', 'session', 'open']],

            ['Point of Sale (POS)', 'Which payment methods does POS support?',
             'AccounTech BD POS supports Cash, Card, Mobile Banking (bKash/Nagad/Rocket), and split payments across methods in a single transaction.',
             ['pos', 'payment-method', 'cash']],

            ['Point of Sale (POS)', 'Can I issue a refund from POS?',
             'Yes. Go to the POS transaction history, find the sale, and click "Refund". Select items to refund and the refund method. Stock is returned automatically.',
             ['pos', 'refund', 'return']],

            ['Point of Sale (POS)', 'How do POS transactions appear in accounting?',
             'At session close, AccounTech BD posts a journal entry summarising total cash/card collections, sales revenue, and tax collected — keeping POS in sync with the general ledger.',
             ['pos', 'accounting', 'journal']],

            ['Point of Sale (POS)', 'How do I close a POS session?',
             'Click "Close Session" in POS. Count your cash, enter the closing cash balance. The system will highlight any discrepancy from expected cash. Confirm to close and generate the session report.',
             ['pos', 'close', 'session']],

            ['Point of Sale (POS)', 'Can I apply discounts in POS?',
             'Yes. During a transaction, you can apply a line-item discount or an overall order discount as a percentage or fixed amount before completing the sale.',
             ['pos', 'discount']],

            // ── Fixed Assets ────────────────────────────────────────────────────────
            ['Fixed Assets', 'How do I register a fixed asset?',
             'Go to Fixed Assets → Assets → New Asset. Enter asset name, category, purchase date, purchase cost, useful life (years), depreciation method, and the linked GL account.',
             ['asset', 'register', 'fixed-assets']],

            ['Fixed Assets', 'What depreciation methods are supported?',
             'AccounTech BD supports Straight-Line (SLM) and Written-Down Value / Declining Balance (WDV) methods. Choose the method per asset when creating it.',
             ['depreciation', 'slm', 'wdv', 'fixed-assets']],

            ['Fixed Assets', 'How is depreciation calculated and posted?',
             'Run the periodic depreciation process from Fixed Assets → Depreciate. The system calculates the depreciation amount per asset and posts journal entries to the Depreciation Expense and Accumulated Depreciation accounts.',
             ['depreciation', 'posting', 'journal']],

            ['Fixed Assets', 'What are asset categories used for?',
             'Asset categories group assets (e.g. Computer Equipment, Office Furniture, Vehicles) and link them to standard GL accounts — cost account, accumulated depreciation, and depreciation expense.',
             ['asset-category', 'fixed-assets', 'gl']],

            ['Fixed Assets', 'How do I dispose of an asset?',
             'Open the asset record and click "Dispose". Enter the disposal date, sale proceeds (if any). The system calculates gain or loss and posts the appropriate journal entry.',
             ['asset', 'dispose', 'sale']],

            // ── Reports ─────────────────────────────────────────────────────────────
            ['Reports', 'What reports are available in AccounTech BD?',
             'Available reports include: Balance Sheet, Profit & Loss, Trial Balance, General Ledger, Cash Book, Sales Register, Purchase Register, Customer Statement, Vendor Statement, Expense Report, Payroll Summary, Inventory Summary, and more.',
             ['reports', 'list', 'financial']],

            ['Reports', 'How do I generate a Profit & Loss statement?',
             'Go to Reports → Profit & Loss. Set the date range (e.g. current fiscal year), select cost centres if needed, and click Generate. Export to PDF or Excel.',
             ['profit-and-loss', 'p&l', 'report']],

            ['Reports', 'How does the Balance Sheet report work?',
             'The Balance Sheet shows Assets = Liabilities + Equity at a specific date. Go to Reports → Balance Sheet, set the date, and generate. It pulls live balances from the general ledger.',
             ['balance-sheet', 'report', 'financial']],

            ['Reports', 'What is the Trial Balance report?',
             'The Trial Balance lists all GL accounts with their total debit and credit balances for a period. Debits must equal credits. Use it to check for posting errors.',
             ['trial-balance', 'report', 'audit']],

            ['Reports', 'How do I get the Cash Book report?',
             'Go to Reports → Cash Book. Select the bank/cash account and date range. It shows all inflows and outflows with running balance, similar to a bank statement.',
             ['cash-book', 'report', 'bank']],

            ['Reports', 'Can I export reports to Excel or PDF?',
             'Yes. Every report page has "Export PDF" and "Export Excel" buttons. The Excel export downloads a .xlsx file; the PDF export uses your browser\'s print-to-PDF or a server-side generator.',
             ['export', 'excel', 'pdf', 'report']],

            ['Reports', 'What is the Sales Register report?',
             'The Sales Register lists all sales invoices for a period — invoice number, customer, date, amount, tax, and status. Use it for GST/VAT return preparation.',
             ['sales-register', 'vat', 'gst', 'report']],

            ['Reports', 'How do I get a customer account statement?',
             'Go to Reports → Customer Statement. Select the customer and date range. The statement shows all invoices, payments, and the outstanding balance — useful for sending to customers.',
             ['customer-statement', 'report', 'ageing']],

            // ── Settings ────────────────────────────────────────────────────────────
            ['Settings', 'How do I set up my company details?',
             'Go to Settings → Company. Enter your company name, registration number, address, email, phone, logo, default currency, time zone, and fiscal year start month. Save changes.',
             ['company', 'settings', 'setup']],

            ['Settings', 'How do I configure tax rates?',
             'Go to Settings → Tax Rates → New Tax Rate. Enter the name (e.g. VAT 15%), rate percentage, and type (VAT/Sales Tax/Withholding). Rates are available in invoice line items.',
             ['tax', 'vat', 'settings']],

            ['Settings', 'How do I manage currencies?',
             'Go to Settings → Currencies. Add foreign currencies with their ISO code and exchange rate vs. your base currency. You can update rates manually at any time.',
             ['currency', 'exchange-rate', 'settings']],

            ['Settings', 'What is a fiscal year, and how do I configure it?',
             'A fiscal year is your accounting period (e.g. July 1 – June 30). Go to Settings → Fiscal Years → New Fiscal Year. Set start and end dates. Transactions and reports respect fiscal year boundaries.',
             ['fiscal-year', 'accounting-period', 'settings']],

            ['Settings', 'How do I set up units of measurement?',
             'Go to Settings → Units → New Unit. Add units like kg, pcs, box, litre. These are selected on product and invoice line items.',
             ['units', 'measurement', 'settings']],

            ['Settings', 'How do I upload my company logo?',
             'Go to Settings → Company and click the logo upload area. Upload a PNG or JPG (max 2 MB). The logo will appear on invoices, quotations, and the sidebar.',
             ['logo', 'company', 'settings']],

            ['Settings', 'How do I change the default currency?',
             'Go to Settings → Company and change the "Base Currency" dropdown. Note: changing this after transactions have been posted may affect historical reports.',
             ['currency', 'default', 'settings']],

            // ── Users & Permissions ─────────────────────────────────────────────────
            ['Users & Permissions', 'How do I create a new user?',
             'Go to Settings → Users → New User. Enter name, email, role, and optional password. The user will receive an invitation email to set their own password.',
             ['user', 'create', 'access']],

            ['Users & Permissions', 'What roles are available?',
             'By default: Super Admin (full access), Admin (company-wide), Accountant, Sales Manager, Purchase Manager, HR Manager, Inventory Manager, Cashier, and Viewer. Additional custom roles can be created.',
             ['roles', 'permissions', 'access']],

            ['Users & Permissions', 'How do I create a custom role?',
             'Go to Settings → Roles & Permissions → New Role. Name the role, then toggle on/off each granular permission (view, create, edit, delete for every module). Save and assign to users.',
             ['role', 'custom', 'permissions']],

            ['Users & Permissions', 'What is the Super Admin role?',
             'Super Admin has unrestricted access to all modules, including company management, user administration, audit logs, login history, and all settings. This role cannot be deleted.',
             ['super-admin', 'role', 'permissions']],

            ['Users & Permissions', 'How do I deactivate a user without deleting them?',
             'Go to Settings → Users → edit the user. Toggle "Active" to off. The user can no longer log in but their historical data and audit trail are preserved.',
             ['user', 'deactivate', 'disable']],

            ['Users & Permissions', 'What happens if a user tries to access a module they do not have permission for?',
             'They will see a "403 Forbidden" access denied page. Navigation items for modules they cannot access are hidden in the sidebar automatically.',
             ['permissions', '403', 'access-denied']],

            ['Users & Permissions', 'Can I restrict a user to a single module?',
             'Yes. Create a custom role with only the required module\'s permissions enabled (e.g. only Sales → View and Sales → Create). Assign this role to the user.',
             ['role', 'restrict', 'custom']],

            // ── Audit & Security ────────────────────────────────────────────────────
            ['Audit & Security', 'What is the Audit Log?',
             'The Audit Log (Settings → Audit Logs) records every create, update, and delete action performed by users, including the before/after values, timestamp, user, IP address, and the URL accessed. Only Super Admins can view it.',
             ['audit-log', 'security', 'super-admin']],

            ['Audit & Security', 'Who can see the Audit Logs?',
             'Only Super Admin users can access Settings → Audit Logs. This is enforced both at the route level and in the controller.',
             ['audit-log', 'access', 'super-admin']],

            ['Audit & Security', 'What is Login History?',
             'Login History (Settings → Login History) shows every login, logout, and failed login attempt: timestamp, user, IP address, browser, platform, device type, and session duration. Only Super Admins can view it.',
             ['login-history', 'security', 'super-admin']],

            ['Audit & Security', 'How do I investigate a suspicious login?',
             'Go to Settings → Login History. Filter by the suspect username or email. Review the IP addresses, browser, and timestamps. Unusual locations or off-hours access may indicate unauthorised access.',
             ['login-history', 'security', 'investigation']],

            ['Audit & Security', 'Can I see what data was changed in an audit log entry?',
             'Yes. In Settings → Audit Logs, click the "Diff" button next to any entry that has change data. A modal will show Before/After values side-by-side per field, highlighted for easy comparison.',
             ['audit-log', 'diff', 'changes']],

            ['Audit & Security', 'Are failed login attempts recorded?',
             'Yes. Failed login attempts are captured in Login History with event type "Failed", including the IP address and timestamp. This helps detect brute-force attacks.',
             ['login', 'failed', 'security', 'brute-force']],

            ['Audit & Security', 'How long are audit logs retained?',
             'By default, audit logs are retained indefinitely. Your database administrator can configure archiving or purging policies externally if storage becomes a concern.',
             ['audit-log', 'retention', 'purge']],

            ['Audit & Security', 'Does the system log when a user deletes a record?',
             'Yes. Delete operations are captured with the full snapshot of the record\'s data before deletion, so you always have a trace of what was removed and by whom.',
             ['audit-log', 'delete', 'security']],

            // Extra cross-module questions ────────────────────────────────────────────
            ['Getting Started', 'What browsers are supported?',
             'AccounTech BD works best on modern browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari (macOS/iOS). We recommend using the latest version for the best experience.',
             ['browser', 'compatibility']],

            ['Getting Started', 'Is my data backed up automatically?',
             'Data backup depends on your server configuration. If hosted on a managed server, daily backups are typically included. For self-hosted setups, configure MySQL automated backups via XAMPP or your hosting panel.',
             ['backup', 'data', 'security']],

            ['Settings', 'How do I change the fiscal year start month?',
             'Go to Settings → Fiscal Years and create a new fiscal year with the desired start/end dates. Then go to Settings → Company and set it as the active fiscal year.',
             ['fiscal-year', 'start', 'settings']],

            ['Accounting', 'How do I reverse a posted journal entry?',
             'Open the journal entry and click "Reverse". A counter-entry with swapped debits/credits will be created and posted. The original entry is marked as reversed.',
             ['journal', 'reverse', 'correction']],

            ['Sales Management', 'Can I print an invoice with my company letterhead?',
             'Yes. AccounTech BD invoice PDFs include your company name, address, logo, and contact details as configured in Settings → Company.',
             ['invoice', 'print', 'letterhead']],

            ['Purchase Management', 'How do I search for a vendor by name?',
             'In Purchase → Vendors, use the search bar at the top to filter vendors by name, email, or phone. You can also use the column headers to sort.',
             ['vendor', 'search', 'filter']],

            ['Inventory', 'What is the difference between a product and a service?',
             'A product has inventory tracking enabled (stock is counted). A service (like consulting) has inventory tracking disabled — it appears on invoices but does not affect the stock register.',
             ['product', 'service', 'inventory']],

            ['Finance', 'What is the difference between a payment and a journal entry?',
             'A payment (Finance → Payments) is a structured voucher specifically for recording money in/out against invoices or payables, using pre-defined accounts. A manual journal entry gives you raw debit/credit control for any account.',
             ['payment', 'journal', 'difference']],

            ['Human Resources', 'How do I print pay slips?',
             'After posting a payroll run, go to HR → Payroll → select the run → click "Pay Slips". You can print individual or bulk pay slips as PDF.',
             ['payroll', 'pay-slip', 'print']],

            ['Reports', 'Can I filter reports by department/cost centre?',
             'Yes. P&L and Ledger reports support a cost centre filter. Select a specific cost centre (linked to departments) to see income and expenses attributable to that unit.',
             ['report', 'cost-centre', 'department']],

            ['Point of Sale (POS)', 'How do I add a barcode scanner to POS?',
             'AccounTech BD POS accepts keyboard-input barcodes. Connect a USB or Bluetooth barcode scanner — it will act as a keyboard and enter the product SKU directly into the search box.',
             ['pos', 'barcode', 'scanner']],

            ['Audit & Security', 'Can I filter audit logs by module?',
             'Yes. In Settings → Audit Logs, use the Module dropdown filter to restrict results to a specific module such as "Invoice", "Employee", or "Payment".',
             ['audit-log', 'filter', 'module']],

            ['Users & Permissions', 'How do permissions work across multiple companies?',
             'Roles and permissions are company-scoped. A user with Admin role in Company A does not automatically have access to Company B. Super Admin access is global across all companies.',
             ['permissions', 'multi-company', 'access']],

            ['Getting Started', 'How do I reset the application to a clean state for testing?',
             'Run `php artisan migrate:fresh --seed` in your terminal. WARNING: this destroys all existing data and re-seeds defaults. Never run this on a production database.',
             ['reset', 'fresh', 'migrate', 'testing']],

            ['Getting Started', 'Where can I get support for AccounTech BD?',
             'Support is available via the built-in Knowledge Base (FAQ), email support, and the user community forum. Super Admins have access to the full Knowledge Base management panel.',
             ['support', 'help', 'faq']],
        ];

        // ── Insert FAQs ───────────────────────────────────────────────────────────
        foreach ($faqs as $i => [$catName, $question, $answer, $tags]) {
            $catId = $catMap[$catName] ?? null;
            if (!$catId) continue;

            Faq::firstOrCreate(
                [
                    'company_id'      => $companyId,
                    'faq_category_id' => $catId,
                    'question'        => $question,
                ],
                [
                    'answer'      => $answer,
                    'tags'        => $tags,
                    'is_published'=> true,
                    'views'       => rand(10, 500),
                    'helpful_yes' => rand(5, 100),
                    'helpful_no'  => rand(0, 10),
                    'sort_order'  => $i + 1,
                ]
            );
        }

        $total = count($faqs);
        $this->command->info("FaqSeeder: created {$total} FAQs across " . count($categories) . " categories for company_id={$companyId}.");
    }
}
