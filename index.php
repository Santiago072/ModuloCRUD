<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Módulo CRUD | PWA de Encuestas & Censo Offline-First</title>
    <meta name="description" content="Aplicación Web Progresiva (PWA) Offline-First para brigadas y recolección de datos en campo sin conexión con Dexie.js, IndexedDB y exportación nativa a Excel (XLSX).">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        :root {
            --primary: #4338ca;
            --primary-light: #6366f1;
            --primary-soft: #e0e7ff;
            --accent: #0284c7;
            --emerald: #059669;
            --emerald-soft: #d1fae5;
            --amber: #d97706;
            --amber-soft: #fef3c7;
            --slate-900: #090d16;
            --slate-800: #131b2e;
            --slate-700: #2a3449;
            --slate-600: #475569;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --slate-50: #f8fafc;
            --shadow-subtle: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
            --shadow-card: 0 14px 34px -8px rgba(15, 23, 42, 0.09);
            --shadow-glow: 0 16px 36px -6px rgba(67, 56, 202, 0.25);
            --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
            overflow-x: hidden;
            background-image: 
                radial-gradient(at 15% 15%, rgba(67, 56, 202, 0.05) 0px, transparent 45%),
                radial-gradient(at 85% 85%, rgba(2, 132, 199, 0.06) 0px, transparent 45%);
            background-attachment: fixed;
        }

        /* Top Announcement Header */
        .top-announce-bar {
            background: linear-gradient(90deg, #090d16 0%, #171d34 50%, #090d16 100%);
            color: #c7d2fe;
            font-size: 0.8rem;
            padding: 8px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(99, 102, 241, 0.25);
        }

        .announce-badge {
            background: rgba(99, 102, 241, 0.25);
            color: #e0e7ff;
            padding: 2px 9px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.7rem;
            letter-spacing: 0.4px;
            border: 1px solid rgba(99, 102, 241, 0.4);
        }

        /* Floating Modern Navbar */
        .navbar-pwa {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--slate-200);
            padding: 14px 0;
        }

        .nav-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand-link {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            color: var(--slate-900);
        }

        .brand-icon-box {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #4338ca 0%, #0284c7 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 1.3rem;
            box-shadow: 0 8px 16px -3px rgba(67, 56, 202, 0.3);
        }

        .brand-title {
            font-size: 1.22rem;
            font-weight: 800;
            letter-spacing: -0.3px;
            color: var(--slate-900);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .brand-title span {
            color: var(--primary);
        }

        .brand-badge {
            font-size: 0.65rem;
            font-weight: 700;
            background: #eef2ff;
            color: #4338ca;
            padding: 2px 7px;
            border-radius: 99px;
            border: 1px solid #c7d2fe;
        }

        .brand-subtitle {
            font-size: 0.72rem;
            color: #64748b;
            font-weight: 500;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 28px;
            list-style: none;
        }

        .nav-link-item {
            text-decoration: none;
            color: #475569;
            font-size: 0.88rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: var(--transition);
        }

        .nav-link-item:hover {
            color: var(--primary);
        }

        .btn-launch-pwa {
            background: linear-gradient(135deg, #4338ca 0%, #312e81 100%);
            color: #ffffff;
            padding: 9px 20px;
            border-radius: 12px;
            font-size: 0.88rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow-glow);
            transition: var(--transition);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-launch-pwa:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 32px -6px rgba(67, 56, 202, 0.4);
        }

        /* Hero Layout - Mobile Field PWA Showcase */
        .hero-section {
            padding: 64px 0 80px 0;
            position: relative;
        }

        .hero-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 52px;
            align-items: center;
        }

        .hero-badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #eef2ff;
            color: #4338ca;
            padding: 6px 14px;
            border-radius: 99px;
            font-size: 0.78rem;
            font-weight: 700;
            border: 1px solid #c7d2fe;
            margin-bottom: 20px;
        }

        .hero-title {
            font-size: 3.3rem;
            line-height: 1.14;
            font-weight: 800;
            color: var(--slate-900);
            margin-bottom: 20px;
            letter-spacing: -0.8px;
        }

        .hero-title .gradient-text {
            background: linear-gradient(135deg, #4338ca 0%, #0284c7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-desc {
            font-size: 1.05rem;
            color: #475569;
            line-height: 1.75;
            margin-bottom: 32px;
            max-width: 580px;
        }

        .hero-actions {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 40px;
        }

        .btn-cta-primary {
            background: linear-gradient(135deg, #4338ca 0%, #312e81 100%);
            color: #ffffff;
            font-weight: 600;
            font-size: 0.95rem;
            padding: 14px 28px;
            border-radius: 12px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 9px;
            box-shadow: var(--shadow-glow);
            transition: var(--transition);
        }

        .btn-cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 36px -6px rgba(67, 56, 202, 0.45);
        }

        .btn-cta-secondary {
            background: #ffffff;
            color: #334155;
            font-weight: 600;
            font-size: 0.95rem;
            padding: 14px 24px;
            border-radius: 12px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 1px solid var(--slate-200);
            box-shadow: var(--shadow-subtle);
            transition: var(--transition);
        }

        .btn-cta-secondary:hover {
            border-color: #cbd5e1;
            color: var(--primary);
            transform: translateY(-2px);
        }

        .metrics-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            padding-top: 24px;
            border-top: 1px solid var(--slate-200);
        }

        .metric-item h4 {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--slate-900);
            line-height: 1;
        }

        .metric-item p {
            font-size: 0.74rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 6px;
        }

        /* Smartphone PWA Terminal Container (DISEÑO DIFERENCIADO MÓVIL PWA) */
        .mobile-device-stage {
            display: flex;
            justify-content: center;
            position: relative;
        }

        .mobile-device-stage::before {
            content: '';
            position: absolute;
            inset: 10px;
            background: linear-gradient(135deg, rgba(67, 56, 202, 0.3) 0%, rgba(2, 132, 199, 0.2) 100%);
            border-radius: 46px;
            filter: blur(30px);
            z-index: 1;
        }

        .smartphone-mockup {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 400px;
            background: #090d16;
            border-radius: 44px;
            padding: 12px;
            box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35);
            border: 4px solid #1e293b;
        }

        .smartphone-speaker {
            width: 80px;
            height: 5px;
            background: #334155;
            border-radius: 99px;
            margin: 6px auto 10px auto;
        }

        .smartphone-screen {
            background: #ffffff;
            border-radius: 34px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #e2e8f0;
        }

        .phone-status-bar {
            background: #0f172a;
            color: #f8fafc;
            padding: 10px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.72rem;
            font-family: 'JetBrains Mono', monospace;
        }

        .phone-net-badge {
            background: rgba(5, 150, 105, 0.25);
            color: #34d399;
            border: 1px solid rgba(52, 211, 153, 0.4);
            padding: 2px 8px;
            border-radius: 99px;
            font-size: 0.68rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: var(--transition);
        }

        .phone-net-badge.offline {
            background: rgba(217, 119, 6, 0.25);
            color: #fbbf24;
            border-color: rgba(251, 191, 36, 0.4);
        }

        .phone-app-header {
            background: #f8fafc;
            padding: 14px 18px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .phone-app-header h5 {
            font-size: 0.88rem;
            font-weight: 700;
            color: #0f172a;
        }

        .phone-app-body {
            padding: 16px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .phone-metric-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .phone-metric-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .phone-metric-box span {
            font-size: 0.68rem;
            color: #64748b;
            font-weight: 600;
            display: block;
        }

        .phone-metric-box h3 {
            font-size: 1.4rem;
            font-weight: 800;
            color: #0f172a;
            margin: 4px 0;
        }

        .phone-metric-box small {
            font-size: 0.64rem;
            font-weight: 600;
        }

        .phone-sim-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }

        .phone-sim-row {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem;
            background: #0f172a;
            color: #e2e8f0;
            padding: 10px 12px;
            border-radius: 8px;
            margin-bottom: 12px;
            line-height: 1.5;
        }

        .phone-sim-row .label { color: #94a3b8; }

        .phone-sim-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .btn-phone-record {
            background: #f1f5f9;
            color: #1e293b;
            border: 1px solid #cbd5e1;
            padding: 9px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-phone-record:hover { background: #e2e8f0; }

        .btn-phone-sync {
            background: #4338ca;
            color: #ffffff;
            border: none;
            padding: 9px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            transition: var(--transition);
        }

        .btn-phone-sync:hover { background: #3730a3; }

        /* SECCIÓN 1: MOTOR OFFLINE & DEXIE */
        .section-block {
            padding: 84px 0;
            border-bottom: 1px solid var(--slate-200);
        }

        .section-header {
            text-align: center;
            max-width: 720px;
            margin: 0 auto 50px auto;
        }

        .section-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--primary);
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .section-title {
            font-size: 2.25rem;
            font-weight: 800;
            color: var(--slate-900);
            letter-spacing: -0.5px;
            margin-bottom: 12px;
        }

        .section-desc {
            font-size: 0.98rem;
            color: #64748b;
            line-height: 1.65;
        }

        /* Layout Diferente: Grid Horizontal Dividido en Columnas */
        .motor-grid {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
        }

        .motor-feature-card {
            background: #ffffff;
            border: 1px solid var(--slate-200);
            border-radius: 18px;
            padding: 28px;
            box-shadow: var(--shadow-subtle);
            transition: var(--transition);
            display: flex;
            flex-direction: column;
        }

        .motor-feature-card:hover {
            transform: translateY(-5px);
            border-color: #c7d2fe;
            box-shadow: var(--shadow-card);
        }

        .card-icon-pill {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            margin-bottom: 18px;
        }

        .motor-feature-card h3 {
            font-size: 1.18rem;
            font-weight: 700;
            color: var(--slate-900);
            margin-bottom: 10px;
        }

        .motor-feature-card p {
            font-size: 0.88rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 18px;
            flex-grow: 1;
        }

        .feature-bullets {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 0.8rem;
            color: #334155;
            padding-top: 14px;
            border-top: 1px solid var(--slate-200);
        }

        .feature-bullets li {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* SECCIÓN 2: MODO CAMPO (NUEVO DISEÑO CON ANCHOR id="modo-campo") */
        .field-mode-section {
            padding: 84px 0;
            background: #ffffff;
            border-bottom: 1px solid var(--slate-200);
        }

        .field-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
        }

        .field-interactive-panel {
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            border-radius: 24px;
            border: 1px solid #cbd5e1;
            padding: 44px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: center;
        }

        .field-steps {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .field-step-item {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            background: #ffffff;
            padding: 18px;
            border-radius: 14px;
            border: 1px solid var(--slate-200);
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }

        .step-number-badge {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #4338ca;
            color: #ffffff;
            font-weight: 800;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .field-step-content h4 {
            font-size: 0.98rem;
            font-weight: 700;
            color: var(--slate-900);
            margin-bottom: 4px;
        }

        .field-step-content p {
            font-size: 0.84rem;
            color: #64748b;
            line-height: 1.5;
        }

        .field-preview-box {
            background: #0f172a;
            border-radius: 20px;
            padding: 24px;
            color: #ffffff;
            border: 1px solid #334155;
            box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.4);
        }

        .field-preview-title {
            font-size: 0.88rem;
            font-weight: 700;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 1px solid #1e293b;
        }

        .field-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed #1e293b;
            font-size: 0.82rem;
            color: #94a3b8;
        }

        .field-stat-row strong {
            color: #ffffff;
        }

        /* SECCIÓN 3: EXCELJS SECTION */
        .excel-section {
            padding: 84px 0;
            background: #f8fafc;
            border-bottom: 1px solid var(--slate-200);
        }

        .excel-card-wrapper {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
        }

        .excel-banner {
            background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #090d16 100%);
            border-radius: 24px;
            padding: 48px;
            color: #ffffff;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: center;
            border: 1px solid rgba(99, 102, 241, 0.3);
            box-shadow: var(--shadow-card);
        }

        .excel-banner h2 {
            font-size: 2.1rem;
            font-weight: 800;
            margin-bottom: 12px;
        }

        .excel-banner p {
            font-size: 0.95rem;
            color: #cbd5e1;
            line-height: 1.65;
            margin-bottom: 22px;
        }

        .excel-badges-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .excel-chip {
            background: rgba(255, 255, 255, 0.1);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.76rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .excel-file-card {
            background: rgba(30, 41, 59, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 22px;
        }

        /* SECCIÓN 4: SEGURIDAD (NUEVO DISEÑO CON ANCHOR id="seguridad") */
        .security-section {
            padding: 84px 0;
            background: #ffffff;
        }

        .security-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
        }

        .security-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
        }

        .security-card {
            background: #f8fafc;
            border: 1px solid var(--slate-200);
            border-radius: 16px;
            padding: 24px;
            transition: var(--transition);
        }

        .security-card:hover {
            transform: translateY(-4px);
            border-color: #4338ca;
            box-shadow: var(--shadow-subtle);
        }

        .security-card i {
            font-size: 1.8rem;
            color: #4338ca;
            margin-bottom: 14px;
            display: inline-block;
        }

        .security-card h4 {
            font-size: 1.02rem;
            font-weight: 700;
            color: var(--slate-900);
            margin-bottom: 8px;
        }

        .security-card p {
            font-size: 0.82rem;
            color: #64748b;
            line-height: 1.55;
        }

        /* Footer */
        .footer-pwa {
            background: #090d16;
            color: #94a3b8;
            padding: 48px 0 28px 0;
            border-top: 1px solid #1e293b;
        }

        .footer-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.82rem;
        }

        @media (max-width: 992px) {
            .hero-container {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            .motor-grid, .field-interactive-panel, .excel-banner, .security-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <!-- Top Status Bar -->
    <div class="top-announce-bar">
        <div class="announce-item">
            <span class="announce-badge">PWA v1.3.1</span>
            <span>Arquitectura Offline-First de Alta Resiliencia con Dexie.js & IndexedDB</span>
        </div>
        <div class="announce-item">
            <i class="bi bi-shield-check" style="color: #34d399;"></i>
            <span>Cifrado Local SHA-256 & Sincronización Reactiva en Segundo Plano</span>
        </div>
    </div>

    <!-- Barra de Navegación con Anclas Funcionales -->
    <nav class="navbar-pwa">
        <div class="nav-container">
            <a href="index.php" class="brand-link">
                <div class="brand-icon-box">
                    <i class="bi bi-clipboard-check-fill"></i>
                </div>
                <div class="brand-texts">
                    <span class="brand-title">Módulo<span>CRUD</span> <span class="brand-badge">PWA</span></span>
                    <span class="brand-subtitle">Sistema Offline-First de Captura y Censo</span>
                </div>
            </a>

            <!-- ANCLAS 100% FUNCIONALES -->
            <ul class="nav-links">
                <li><a href="#motor" class="nav-link-item"><i class="bi bi-database-check"></i> Motor Offline</a></li>
                <li><a href="#modo-campo" class="nav-link-item"><i class="bi bi-phone-fill"></i> Modo Campo</a></li>
                <li><a href="#excel" class="nav-link-item"><i class="bi bi-file-earmark-spreadsheet-fill"></i> ExcelJS</a></li>
                <li><a href="#seguridad" class="nav-link-item"><i class="bi bi-shield-lock-fill"></i> Seguridad</a></li>
            </ul>

            <div class="nav-actions">
                <a href="frontend/dist/index.html" class="btn-launch-pwa">
                    <i class="bi bi-box-arrow-in-right"></i>
                    <span>Portal PWA</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION DIFERENCIADO: CON TERMINAL SMARTPHONE PWA -->
    <section class="hero-section">
        <div class="hero-container">
            
            <!-- Columna Izquierda: Información de Valor -->
            <div class="hero-content-left">
                <div class="hero-badge-pill">
                    <i class="bi bi-broadcast" style="color: #4338ca;"></i>
                    Modo Campo Extendido • 30 Días 100% Offline
                </div>

                <h1 class="hero-title">
                    Recolección de datos <br>
                    <span class="gradient-text">sin pérdida de señal ni interrupciones</span>
                </h1>

                <p class="hero-desc">
                    Diseñado específicamente para brigadas y encuestadores en territorio. Permite capturar censos en zonas rurales o sótanos sin conexión. Los registros se escriben inmediatamente en IndexedDB mediante Dexie.js y se sincronizan al recuperar enlace de datos.
                </p>

                <div class="hero-actions">
                    <a href="frontend/dist/index.html" class="btn-cta-primary">
                        <i class="bi bi-person-fill-lock"></i>
                        <span>Iniciar Aplicación PWA</span>
                    </a>
                    <a href="#modo-campo" class="btn-cta-secondary">
                        <i class="bi bi-compass-fill"></i>
                        <span>Ver Modo Campo</span>
                    </a>
                </div>

                <div class="metrics-strip">
                    <div class="metric-item">
                        <h4>0 ms</h4>
                        <p>Latencia Local</p>
                    </div>
                    <div class="metric-item">
                        <h4 style="color: #4338ca;">100%</h4>
                        <p>Offline Ready</p>
                    </div>
                    <div class="metric-item">
                        <h4 style="color: #059669;">ExcelJS</h4>
                        <p>Export Nativo</p>
                    </div>
                </div>
            </div>

            <!-- Columna Derecha: Dispositivo Móvil PWA en Mano -->
            <div class="mobile-device-stage">
                <div class="smartphone-mockup">
                    <div class="smartphone-speaker"></div>
                    
                    <div class="smartphone-screen">
                        
                        <!-- Barra de Estado Móvil -->
                        <div class="phone-status-bar">
                            <span>09:41 • Brigada #04</span>
                            <button class="phone-net-badge" id="btnToggleNet" onclick="toggleNetwork()">
                                <i class="bi bi-wifi" id="wifiIcon"></i>
                                <span id="netStatusText">En Línea</span>
                            </button>
                        </div>

                        <!-- Cabecera de la App PWA -->
                        <div class="phone-app-header">
                            <div>
                                <h5>Módulo Encuesta</h5>
                                <small style="color: #64748b; font-size: 0.68rem;">Captura Persona & Contacto</small>
                            </div>
                            <span style="font-size: 0.68rem; font-weight: 700; background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px;">
                                Dexie.js
                            </span>
                        </div>

                        <!-- Cuerpo del Móvil -->
                        <div class="phone-app-body">
                            
                            <div class="phone-metric-row">
                                <div class="phone-metric-box">
                                    <span>Servidor VPS</span>
                                    <h3 id="syncedCount">148</h3>
                                    <small style="color: #059669;">Sincronizados</small>
                                </div>
                                <div class="phone-metric-box">
                                    <span>Memoria Local</span>
                                    <h3 id="pendingCount" style="color: #4338ca;">3</h3>
                                    <small style="color: #d97706;">Pendientes</small>
                                </div>
                            </div>

                            <div class="phone-sim-card">
                                <div class="phone-sim-row">
                                    <div><span class="label">Red: </span><span id="termNetState" style="color: #34d399; font-weight: 700;">CONECTADO (Background Sync)</span></div>
                                    <div><span class="label">Cifrado: </span><span>Local SHA-256</span></div>
                                    <div><span class="label">Prioridad: </span><span style="color: #818cf8;">Rotación Activa</span></div>
                                </div>

                                <div class="phone-sim-buttons">
                                    <button class="btn-phone-record" onclick="addLocalRecord()">
                                        <i class="bi bi-plus-circle"></i> + Encuesta
                                    </button>
                                    <button class="btn-phone-sync" id="btnSync" onclick="syncRecords()">
                                        <i class="bi bi-arrow-repeat" id="syncIcon"></i>
                                        <span id="syncText">Sincronizar</span>
                                    </button>
                                </div>
                            </div>

                            <div style="font-size: 0.68rem; text-align: center; color: #94a3b8;">
                                <i class="bi bi-shield-check" style="color: #4338ca;"></i> Auto-guardado local garantizado
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    </section>

    <!-- SECCIÓN 1: MOTOR OFFLINE (id="motor") -->
    <section class="section-block" id="motor" style="background: #ffffff;">
        <div class="section-header">
            <span class="section-tag"><i class="bi bi-cpu"></i> Motor de Datos</span>
            <h2 class="section-title">Ingeniería Offline-First de Alta Resiliencia</h2>
            <p class="section-desc">Tres capas integradas de almacenamiento, transacciones y background sync diseñadas para zonas sin cobertura.</p>
        </div>

        <div class="motor-grid">
            <div class="motor-feature-card">
                <div class="card-icon-pill" style="background: #eef2ff; color: #4338ca;">
                    <i class="bi bi-database-fill-gear"></i>
                </div>
                <h3>IndexedDB con Dexie.js</h3>
                <p>Base de datos no relacional indexada en el navegador del usuario. Permite almacenar miles de encuestas de manera estructurada sin depender de la nube.</p>
                <ul class="feature-bullets">
                    <li><i class="bi bi-check-circle-fill" style="color: #4338ca;"></i> Cero pérdida por reinicio o corte de energía</li>
                    <li><i class="bi bi-check-circle-fill" style="color: #4338ca;"></i> Consultas instantáneas indexadas por ID</li>
                </ul>
            </div>

            <div class="motor-feature-card">
                <div class="card-icon-pill" style="background: #ecfdf5; color: #059669;">
                    <i class="bi bi-arrow-repeat"></i>
                </div>
                <h3>Background Sync API</h3>
                <p>El Service Worker monitorea reactivamente el estado de red. Cuando el encuestador recupera señal celular o Wi-Fi, envía automáticamente los lotes pendientes.</p>
                <ul class="feature-bullets">
                    <li><i class="bi bi-check-circle-fill" style="color: #059669;"></i> Resolución inteligente de marcas de tiempo</li>
                    <li><i class="bi bi-check-circle-fill" style="color: #059669;"></i> Reintentos exponenciales si hay caídas</li>
                </ul>
            </div>

            <div class="motor-feature-card">
                <div class="card-icon-pill" style="background: #eff6ff; color: #0284c7;">
                    <i class="bi bi-phone-vibrate"></i>
                </div>
                <h3>Instalación como App Nativa</h3>
                <p>Al ser PWA (Progressive Web App), se instala directamente en la pantalla de inicio de Android o iOS sin necesidad de tiendas comerciales, ocupando menos de 3 MB.</p>
                <ul class="feature-bullets">
                    <li><i class="bi bi-check-circle-fill" style="color: #0284c7;"></i> Service Worker precachea activos</li>
                    <li><i class="bi bi-check-circle-fill" style="color: #0284c7;"></i> Pantalla completa tipo app nativa</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 2: MODO CAMPO (id="modo-campo") - NUEVA SECCIÓN DIFERENCIADA -->
    <section class="field-mode-section" id="modo-campo">
        <div class="field-container">
            <div class="section-header">
                <span class="section-tag"><i class="bi bi-geo-alt-fill"></i> Operación en Territorio</span>
                <h2 class="section-title">Modo Campo Extendido (30 Días Continuos)</h2>
                <p class="section-desc">Optimizado para brigadas en áreas rurales o comunidades sin acceso a red eléctrica ni datos móviles.</p>
            </div>

            <div class="field-interactive-panel">
                <div class="field-steps">
                    <div class="field-step-item">
                        <div class="step-number-badge">1</div>
                        <div class="field-step-content">
                            <h4>Captura en Territorio sin Conectividad</h4>
                            <p>El encuestador diligencia personas, teléfonos múltiples y datos del censo. El botón "Guardar" escribe en 0 ms en la memoria interna del teléfono.</p>
                        </div>
                    </div>

                    <div class="field-step-item">
                        <div class="step-number-badge">2</div>
                        <div class="field-step-content">
                            <h4>Rotación Inteligente de Prioridad Telefónica</h4>
                            <p>Asignación y reordenamiento automático de números de contacto primarios y secundarios para maximizar la efectividad en llamadas de verificación posterior.</p>
                        </div>
                    </div>

                    <div class="field-step-item">
                        <div class="step-number-badge">3</div>
                        <div class="field-step-content">
                            <h4>Descarga y Retorno a Base Central</h4>
                            <p>Al regresar a la base o conectarse a Wi-Fi, la PWA sincroniza todos los registros pendientes en bloque hacia el servidor central Node.js / MySQL.</p>
                        </div>
                    </div>
                </div>

                <!-- Preview Box Operativo -->
                <div class="field-preview-box">
                    <div class="field-preview-title">
                        <i class="bi bi-broadcast-pin" style="color: #34d399;"></i>
                        <span>Bitácora Operativa de Brigada</span>
                    </div>
                    <div class="field-stat-row">
                        <span>Autonomía Offline:</span>
                        <strong>Hasta 30 días sin servidor</strong>
                    </div>
                    <div class="field-stat-row">
                        <span>Consumo de Batería:</span>
                        <strong style="color: #34d399;">Ultra Bajo (Sin peticiones polling)</strong>
                    </div>
                    <div class="field-stat-row">
                        <span>Validación Formulario:</span>
                        <strong>Zod + React Hook Form</strong>
                    </div>
                    <div class="field-stat-row" style="border-bottom: none;">
                        <span>Integridad en Guardado:</span>
                        <strong style="color: #818cf8;">Transaccional ACID Local</strong>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 3: EXCELJS (id="excel") -->
    <section class="excel-section" id="excel">
        <div class="excel-card-wrapper">
            <div class="excel-banner">
                <div>
                    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(5, 150, 105, 0.25); color: #34d399; padding: 4px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700; margin-bottom: 14px;">
                        <i class="bi bi-file-earmark-excel-fill"></i>
                        <span>Motor Nativo ExcelJS</span>
                    </div>
                    <h2>Exportación instantánea a Excel (.xlsx) generada en el dispositivo</h2>
                    <p>Genere libros tabulados directamente desde el cliente sin recargar el servidor ni depender de conexión. Formato corporativo listo para PowerBI, Python o análisis en SPSS.</p>
                    <div class="excel-badges-grid">
                        <div class="excel-chip"><i class="bi bi-check2"></i> Cabeceras Estilizadas y Filtros</div>
                        <div class="excel-chip"><i class="bi bi-check2"></i> Múltiples Teléfonos por Fila</div>
                        <div class="excel-chip"><i class="bi bi-check2"></i> Exportación CSV & XLSX</div>
                    </div>
                </div>

                <div class="excel-file-card">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 14px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="bi bi-file-earmark-spreadsheet-fill" style="font-size: 1.5rem; color: #34d399;"></i>
                            <div>
                                <div style="font-size: 0.85rem; font-weight: 700;">censo_recoleccion_campo.xlsx</div>
                                <div style="font-size: 0.7rem; color: #94a3b8;">Generado en 0.38s en cliente</div>
                            </div>
                        </div>
                        <i class="bi bi-download" style="color: #94a3b8;"></i>
                    </div>

                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; color: #cbd5e1; line-height: 1.8; margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Total Registros:</span>
                            <span style="color: #34d399; font-weight: 700;">1.240 Filas</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Encuestadores:</span>
                            <span>14 Brigadistas</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Integridad Hash:</span>
                            <span style="color: #818cf8;">SHA-256 OK</span>
                        </div>
                    </div>

                    <a href="frontend/dist/index.html" class="btn-launch-pwa" style="width: 100%; justify-content: center;">
                        <i class="bi bi-box-arrow-up-right"></i>
                        <span>Abrir Portal para Exportar</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN 4: SEGURIDAD (id="seguridad") - NUEVA SECCIÓN DIFERENCIADA -->
    <section class="security-section" id="seguridad">
        <div class="security-container">
            <div class="section-header">
                <span class="section-tag"><i class="bi bi-shield-check"></i> Protección Integral</span>
                <h2 class="section-title">Seguridad y Cifrado en Campo</h2>
                <p class="section-desc">Mecanismos activos para proteger la privacidad de los datos censados y prevenir accesos indebidos.</p>
            </div>

            <div class="security-grid">
                <div class="security-card">
                    <i class="bi bi-lock-fill"></i>
                    <h4>LockScreen Automático</h4>
                    <p>Bloqueo de seguridad al detectar 15 minutos de inactividad física para proteger la pantalla si el encuestador se aleja del dispositivo.</p>
                </div>

                <div class="security-card">
                    <i class="bi bi-key-fill"></i>
                    <h4>Cifrado Local SHA-256</h4>
                    <p>El PIN o contraseña se valida localmente mediante hash criptográfico SHA-256 sin enviar datos sensibles a la red.</p>
                </div>

                <div class="security-card">
                    <i class="bi bi-person-badge-fill"></i>
                    <h4>Autenticación JWT</h4>
                    <p>Tokens firmados criptográficamente para la sincronización con el servidor Node.js y control estricto de roles administrativos.</p>
                </div>

                <div class="security-card">
                    <i class="bi bi-shield-fill-exclamation"></i>
                    <h4>Protección contra Conflictos</h4>
                    <p>Sistema de resolución basado en marcas de tiempo (`updated_at`) que previene la sobreescritura accidental entre múltiples encuestadores.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer-pwa">
        <div class="footer-container">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 28px; height: 28px; border-radius: 6px; background: #4338ca; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
                    <i class="bi bi-clipboard-check"></i>
                </div>
                <span style="color: #f1f5f9; font-weight: 700;">Módulo CRUD — PWA Encuestas Offline</span>
            </div>
            <div>&copy; <?= date('Y') ?> Módulo CRUD. Todos los derechos reservados.</div>
        </div>
    </footer>

    <!-- Lógica Interactiva del Simulador Móvil PWA -->
    <script>
        let isOffline = false;
        let synced = 148;
        let pending = 3;

        function toggleNetwork() {
            isOffline = !isOffline;
            const btn = document.getElementById('btnToggleNet');
            const netText = document.getElementById('netStatusText');
            const termText = document.getElementById('termNetState');
            const wifiIcon = document.getElementById('wifiIcon');

            if (isOffline) {
                btn.classList.add('offline');
                netText.textContent = 'Sin Señal';
                termText.textContent = 'DESCONECTADO (Guardando en IndexedDB)';
                termText.style.color = '#fbbf24';
                wifiIcon.className = 'bi bi-wifi-off';
            } else {
                btn.classList.remove('offline');
                netText.textContent = 'En Línea';
                termText.textContent = 'CONECTADO (Background Sync)';
                termText.style.color = '#34d399';
                wifiIcon.className = 'bi bi-wifi';
            }
        }

        function addLocalRecord() {
            pending++;
            document.getElementById('pendingCount').textContent = pending;
        }

        function syncRecords() {
            if (pending === 0) return;
            const icon = document.getElementById('syncIcon');
            const text = document.getElementById('syncText');
            icon.classList.add('bi-spin');
            text.textContent = 'Sincronizando...';

            setTimeout(() => {
                synced += pending;
                pending = 0;
                document.getElementById('syncedCount').textContent = synced;
                document.getElementById('pendingCount').textContent = pending;
                icon.classList.remove('bi-spin');
                text.textContent = 'Sincronizar';
            }, 800);
        }
    </script>
</body>
</html>