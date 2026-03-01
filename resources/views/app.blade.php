<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'AccounTech BD') }}</title>

        <!-- ── Favicon & App Icons ─────────────────────────────────────── -->
        <!-- Classic ICO — all browsers -->
        <link rel="icon" href="/favicon.ico" sizes="any">
        <!-- SVG favicon — modern browsers (sharp, scales infinitely) -->
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <!-- PNG fallbacks -->
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
        <!-- Apple touch icon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <!-- PWA Web Manifest -->
        <link rel="manifest" href="/site.webmanifest">
        <!-- Theme colour (browser UI) -->
        <meta name="theme-color" content="#2563eb">
        <meta name="msapplication-TileColor" content="#2563eb">
        <meta name="msapplication-TileImage" content="/logo-256.png">

        <!-- ── Open Graph / Social ─────────────────────────────────────── -->
        <meta property="og:title" content="AccounTech BD — Complete ERP Software">
        <meta property="og:description" content="Accounting · Sales · HR · POS · Fixed Assets — all in one Laravel 12 + React platform.">
        <meta property="og:image" content="/logo-og.png">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:image" content="/logo-512.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
