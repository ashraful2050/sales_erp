# Sales ERP — Laravel 12 + React 18

> A full-featured, multi-tenant Sales ERP & CRM platform built with **Laravel 12**, **React 18**, **Inertia.js**, and **Tailwind CSS**.

---

## Features at a Glance

| Module                     | Key Capabilities                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Accounting**             | Chart of Accounts, Journal Entries, Vouchers, Opening Balances, Payment Methods                                    |
| **Sales**                  | Invoices, Quotations, Credit Notes, Delivery Notes, Pricing & Discount Rules, Loyalty, Commissions, Sales Channels |
| **CRM**                    | Leads, Pipeline Management, Customer Segments, Activities                                                          |
| **Purchase**               | Purchase Orders, Vendors, Goods Receipts, Debit Notes                                                              |
| **Inventory**              | Products, Warehouses, Categories, Stock Movements                                                                  |
| **Finance**                | Payments, Bank Accounts, Expenses                                                                                  |
| **HR & Payroll**           | Employees, Departments, Designations, Payroll, Leaves                                                              |
| **Assets**                 | Fixed Assets, Depreciation                                                                                         |
| **POS**                    | POS Terminal, POS Reports                                                                                          |
| **Reports**                | Trial Balance, P&L, Balance Sheet, Cash Flow, AR/AP Aging, Tax, Payroll, and more                                  |
| **Analytics & AI**         | Sales Dashboard, Customer Feedback                                                                                 |
| **Industrial Engineering** | Process Optimization, KPI Analytics, Demand Forecasting, Cost-to-Serve, Simulation                                 |
| **Tasks & Support**        | Task Management, Support Tickets                                                                                   |
| **Users & Roles**          | Multi-tenant, Role-based access control, SuperAdmin/Admin/Sub-user hierarchy                                       |
| **FAQ**                    | Knowledge base with categories                                                                                     |
| **Multi-tenancy**          | Company isolation, Plans & Subscriptions                                                                           |

---

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Backend  | PHP 8.2+, Laravel 12            |
| Frontend | React 18, Inertia.js 2          |
| Styling  | Tailwind CSS 3, Headless UI     |
| Bundler  | Vite 7                          |
| Charts   | Recharts                        |
| Icons    | Lucide React                    |
| Auth     | Laravel Breeze (Inertia/React)  |
| Database | MySQL 8+ (recommended) / SQLite |

---

## Server Requirements

- **PHP** >= 8.2 with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.0 (or MariaDB >= 10.6)
- **Web server:** Apache 2.4+ or Nginx 1.18+ with `mod_rewrite` enabled

---

## Quick Installation

### 1. Extract & configure environment

```bash
cp .env.example .env
```

Open `.env` and update:

```dotenv
APP_NAME="Sales ERP"
APP_URL=http://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sales_erp
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### 2. Install PHP dependencies

```bash
composer install --optimize-autoloader --no-dev
```

### 3. Generate application key

```bash
php artisan key:generate
```

### 4. Run database migrations and seed

```bash
php artisan migrate --seed
```

> Default superadmin credentials after seeding:
>
> - **Email:** `admin@example.com`
> - **Password:** `Admin@1234`
>
> **Change these immediately after first login.**

### 5. Install JS dependencies and build assets

```bash
npm install
npm run build
```

### 6. Set storage permissions (Linux/Mac)

```bash
chmod -R 775 storage bootstrap/cache
php artisan storage:link
```

### 7. Optimize for production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Apache / Nginx Configuration

### Apache

Point your virtual host `DocumentRoot` to the `/public` directory:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/sales_erp/public

    <Directory /path/to/sales_erp/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Ensure `mod_rewrite` is enabled: `a2enmod rewrite`

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/sales_erp/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## Queue Worker (Recommended)

For email notifications and background jobs, run a queue worker:

```bash
php artisan queue:work --queue=default --tries=3
```

For production, use **Supervisor** to keep the worker running.

---

## Local Development

Run all services with a single command:

```bash
composer run dev
```

Or start each manually:

```bash
php artisan serve          # Laravel backend  — http://localhost:8000
npm run dev                # Vite HMR dev server
php artisan queue:listen   # Queue worker
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Support

For support, use the **Comments** section on the item page, or contact via the Envato profile.

---

## License

Licensed under the [Envato Regular License](https://codecanyon.net/licenses/standard). One license per installation.
