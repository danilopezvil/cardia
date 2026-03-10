# Cardia Studio — Premium Business Card Generator

A print-aware, front/back, premium business card design tool built with **semantic HTML**, **modular CSS**, and **vanilla JavaScript**.

## 1) Folder Structure and Architecture

```text
cardia/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── templates.css
│   └── print.css
├── js/
│   ├── app.js
│   └── modules/
│       ├── config.js
│       ├── storage.js
│       ├── file.js
│       ├── qr.js
│       ├── render.js
│       └── export.js
└── assets/
    └── uploads/
```

### Architecture Notes
- `index.html`: semantic structure for controls + live preview.
- `css/tokens.css`: design tokens (color, spacing, typography roots).
- `css/templates.css`: 9 premium template systems + typography packs.
- `js/modules/render.js`: all preview rendering logic.
- `js/modules/storage.js`: localStorage persistence.
- `js/modules/qr.js`: QR code rendering via QRious.
- `js/modules/export.js`: PNG export via html2canvas.

## 2) Semantic HTML
- Uses proper `header`, `main`, `section`, `form`, `fieldset`, and `legend` semantics.
- Organized by professional identity, contact, visual direction, and media/QR.
- Separate front/back preview `article` nodes.

## 3) Modular CSS with Design Tokens
- Tokens define base visual language and are globally reusable.
- CSS split into base/layout/components/templates/print for scalability.
- Print stylesheet enforces physical card dimensions (3.5in × 2in).

## 4) 9 Distinct Premium Templates
1. Executive Corporate
2. Editorial Minimal
3. Modern Creative
4. Tech Professional
5. Health and Wellness
6. Prestige Dark
7. Forensic Psychology Professional
8. Senior Software Architect
9. Legal and Institutional

Each template uses unique composition, contrast, and surface treatment (not generic bootstrap patterns).

## 5) Modular Vanilla JavaScript
- Reactive form-to-preview update loop.
- Dynamic template + typography class application.
- Logo/avatar upload with `FileReader` data URLs.
- Side toggling (front/back).

## 6) QR Integration
- `QRious` renders branded QR code from `qrValue` input.
- Optional QR visibility control on card back.

## 7) Print / Export Support
- **Print/PDF** via `window.print()` with print CSS.
- **PNG export** for front and back with html2canvas.

## 8) How to Run
Because this is static HTML/CSS/JS, open directly or serve locally:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Professional Targets Covered
The templates and tone are tailored for:
- consultants
- lawyers
- forensic psychologists
- therapists
- software architects
- doctors
- founders

## Persistence
All card settings are auto-saved to localStorage under:
- `cardia-premium-card`
