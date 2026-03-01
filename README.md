# Laravel + React

A single full-stack project using **Laravel 12** (backend) and **React 18** (frontend) connected via **Inertia.js**, powered by **Vite** for fast HMR.

## Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Backend  | Laravel 12            |
| Frontend | React 18 + Inertia.js |
| Bundler  | Vite                  |
| Auth     | Laravel Breeze        |
| Database | SQLite (default)      |

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm

## Getting Started

### 1. Install PHP dependencies

```bash
composer install
```

### 2. Set up environment

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Run migrations

```bash
php artisan migrate
```

### 4. Install JS dependencies

```bash
npm install
```

### 5. Start development servers

Run both in separate terminals:

**Terminal 1 — Laravel backend:**

```bash
php artisan serve
```

**Terminal 2 — Vite dev server (React HMR):**

```bash
npm run dev
```

Open `http://localhost:8000` in your browser.

## Build for Production

```bash
npm run build
```

## Project Structure

```
laravel-react/
├── app/                  # Laravel application logic (Models, Controllers, etc.)
├── resources/
│   ├── js/               # React source files
│   │   ├── Components/   # Reusable React components
│   │   ├── Layouts/      # Layout components
│   │   └── Pages/        # Inertia page components (mapped to Laravel routes)
│   └── views/
│       └── app.blade.php # Single Blade entry point
├── routes/
│   ├── web.php           # Web routes returning Inertia responses
│   └── auth.php          # Authentication routes
├── vite.config.js        # Vite + Laravel plugin configuration
└── .env                  # Environment variables
```

## How It Works

- **Inertia.js** acts as the glue — no REST API needed between Laravel and React.
- Laravel controllers return `Inertia::render('PageName', $props)` instead of Blade views.
- React page components live in `resources/js/Pages/` and receive props directly from controllers.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
