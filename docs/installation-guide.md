# Sales ERP — Installation Guide

> Detailed step-by-step installation instructions for setting up Sales ERP on a production server.

---

## Table of Contents

1. [Server Requirements](#1-server-requirements)
2. [Quick Start (Shared Hosting / cPanel)](#2-quick-start-shared-hosting--cpanel)
3. [VPS / Dedicated Server (Linux)](#3-vps--dedicated-server-linux)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [First Login & Initial Setup](#5-first-login--initial-setup)
6. [Configuring Mail](#6-configuring-mail)
7. [Queue Workers & Scheduler](#7-queue-workers--scheduler)
8. [HTTPS / SSL](#8-https--ssl)
9. [Upgrading to a New Version](#9-upgrading-to-a-new-version)
10. [Uninstallation](#10-uninstallation)

---

## 1. Server Requirements

| Requirement    | Minimum                                                                          | Recommended    |
| -------------- | -------------------------------------------------------------------------------- | -------------- |
| PHP            | 8.2                                                                              | 8.3            |
| PHP Extensions | BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, PDO_MySQL, Tokenizer, XML | Same + OPcache |
| Composer       | 2.x                                                                              | Latest         |
| Node.js        | 18.x                                                                             | 20.x LTS       |
| npm            | 9.x                                                                              | 10.x           |
| MySQL          | 8.0                                                                              | 8.0+           |
| MariaDB (alt.) | 10.6                                                                             | 10.11+         |
| Web Server     | Apache 2.4 / Nginx 1.18                                                          | Nginx          |
| Storage        | 500 MB                                                                           | 2 GB+          |
| RAM            | 512 MB                                                                           | 1 GB+          |

---

## 2. Quick Start (Shared Hosting / cPanel)

> **Note:** Shared hosting must support PHP 8.2+ SSH access, Composer, and MySQL.

### Step 1 — Upload files

1. Extract the purchased ZIP file locally.
2. Upload all contents to your hosting account (e.g., `public_html/erp/`).
3. Create a database and user via cPanel → MySQL Databases.

### Step 2 — Configure environment

1. Rename `.env.example` to `.env` via the File Manager.
2. Edit `.env` and fill in your database and app URL:

```dotenv
APP_NAME="Sales ERP"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### Step 3 — Set document root

In cPanel → Domains (or Addon Domains), set the document root to:

```
/home/username/public_html/erp/public
```

### Step 4 — Run via SSH

```bash
cd ~/public_html/erp
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> If Node.js is available on the server: `npm install && npm run build`
>
> Otherwise, the pre-built `public/build/` assets included in the package are ready to use.

---

## 3. VPS / Dedicated Server (Linux)

### Prerequisites

```bash
# PHP 8.2
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring \
  php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip php8.2-fileinfo php8.2-opcache

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# Nginx
sudo apt install nginx

# MySQL 8
sudo apt install mysql-server
```

### Deploy application

```bash
# Clone or extract to /var/www/sales_erp
sudo chown -R www-data:www-data /var/www/sales_erp
sudo chmod -R 755 /var/www/sales_erp
sudo chmod -R 775 /var/www/sales_erp/storage
sudo chmod -R 775 /var/www/sales_erp/bootstrap/cache

cd /var/www/sales_erp

# Environment
cp .env.example .env
nano .env   # Fill in DB, URL, mail, etc.

# Dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# Application setup
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Nginx virtual host

Create `/etc/nginx/sites-available/sales_erp`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/sales_erp/public;
    index index.php;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
        gzip_static on;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/sales_erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Environment Variables Reference

### Application

| Key         | Description                                | Example                   |
| ----------- | ------------------------------------------ | ------------------------- |
| `APP_NAME`  | App name used in UI and emails             | `Sales ERP`               |
| `APP_ENV`   | Environment (`production` / `local`)       | `production`              |
| `APP_DEBUG` | Show errors — always `false` in production | `false`                   |
| `APP_URL`   | Full base URL                              | `https://your-domain.com` |
| `APP_KEY`   | Encryption key (auto-generated)            | `base64:...`              |

### Database

| Key             | Description           |
| --------------- | --------------------- |
| `DB_CONNECTION` | `mysql` or `sqlite`   |
| `DB_HOST`       | Database hostname     |
| `DB_PORT`       | Port (default `3306`) |
| `DB_DATABASE`   | Database name         |
| `DB_USERNAME`   | Database username     |
| `DB_PASSWORD`   | Database password     |

### Mail

| Key                 | Description                     |
| ------------------- | ------------------------------- |
| `MAIL_MAILER`       | `smtp`, `log`, `mailgun`, `ses` |
| `MAIL_HOST`         | SMTP host                       |
| `MAIL_PORT`         | SMTP port (587 TLS / 465 SSL)   |
| `MAIL_USERNAME`     | SMTP username                   |
| `MAIL_PASSWORD`     | SMTP password                   |
| `MAIL_ENCRYPTION`   | `tls` or `ssl`                  |
| `MAIL_FROM_ADDRESS` | From email address              |
| `MAIL_FROM_NAME`    | Sender name                     |

### Queue & Cache

| Key                | Description     | Recommended |
| ------------------ | --------------- | ----------- |
| `QUEUE_CONNECTION` | Queue driver    | `database`  |
| `CACHE_STORE`      | Cache driver    | `database`  |
| `SESSION_DRIVER`   | Session storage | `database`  |

---

## 5. First Login & Initial Setup

1. Navigate to `https://your-domain.com/login`
2. Log in with default credentials:
    - **Email:** `admin@example.com`
    - **Password:** `Admin@1234`
3. **Immediately** go to Profile → Change Password
4. Go to **Settings → Company** — update your company name, logo, and currency
5. Go to **Settings → Tax Rates** — configure applicable tax rates
6. Go to **Settings → Fiscal Years** — define your current fiscal year
7. Go to **Accounting → Chart of Accounts** — review and customize the default accounts
8. Go to **Settings → Users** — create tenant Admin or sub-user accounts and assign roles

---

## 6. Configuring Mail

Update `.env` with your SMTP credentials, then clear config cache:

```bash
php artisan config:clear
php artisan config:cache
```

Test mail sending:

```bash
php artisan tinker
# Inside tinker:
Mail::raw('Test email from Sales ERP', function($m) {
    $m->to('you@example.com')->subject('Test');
});
```

### Popular providers

| Provider             | MAIL_HOST                            | MAIL_PORT |
| -------------------- | ------------------------------------ | --------- |
| Gmail (App Password) | `smtp.gmail.com`                     | 587       |
| Mailgun              | `smtp.mailgun.org`                   | 587       |
| SendGrid             | `smtp.sendgrid.net`                  | 587       |
| Amazon SES           | `email-smtp.us-east-1.amazonaws.com` | 587       |
| Mailtrap (testing)   | `sandbox.smtp.mailtrap.io`           | 587       |

---

## 7. Queue Workers & Scheduler

### Queue worker (required for emails & background jobs)

```bash
php artisan queue:work --queue=default --tries=3 --sleep=3 --timeout=60
```

### Supervisor configuration (recommended for production)

Create `/etc/supervisor/conf.d/sales_erp.conf`:

```ini
[program:sales_erp_queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sales_erp/artisan queue:work --tries=3 --sleep=3
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=2
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/sales_erp_queue.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start sales_erp_queue:*
```

### Task scheduler (cron)

Add to crontab (`crontab -e` as www-data / root):

```
* * * * * cd /var/www/sales_erp && php artisan schedule:run >> /dev/null 2>&1
```

---

## 8. HTTPS / SSL

### Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Update `.env`:

```dotenv
APP_URL=https://your-domain.com
```

Recache config:

```bash
php artisan config:cache
```

---

## 9. Upgrading to a New Version

1. **Backup** your database: `mysqldump -u root -p sales_erp > backup_$(date +%Y%m%d).sql`
2. **Backup** your `.env` file.
3. Replace all project files with the new version (keep your `.env`).
4. Run:

```bash
composer install --optimize-autoloader --no-dev
php artisan migrate
npm install && npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
```

---

## 10. Uninstallation

1. Drop the database: `DROP DATABASE sales_erp;`
2. Remove the project directory: `rm -rf /var/www/sales_erp`
3. Remove the Nginx virtual host and reload Nginx.
4. Remove the Supervisor config and reload Supervisor.

---

_For further help, visit the CodeCanyon item page comments section._
