# PDF Pagenio (pdfpagenio.com)

A high-performance, full-scale online PDF productivity suite built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, `pdf-lib`, `pdfjs-dist`, FastAPI, and Docker.

---

## Architecture Overview

**PDF Pagenio** features a hybrid architecture engineered for zero server latency on common operations and industrial scalability on heavy document conversions:

1. **High-Speed Client-Side Engine (Zero Server Cost & 100% Privacy)**:
   - Built with pure JavaScript / WebAssembly using `pdf-lib` and `pdfjs-dist`.
   - Executes instantly in the user's browser without uploading files to any external server.
   - Powers: **Merge PDF, Split PDF, Remove Pages, Extract Pages, Organize PDF, Rotate PDF, Add Page Numbers, Watermark PDF, Crop PDF, JPG to PDF, PDF to JPG, and Electronic Signatures**.

2. **Containerized Processing Microservice (`/server`)**:
   - Python 3.11 + FastAPI microservice with LibreOffice headless, Ghostscript 10, Tesseract OCR, and QPDF / `pikepdf`.
   - Powers: **Word to PDF, PowerPoint to PDF, Excel to PDF, PDF to Word, PDF to Excel, Smart Ghostscript Compression, OCR Searchable PDF, Password Protect & Unlock, and PDF/A archiving**.
   - Automated 60-minute cleanup daemon ensuring zero document retention.

3. **International SEO & Tiered Localization Engine**:
   - Localized URL subfolders (`/es/unir-pdf`, `/id/gabungkan-pdf`, `/pt-br/juntar-pdf`, `/fr/fusionner-pdf`, `/hi/merge-pdf`).
   - Dynamic bidirectional `hreflang` matrix with `x-default` pointing to English.
   - Strict `reviewed: boolean` gating: unreviewed locales serve `noindex, nofollow` to protect domain ranking.
   - Dynamic XML sitemap generation (`/sitemap.xml`) and Schema.org structured data (`SoftwareApplication`, `FAQPage`, `BreadcrumbList`).

---

## Quick Start

### 1. Running the Frontend Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Running with Docker Compose (Full Stack)

To run both the Next.js frontend and the Python conversion microservice together:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Microservice API & Swagger Docs: `http://localhost:8000/docs`

---

## 32 Tools Matrix

| Category | Tools Included |
|---|---|
| **Organize PDF** | Merge PDF, Split PDF, Remove Pages, Extract Pages, Organize PDF, Scan to PDF |
| **Optimize PDF** | Compress PDF, Smart Compress (Pro), Repair PDF, OCR PDF |
| **Convert to PDF** | JPG to PDF, Word to PDF, PowerPoint to PDF, Excel to PDF, HTML to PDF |
| **Convert from PDF** | PDF to JPG, PDF to Word, PDF to PowerPoint, PDF to Excel, PDF to PDF/A |
| **Edit PDF** | Rotate PDF, Add Page Numbers, Add Watermark, Edit PDF, Crop PDF |
| **PDF Security** | Unlock PDF, Protect PDF, Sign PDF, Redact PDF, Compare PDF |
| **AI Document Tools**| AI PDF Summarizer, AI PDF Translator, Chat with PDF |

---

## Running Automated Tests

```bash
pnpm test
```
