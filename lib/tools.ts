export type ToolCategory =
  | "organize"
  | "optimize"
  | "convert-to"
  | "convert-from"
  | "edit"
  | "security"
  | "ai";

export interface ToolLocalizedInfo {
  slug: string;
  name: string;
  description: string;
  reviewed: boolean;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  icon: string;
  badge?: string;
  color: string;
  clientExecutable: boolean;
  acceptedFileTypes: string[];
  maxFiles: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    faq: ToolFAQ[];
  };
  howTo: string[];
  localized?: Record<string, ToolLocalizedInfo>;
}

export const CATEGORIES: {
  id: ToolCategory;
  name: string;
  description: string;
  color: string;
  gradient: string;
  bgLight: string;
}[] = [
  {
    id: "organize",
    name: "Organize PDF",
    description: "Merge, split, remove, extract, and reorder pages",
    color: "#E5322D",
    gradient: "from-rose-500 to-brand-600",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "optimize",
    name: "Optimize PDF",
    description: "Compress, repair, and apply OCR to PDF documents",
    color: "#0D9488",
    gradient: "from-teal-500 to-emerald-600",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: "convert-to",
    name: "Convert to PDF",
    description: "Convert Office documents and images into PDFs",
    color: "#2563EB",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "convert-from",
    name: "Convert from PDF",
    description: "Convert PDFs into Word, Excel, PowerPoint, and images",
    color: "#D97706",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "edit",
    name: "Edit PDF",
    description: "Rotate, watermark, crop, and add page numbers",
    color: "#7C3AED",
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "security",
    name: "PDF Security",
    description: "Unlock, protect, redact, sign, and compare documents",
    color: "#E11D48",
    gradient: "from-rose-600 to-red-700",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "ai",
    name: "AI Tools",
    description: "Summarize, translate, and chat with your documents",
    color: "#6366F1",
    gradient: "from-indigo-500 to-violet-600",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
];

export const TOOLS: Tool[] = [
  // ORGANIZE
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    name: "Merge PDF",
    shortDescription: "Combine multiple PDFs into one unified document in your preferred order.",
    longDescription: "Merge multiple PDF files into one single PDF document effortlessly. Drag and drop to reorder files, preview pages, and concatenate your files directly in your browser with zero latency.",
    category: "organize",
    icon: "Layers",
    color: "#E5322D",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 20,
    seo: {
      title: "Merge PDF files online - Free & Fast PDF Combiner",
      description: "Combine multiple PDF files into one document in seconds. Easy, free, and secure PDF merger. No registration required.",
      keywords: ["merge pdf", "combine pdf", "join pdf", "merge pdf files", "pdf merger online"],
      faq: [
        {
          question: "How do I merge multiple PDF files?",
          answer: "Upload your PDF files by dragging and dropping them into the upload box. Arrange the documents in the exact order you want them combined, then click 'Merge PDF' to download your combined document instantly."
        },
        {
          question: "Is merging PDF files secure on this platform?",
          answer: "Yes, merging happens directly inside your web browser using client-side JavaScript. Your files never leave your device, ensuring total privacy and security."
        },
        {
          question: "Is there a limit on the number of PDFs I can merge?",
          answer: "You can merge up to 20 PDF files simultaneously completely free of charge."
        }
      ]
    },
    howTo: [
      "Select or drag and drop multiple PDF files from your computer or cloud storage.",
      "Drag the thumbnails to reorder pages or documents to your desired sequence.",
      "Click the 'Merge PDF' button to generate and instantly download your merged file."
    ],
    localized: {
      es: { slug: "unir-pdf", name: "Unir PDF", description: "Une varios PDFs en un solo documento con el orden que desees.", reviewed: true },
      fr: { slug: "fusionner-pdf", name: "Fusionner PDF", description: "Assemblez plusieurs fichiers PDF en un seul document.", reviewed: true },
      id: { slug: "gabungkan-pdf", name: "Gabungkan PDF", description: "Gabungkan beberapa PDF menjadi satu dokumen terpadu.", reviewed: true },
      "pt-BR": { slug: "juntar-pdf", name: "Juntar PDF", description: "Junte múltiplos arquivos PDF em um único documento.", reviewed: true },
      hi: { slug: "merge-pdf", name: "Merge PDF", description: "एकाधिक पीडीएफ फाइलों को एक दस्तावेज में जोड़ें।", reviewed: true },
      de: { slug: "pdf-zusammenfuegen", name: "PDF zusammenfügen", description: "Fügen Sie mehrere PDF-Dateien in der gewünschten Reihenfolge zusammen.", reviewed: false },
      tr: { slug: "pdf-birlestir", name: "PDF Birleştir", description: "Birden fazla PDF dosyasını tek bir belgede birleştirin.", reviewed: false },
      vi: { slug: "gop-file-pdf", name: "Gộp file PDF", description: "Ghép nối nhiều tệp PDF thành một tài liệu duy nhất trực tuyến miễn phí.", reviewed: false },
      ru: { slug: "obedinit-pdf", name: "Объединить PDF", description: "Объединение нескольких файлов PDF в один документ онлайн бесплатно.", reviewed: false },
      ja: { slug: "pdf-ketsugo", name: "PDF 結合", description: "複数のPDFファイルをオンラインで簡単に1つのドキュメントに結合します。", reviewed: false },
      ar: { slug: "damj-pdf", name: "دمج PDF", description: "دمج ملفات PDF متعددة في مستند واحد عبر الإنترنت مجاناً وبأمان.", reviewed: false },
    }
  },
  {
    id: "split-pdf",
    slug: "split-pdf",
    name: "Split PDF",
    shortDescription: "Extract page ranges or separate all pages into independent PDF files.",
    longDescription: "Split a PDF into individual pages or extract custom page intervals (e.g., 1-4, 8, 11-15) cleanly and instantly.",
    category: "organize",
    icon: "Scissors",
    color: "#E5322D",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 1,
    seo: {
      title: "Split PDF file online - Extract PDF pages",
      description: "Separate one page or a whole set of pages for easy conversion into independent PDF files. Fast and secure.",
      keywords: ["split pdf", "extract pdf pages", "separate pdf pages", "cut pdf"],
      faq: [
        {
          question: "Can I split a PDF by custom page ranges?",
          answer: "Yes! You can specify exact ranges like '1-3, 5, 8-12' or split every page into a standalone PDF file."
        }
      ]
    },
    howTo: [
      "Upload the PDF document you want to split.",
      "Choose 'Split by range' or 'Extract all pages' and enter the page numbers.",
      "Click 'Split PDF' to download the resulting PDF or ZIP archive."
    ],
    localized: {
      es: { slug: "dividir-pdf", name: "Dividir PDF", description: "Extrae una o varias páginas de tu PDF de forma rápida.", reviewed: true },
      fr: { slug: "diviser-pdf", name: "Diviser PDF", description: "Séparez une page ou plusieurs pages de vos documents PDF.", reviewed: true },
      id: { slug: "pisahkan-pdf", name: "Pisahkan PDF", description: "Pisahkan halaman atau ekstrak rentang halaman dari PDF Anda.", reviewed: true },
      "pt-BR": { slug: "dividir-pdf", name: "Dividir PDF", description: "Separe uma página ou um conjunto de páginas do seu PDF.", reviewed: true },
      hi: { slug: "split-pdf", name: "Split PDF", description: "पीडीएफ फाइलों को अलग-अलग पेजों में विभाजित करें।", reviewed: true },
      vi: { slug: "cat-file-pdf", name: "Cắt file PDF", description: "Tách hoặc trích xuất các trang từ tệp PDF trực tuyến nhanh chóng.", reviewed: false },
      ru: { slug: "razdelit-pdf", name: "Разделить PDF", description: "Разделение PDF на отдельные страницы или диапазоны страниц.", reviewed: false },
      ja: { slug: "pdf-bunkatsu", name: "PDF 分割", description: "PDFからページを抽出、または個別のページに素早く分割します。", reviewed: false },
      tr: { slug: "pdf-ayirma", name: "PDF Ayırma", description: "PDF sayfalarını tek tek ayırın veya belirli aralıkları çıkarın.", reviewed: false },
      ar: { slug: "taqsim-pdf", name: "تقسيم PDF", description: "فصل صفحات محددة أو استخراج نطاقات من مستند PDF بكل سهولة.", reviewed: false },
    }
  },
  {
    id: "remove-pages",
    slug: "remove-pages",
    name: "Remove Pages",
    shortDescription: "Delete unwanted pages from your PDF with visual thumbnail selection.",
    longDescription: "Select and remove pages you do not need from your document. Visual grid preview lets you click pages to delete them before exporting.",
    category: "organize",
    icon: "FileMinus",
    color: "#E5322D",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 1,
    seo: {
      title: "Remove Pages from PDF - Delete PDF Pages Online",
      description: "Delete unwanted pages from your PDF file online. Fast, visual, and 100% free.",
      keywords: ["remove pages from pdf", "delete pdf pages", "discard pdf pages"],
      faq: [
        {
          question: "Will deleting pages affect the quality of the rest of the document?",
          answer: "Not at all. The remaining pages are preserved at original vector quality without any recompression."
        }
      ]
    },
    howTo: [
      "Select and upload your PDF file.",
      "Click on each page thumbnail you want to eliminate.",
      "Click 'Remove Pages' to download your cleaned PDF."
    ]
  },
  {
    id: "extract-pages",
    slug: "extract-pages",
    name: "Extract Pages",
    shortDescription: "Select specific pages and save them into a brand-new PDF document.",
    longDescription: "Pick the exact pages you need from any document and export them into a new, lightweight PDF file.",
    category: "organize",
    icon: "FileSearch",
    color: "#E5322D",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 1,
    seo: {
      title: "Extract PDF Pages - Save Selected Pages Online",
      description: "Extract specific pages from your PDF document easily online.",
      keywords: ["extract pdf pages", "save selected pdf pages", "select pages from pdf"],
      faq: [
        {
          question: "Can I extract non-consecutive pages?",
          answer: "Yes, you can select any arbitrary combination of pages (e.g. pages 2, 7, and 15)."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "Select the pages you want to keep.",
      "Click 'Extract Pages' to download."
    ]
  },
  {
    id: "organize-pdf",
    slug: "organize-pdf",
    name: "Organize PDF",
    shortDescription: "Sort, rotate, duplicate, or delete pages with interactive drag-and-drop.",
    longDescription: "Full interactive workspace to organize your document pages: drag and drop to reorder, rotate individual pages, delete unnecessary pages, or merge additional files.",
    category: "organize",
    icon: "LayoutGrid",
    color: "#E5322D",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Organize PDF - Reorder, Rotate and Delete PDF Pages",
      description: "Sort PDF pages however you like. Delete PDF pages or add PDF pages to your document with an interactive visual organizer.",
      keywords: ["organize pdf", "reorder pdf pages", "arrange pdf pages"],
      faq: [
        {
          question: "Can I add more pages from another document in Organize PDF?",
          answer: "Yes, click 'Add Files' in the organizer to combine and interleave pages from multiple documents."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Drag thumbnails to reorder, use hover icons to rotate or delete specific pages.",
      "Click 'Save Organized PDF' to download your updated file."
    ]
  },

  // OPTIMIZE
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    name: "Compress PDF",
    shortDescription: "Reduce the file size of your PDF while maintaining optimal visual quality.",
    longDescription: "Drastically reduce PDF file size for fast email sharing, web uploads, or storage optimization. Choose between Recommended, Extreme, or Less Compression.",
    category: "optimize",
    icon: "FileArchive",
    color: "#0D9488",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Compress PDF file online - Reduce PDF file size",
      description: "Compress PDF files quickly and easily while preserving visual clarity. Free online PDF compressor.",
      keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "pdf compressor online"],
      faq: [
        {
          question: "How much can I reduce my PDF file size?",
          answer: "Typical reductions range between 40% and 85% depending on whether the document contains high-resolution raster images or embedded fonts."
        }
      ]
    },
    howTo: [
      "Upload your PDF file.",
      "Select your preferred compression level (Extreme, Recommended, or Low).",
      "Click 'Compress PDF' and download your streamlined file."
    ],
    localized: {
      es: { slug: "comprimir-pdf", name: "Comprimir PDF", description: "Reduce el tamaño de tu archivo PDF manteniendo la máxima calidad.", reviewed: true },
      fr: { slug: "compresser-pdf", name: "Compresser PDF", description: "Réduisez la taille de votre fichier PDF tout en préservant sa qualité.", reviewed: true },
      id: { slug: "kompres-pdf", name: "Kompres PDF", description: "Kompres file PDF untuk memperkecil ukuran file dengan kualitas terbaik.", reviewed: true },
      "pt-BR": { slug: "comprimir-pdf", name: "Comprimir PDF", description: "Diminua o tamanho do seu arquivo PDF mantendo a melhor qualidade.", reviewed: true },
      hi: { slug: "compress-pdf", name: "Compress PDF", description: "पीडीएफ फाइलों का आकार कम करें।", reviewed: true },
      vi: { slug: "nen-file-pdf", name: "Nén file PDF", description: "Giảm dung lượng tệp PDF mà vẫn giữ nguyên chất lượng tối đa.", reviewed: false },
      ru: { slug: "szhat-pdf", name: "Сжать PDF", description: "Уменьшение размера файла PDF с сохранением высокого качества.", reviewed: false },
      ja: { slug: "pdf-asshuku", name: "PDF 圧縮", description: "最高品質を保ちながらPDFファイルのファイルサイズを小さくします。", reviewed: false },
      tr: { slug: "pdf-sikistirma", name: "PDF Sıkıştırma", description: "PDF dosya boyutunu en iyi kalitede ve hızla küçültün.", reviewed: false },
      ar: { slug: "daght-pdf", name: "ضغط PDF", description: "تقليل حجم ملف PDF مع الحفاظ على أعلى جودة ممكنة للمستند.", reviewed: false },
    }
  },
  {
    id: "compress-pdf-to-200kb",
    slug: "compress-pdf-to-200kb",
    name: "Compress PDF to 200 KB",
    shortDescription: "Reduce your PDF file size to strictly under 200 KB for UPSC, SSC, and online job portal applications.",
    longDescription: "Guaranteed client-side compression to under 200 KB without sacrificing legibility. Built specifically for Indian government job portals, UPSC CSE, SSC CGL/CHSL, state PSC examinations, and university admissions.",
    category: "optimize",
    icon: "FileArchive",
    badge: "Govt Forms",
    color: "#0D9488",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Compress PDF to 200 KB Online Free - UPSC & SSC Exam Forms | PDF Pagenio",
      description: "Compress PDF file size to strictly under 200 KB online for free. Guaranteed fit for UPSC, SSC, IBPS, state PSC, and college online form uploads. 100% private.",
      keywords: [
        "compress pdf to 200 kb",
        "reduce pdf size to 200 kb",
        "compress pdf under 200kb online",
        "upsc pdf compress 200 kb",
        "ssc online form pdf size reducer",
        "compress pdf below 200 kb free",
        "resize pdf to 200kb"
      ],
      faq: [
        {
          question: "How do I compress my PDF to less than 200 KB for online forms?",
          answer: "Upload your document to PDF Pagenio. Our specialized engine automatically calculates the exact resolution and compression ratio needed to bring your file strictly below 200 KB while preserving crisp, readable text and official seals."
        },
        {
          question: "Which government exams accept this 200 KB PDF format?",
          answer: "Major Indian portals including UPSC CSE, SSC (CGL, CHSL, MTS), IBPS, State PSCs, NEET, JEE, GATE, and university admission portals require documents, degree certificates, and identity proofs under 200 KB."
        },
        {
          question: "Will my text or signature become blurry?",
          answer: "No. Our intelligent canvas rendering uses dynamic font vector smoothing and calibrated JPEG encoding to preserve text contrast, stamps, and signatures so your application is never rejected."
        },
        {
          question: "Is my document safe when compressing for government forms?",
          answer: "100% safe. Processing runs entirely in your local browser using client-side JavaScript. Your confidential certificates and Aadhaar/PAN cards never get uploaded to any external server."
        }
      ]
    },
    howTo: [
      "Upload your PDF certificate, marksheet, or document.",
      "Our system automatically sets the target constraint to 200 KB.",
      "Click 'Compress to 200 KB' and instantly download your compliant document."
    ],
    localized: {
      hi: {
        slug: "compress-pdf-to-200kb",
        name: "Compress PDF to 200 KB",
        description: "सरकारी फॉर्म, UPSC और SSC के लिए PDF का आकार 200 KB से कम करें।",
        reviewed: true
      },
      id: {
        slug: "kompres-pdf-ke-200kb",
        name: "Kompres PDF ke 200 KB",
        description: "Kompres file PDF hingga di bawah 200 KB untuk formulir pendaftaran online.",
        reviewed: true
      },
      "pt-BR": {
        slug: "comprimir-pdf-para-200kb",
        name: "Comprimir PDF para 200 KB",
        description: "Comprima seu arquivo PDF para menos de 200 KB para inscrições e formulários online.",
        reviewed: true
      }
    }
  },
  {
    id: "compress-pdf-for-online-form",
    slug: "compress-pdf-for-online-form",
    name: "Compress PDF for Online Form",
    shortDescription: "Resize and compress PDF documents to exact portal limits (200 KB, 100 KB, 50 KB).",
    longDescription: "Effortlessly resize any PDF to match strict online application quotas for recruitment portals, passport applications, visa uploads, and tax filings.",
    category: "optimize",
    icon: "FileArchive",
    badge: "Portal Ready",
    color: "#0D9488",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Compress PDF for Online Form - Resize PDF for Job & Exam Portals | PDF Pagenio",
      description: "Easily compress and reduce PDF file size for online forms, government job portals, passport renewals, and college admissions. Fast, secure, and free.",
      keywords: [
        "compress pdf for online form",
        "reduce pdf size for online application",
        "pdf size reducer for govt job form",
        "compress pdf for passport upload",
        "online form pdf compressor",
        "reduce pdf size for job apply"
      ],
      faq: [
        {
          question: "What is the standard PDF size limit for online job portals?",
          answer: "Most Indian and international job portals set strict file size ceilings between 100 KB and 300 KB for documents (marksheets, caste certificates, experience letters) and between 20 KB and 50 KB for identity or signature files."
        },
        {
          question: "Can I choose between 200 KB, 100 KB, and 50 KB?",
          answer: "Yes, our online form optimizer provides one-click presets for common government and university upload thresholds."
        }
      ]
    },
    howTo: [
      "Drag and drop your PDF file.",
      "Select your required portal quota (200 KB, 100 KB, or 50 KB).",
      "Click 'Compress for Form' to download your application-ready document."
    ],
    localized: {
      hi: {
        slug: "compress-pdf-for-online-form",
        name: "Compress PDF for Online Form",
        description: "ऑनलाइन फॉर्म और नौकरी आवेदनों के लिए PDF का आकार कम करें।",
        reviewed: true
      },
      id: {
        slug: "kompres-pdf-untuk-formulir",
        name: "Kompres PDF untuk Formulir",
        description: "Kecilkan ukuran file PDF untuk formulir pendaftaran dan lamaran kerja online.",
        reviewed: true
      },
      "pt-BR": {
        slug: "comprimir-pdf-para-formulario",
        name: "Comprimir PDF para Formulário",
        description: "Reduza o tamanho do PDF para formulários online e inscrições de concursos.",
        reviewed: true
      }
    }
  },
  {
    id: "compress-pdf-to-100kb",
    slug: "compress-pdf-to-100kb",
    name: "Compress PDF to 100 KB",
    shortDescription: "Compress your PDF file to strictly under 100 KB for passport, visa, and photo ID uploads.",
    longDescription: "Reduce PDF documents to under 100 KB with calibrated clarity. Ideal for passport services, visa applications, state portals, and email attachments.",
    category: "optimize",
    icon: "FileArchive",
    badge: "100 KB Limit",
    color: "#0D9488",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Compress PDF to 100 KB Online Free - High Quality PDF Reducer | PDF Pagenio",
      description: "Compress PDF to under 100 KB online for free without losing readability. Instant client-side compression for passport, visa, and job uploads.",
      keywords: [
        "compress pdf to 100 kb",
        "reduce pdf size to 100 kb",
        "compress pdf under 100kb",
        "pdf size reducer 100 kb online",
        "compress pdf below 100 kb free"
      ],
      faq: [
        {
          question: "How to reduce PDF size below 100 KB?",
          answer: "Simply upload your PDF file. Our engine optimizes raster assets and document streams to fit strictly within 100 KB while preserving essential details."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "System applies target compression for 100 KB threshold.",
      "Click 'Compress to 100 KB' and download."
    ],
    localized: {
      hi: {
        slug: "compress-pdf-to-100kb",
        name: "Compress PDF to 100 KB",
        description: "पासपोर्ट, वीजा और आईडी अपलोड के लिए PDF को 100 KB से कम करें।",
        reviewed: true
      },
      id: {
        slug: "kompres-pdf-ke-100kb",
        name: "Kompres PDF ke 100 KB",
        description: "Kompres file PDF hingga di bawah 100 KB untuk paspor, visa, dan identitas.",
        reviewed: true
      },
      "pt-BR": {
        slug: "comprimir-pdf-para-100kb",
        name: "Comprimir PDF para 100 KB",
        description: "Comprima seu arquivo PDF para menos de 100 KB para passaportes, vistos e documentos.",
        reviewed: true
      }
    }
  },
  {
    id: "repair-pdf",
    slug: "repair-pdf",
    name: "Repair PDF",
    shortDescription: "Recover and repair corrupt, damaged, or unreadable PDF files.",
    longDescription: "Analyze and reconstruct broken PDF structures, damaged cross-reference tables, and corrupted page streams to restore readable documents.",
    category: "optimize",
    icon: "Wrench",
    color: "#0D9488",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Repair PDF - Fix Damaged & Corrupted PDF Online",
      description: "Repair broken or damaged PDF files and recover data from corrupt documents.",
      keywords: ["repair pdf", "fix damaged pdf", "recover pdf data"],
      faq: [
        {
          question: "Can all corrupted PDFs be repaired?",
          answer: "Files with damaged structural tables or corrupted headers can usually be fully recovered. If the file is truncated or 0-bytes, partial recovery is attempted."
        }
      ]
    },
    howTo: [
      "Upload the damaged PDF file.",
      "Our recovery engine inspects and rebuilds the PDF object tree.",
      "Download your recovered document."
    ]
  },
  {
    id: "ocr-pdf",
    slug: "ocr-pdf",
    name: "OCR PDF",
    shortDescription: "Convert scanned paper documents and images into searchable, selectable text.",
    longDescription: "Optical Character Recognition (OCR) analyzes scanned documents and photos, injecting an accurate searchable text layer over the image.",
    category: "optimize",
    icon: "ScanText",
    badge: "PRO",
    color: "#0D9488",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "OCR PDF - Make Scanned PDF Searchable Online",
      description: "Convert scanned documents and images into searchable text with high-accuracy OCR.",
      keywords: ["ocr pdf", "searchable pdf", "scanned pdf to text", "tesseract ocr"],
      faq: [
        {
          question: "Which languages are supported for OCR?",
          answer: "Over 25 languages are supported including English, Spanish, French, German, Hindi, Portuguese, and Indonesian."
        }
      ]
    },
    howTo: [
      "Upload your scanned PDF document.",
      "Select the primary language of the text.",
      "Click 'Apply OCR' to generate a searchable, copy-pasteable PDF."
    ]
  },

  // CONVERT TO PDF
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortDescription: "Convert JPG, PNG, and WebP images into high-quality PDF documents.",
    longDescription: "Convert images to PDF in seconds. Adjust orientation, margin spacing, and page size (A4, Letter, Fit to image) effortlessly.",
    category: "convert-to",
    icon: "Image",
    color: "#2563EB",
    clientExecutable: true,
    acceptedFileTypes: ["image/jpeg", "image/png", "image/webp"],
    maxFiles: 20,
    seo: {
      title: "JPG to PDF - Convert images to PDF online",
      description: "Convert JPG, PNG, and WebP images to PDF online for free. Adjust margins and page layout.",
      keywords: ["jpg to pdf", "image to pdf", "png to pdf", "photos to pdf"],
      faq: [
        {
          question: "Can I combine multiple photos into a single PDF?",
          answer: "Yes! Upload multiple images, arrange them in your preferred sequence, and they will be converted into pages of a single PDF."
        }
      ]
    },
    howTo: [
      "Upload your JPG or PNG images.",
      "Select page orientation (Portrait or Landscape) and margin size.",
      "Click 'Convert to PDF' and download."
    ],
    localized: {
      es: { slug: "convertir-jpg-a-pdf", name: "JPG a PDF", description: "Convierte imágenes JPG, PNG y WebP a documentos PDF en segundos.", reviewed: true },
      fr: { slug: "jpg-en-pdf", name: "JPG en PDF", description: "Convertissez des images JPG en PDF en quelques secondes.", reviewed: true },
      id: { slug: "jpg-ke-pdf", name: "JPG ke PDF", description: "Ubah gambar JPG, PNG, dan WebP menjadi dokumen PDF berkualitas tinggi secara instan.", reviewed: true },
      "pt-BR": { slug: "converter-jpg-em-pdf", name: "JPG para PDF", description: "Converta imagens JPG, PNG e WebP em documentos PDF de alta qualidade.", reviewed: true },
      hi: { slug: "jpg-to-pdf", name: "JPG to PDF", description: "JPG, PNG और WebP छवियों को उच्च गुणवत्ता वाली PDF में बदलें।", reviewed: true },
      vi: { slug: "chuyen-jpg-sang-pdf", name: "Chuyển JPG sang PDF", description: "Chuyển đổi hình ảnh JPG, PNG và WebP thành tài liệu PDF chất lượng cao.", reviewed: false },
    }
  },
  {
    id: "word-to-pdf",
    slug: "word-to-pdf",
    name: "WORD to PDF",
    shortDescription: "Convert DOC and DOCX documents to standard PDF with flawless formatting.",
    longDescription: "Preserve typography, layouts, tables, and images when converting Microsoft Word documents (.doc, .docx) into pristine PDF files.",
    category: "convert-to",
    icon: "FileText",
    color: "#2563EB",
    clientExecutable: false,
    acceptedFileTypes: [".doc", ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
    maxFiles: 10,
    seo: {
      title: "Convert Word to PDF online - Free DOCX to PDF Converter",
      description: "Convert DOC and DOCX documents to PDF easily with exact formatting fidelity.",
      keywords: ["word to pdf", "docx to pdf", "doc to pdf", "convert word to pdf"],
      faq: [
        {
          question: "Will the fonts and formatting look the same?",
          answer: "Yes, our server-side LibreOffice engine matches fonts and layouts precisely to ensure identical appearance."
        }
      ]
    },
    howTo: [
      "Upload your Word document (.docx or .doc).",
      "Click 'Convert to PDF'.",
      "Download your converted PDF document."
    ]
  },
  {
    id: "powerpoint-to-pdf",
    slug: "powerpoint-to-pdf",
    name: "POWERPOINT to PDF",
    shortDescription: "Turn PPT and PPTX slide presentations into viewable PDF documents.",
    longDescription: "Convert Microsoft PowerPoint presentations into easy-to-read PDFs, keeping slide layouts, graphics, and transitions intact.",
    category: "convert-to",
    icon: "Presentation",
    color: "#2563EB",
    clientExecutable: false,
    acceptedFileTypes: [".ppt", ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    maxFiles: 10,
    seo: {
      title: "PowerPoint to PDF - Convert PPTX to PDF online",
      description: "Convert PPT and PPTX presentations to PDF. High quality, fast, and free.",
      keywords: ["powerpoint to pdf", "pptx to pdf", "ppt to pdf"],
      faq: [
        {
          question: "Does each slide become a PDF page?",
          answer: "Yes, every slide in your presentation is rendered as a full-page vector slide in the PDF."
        }
      ]
    },
    howTo: [
      "Select your PowerPoint presentation file.",
      "Click 'Convert to PDF'.",
      "Download your slide deck as a PDF."
    ]
  },
  {
    id: "excel-to-pdf",
    slug: "excel-to-pdf",
    name: "EXCEL to PDF",
    shortDescription: "Convert XLS and XLSX spreadsheets to clean, formatted PDF tables.",
    longDescription: "Turn Excel workbooks into printable PDF tables with automatic column fitting and gridline preservation.",
    category: "convert-to",
    icon: "Sheet",
    color: "#2563EB",
    clientExecutable: false,
    acceptedFileTypes: [".xls", ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    maxFiles: 10,
    seo: {
      title: "Excel to PDF - Convert XLSX to PDF online",
      description: "Convert XLS and XLSX spreadsheets to PDF. Free online converter.",
      keywords: ["excel to pdf", "xlsx to pdf", "spreadsheet to pdf"],
      faq: [
        {
          question: "Are gridlines and sheet formulas preserved?",
          answer: "Yes, visible gridlines and computed values are rendered faithfully into the PDF."
        }
      ]
    },
    howTo: [
      "Upload your Excel spreadsheet.",
      "Click 'Convert to PDF'.",
      "Download your PDF spreadsheet."
    ]
  },
  {
    id: "html-to-pdf",
    slug: "html-to-pdf",
    name: "HTML to PDF",
    shortDescription: "Convert webpages or raw HTML files into pixel-perfect PDF documents.",
    longDescription: "Enter any URL or upload an HTML file to render and capture full-length webpages as downloadable PDF documents.",
    category: "convert-to",
    icon: "Globe",
    color: "#2563EB",
    clientExecutable: false,
    acceptedFileTypes: [".html", ".htm", "text/html"],
    maxFiles: 5,
    seo: {
      title: "HTML to PDF - Convert Webpages to PDF Online",
      description: "Convert webpages by URL or upload HTML files to generate high-resolution PDFs.",
      keywords: ["html to pdf", "webpage to pdf", "url to pdf"],
      faq: [
        {
          question: "Can I enter a public webpage URL?",
          answer: "Yes, just paste the URL and our engine will render the page including CSS and images."
        }
      ]
    },
    howTo: [
      "Paste the website URL or upload your HTML file.",
      "Choose page orientation and screen dimensions.",
      "Click 'Convert to PDF' and download."
    ]
  },

  // CONVERT FROM PDF
  {
    id: "pdf-to-jpg",
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortDescription: "Extract all images or render every PDF page into high-resolution JPGs.",
    longDescription: "Turn every page of your PDF file into a crisp JPG image, or extract embedded image assets directly.",
    category: "convert-from",
    icon: "FileImage",
    color: "#D97706",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "PDF to JPG - Convert PDF pages to images online",
      description: "Convert PDF pages to JPG images or extract all images contained in a PDF.",
      keywords: ["pdf to jpg", "pdf to image", "pdf to png", "convert pdf to picture"],
      faq: [
        {
          question: "What image quality can I expect?",
          answer: "Pages are rendered at high DPI (up to 300 DPI) for crystal-clear clarity."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "Choose 'Convert entire pages' or 'Extract single images'.",
      "Download your JPGs individually or as a single ZIP archive."
    ],
    localized: {
      es: { slug: "convertir-pdf-a-jpg", name: "PDF a JPG", description: "Extrae imágenes de tu PDF o convierte cada página en una imagen JPG de alta calidad.", reviewed: true },
      fr: { slug: "pdf-en-jpg", name: "PDF en JPG", description: "Convertissez des pages PDF en images JPG ou extrayez toutes les images.", reviewed: true },
      id: { slug: "pdf-ke-jpg", name: "PDF ke JPG", description: "Ekstrak semua gambar atau konversi setiap halaman PDF menjadi gambar JPG resolusi tinggi.", reviewed: true },
      "pt-BR": { slug: "converter-pdf-em-jpg", name: "PDF para JPG", description: "Extraia todas as imagens ou converta cada página do PDF em JPG de alta resolução.", reviewed: true },
      hi: { slug: "pdf-to-jpg", name: "PDF to JPG", description: "PDF पेजों को उच्च रिज़ॉल्यूशन JPG छवियों में बदलें।", reviewed: true },
      vi: { slug: "chuyen-pdf-sang-jpg", name: "Chuyển PDF sang JPG", description: "Trích xuất hình ảnh hoặc chuyển đổi từng trang PDF thành JPG độ phân giải cao.", reviewed: false },
    }
  },
  {
    id: "pdf-to-word",
    slug: "pdf-to-word",
    name: "PDF to WORD",
    shortDescription: "Convert PDFs into fully editable Microsoft Word (.docx) documents.",
    longDescription: "Reconstruct text paragraphs, font styles, and data tables from your PDF into an editable Word document with unmatched accuracy.",
    category: "convert-from",
    icon: "FileEdit",
    color: "#D97706",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "PDF to Word Converter - 100% Free & Editable DOCX",
      description: "Convert PDF to editable Word documents online with high layout accuracy.",
      keywords: ["pdf to word", "pdf to docx", "convert pdf to word editable"],
      faq: [
        {
          question: "Can I edit the text in the resulting Word document?",
          answer: "Yes! Text, headers, tables, and images are fully editable in Microsoft Word and Google Docs."
        }
      ]
    },
    howTo: [
      "Upload your PDF file.",
      "Click 'Convert to Word'.",
      "Download your editable DOCX file."
    ]
  },
  {
    id: "pdf-to-powerpoint",
    slug: "pdf-to-powerpoint",
    name: "PDF to POWERPOINT",
    shortDescription: "Turn PDF slides into editable Microsoft PowerPoint presentations.",
    longDescription: "Convert PDF decks and slide handouts into editable PPTX slide shows ready for presenting or modifying.",
    category: "convert-from",
    icon: "Presentation",
    color: "#D97706",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "PDF to PowerPoint - Convert PDF to PPTX Online",
      description: "Convert PDF documents to PowerPoint presentations online. Free and easy.",
      keywords: ["pdf to powerpoint", "pdf to pptx", "convert pdf to slides"],
      faq: [
        {
          question: "Can I present directly using the exported PPTX?",
          answer: "Yes, the converted file opens natively in PowerPoint, Keynote, and Google Slides."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Click 'Convert to PowerPoint'.",
      "Download your PPTX presentation."
    ]
  },
  {
    id: "pdf-to-excel",
    slug: "pdf-to-excel",
    name: "PDF to EXCEL",
    shortDescription: "Extract tables and tabular data from PDF files into Excel spreadsheets.",
    longDescription: "Automatically detect table structures, rows, and columns in PDF files and export them directly to Microsoft Excel spreadsheets.",
    category: "convert-from",
    icon: "Table",
    color: "#D97706",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "PDF to Excel Converter - Extract PDF tables to XLSX",
      description: "Pull data and tables out of PDF files and convert them into editable Excel spreadsheets.",
      keywords: ["pdf to excel", "pdf to xlsx", "extract tables from pdf"],
      faq: [
        {
          question: "Does it extract multi-page tables?",
          answer: "Yes, multi-page tables are detected and combined into seamless Excel worksheets."
        }
      ]
    },
    howTo: [
      "Upload your PDF containing data tables.",
      "Click 'Convert to Excel'.",
      "Download your XLSX spreadsheet."
    ]
  },
  {
    id: "pdf-to-pdfa",
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    shortDescription: "Convert documents to standard PDF/A format for long-term legal archiving.",
    longDescription: "Ensure your documents remain readable for decades. Convert to ISO-standardized PDF/A (PDF/A-1b, PDF/A-2b) with embedded fonts and color profiles.",
    category: "convert-from",
    icon: "Archive",
    color: "#D97706",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "PDF to PDF/A - Convert to ISO Archival Format",
      description: "Convert PDF documents to PDF/A for long-term digital preservation and legal compliance.",
      keywords: ["pdf to pdfa", "pdf/a converter", "pdf archival standard"],
      faq: [
        {
          question: "What is PDF/A?",
          answer: "PDF/A is an ISO-standardized version of the PDF format specialized for preservation and long-term archiving of digital documents."
        }
      ]
    },
    howTo: [
      "Upload the PDF document.",
      "Select your compliance profile (PDF/A-1b or PDF/A-2b).",
      "Click 'Convert to PDF/A' and download."
    ]
  },

  // EDIT
  {
    id: "rotate-pdf",
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortDescription: "Rotate PDF pages clockwise or counterclockwise with instant preview.",
    longDescription: "Rotate all pages at once or rotate specific pages by 90, 180, or 270 degrees. Visual thumbnail interface ensures exact orientation.",
    category: "edit",
    icon: "RotateCw",
    color: "#7C3AED",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Rotate PDF pages online - Permanent PDF Page Rotation",
      description: "Rotate your PDF pages clockwise or counter-clockwise online. Free, permanent, and secure.",
      keywords: ["rotate pdf", "turn pdf pages", "rotate pdf permanently"],
      faq: [
        {
          question: "Is the rotation permanent?",
          answer: "Yes, when you download the modified PDF, the orientation metadata and coordinates are permanently updated."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Click the rotate buttons on individual page thumbnails or click 'Rotate All'.",
      "Download your properly aligned PDF."
    ],
    localized: {
      es: { slug: "rotar-pdf", name: "Rotar PDF", description: "Gira las páginas de tu PDF según lo necesites y guarda el archivo.", reviewed: true },
      fr: { slug: "pivoter-pdf", name: "Pivoter PDF", description: "Faites pivoter vos pages PDF selon vos besoins.", reviewed: true },
      id: { slug: "putar-pdf", name: "Putar PDF", description: "Putar halaman PDF searah atau berlawanan arah jarum jam dengan pratinjau instan.", reviewed: true },
      "pt-BR": { slug: "girar-pdf", name: "Girar PDF", description: "Gire páginas de PDF no sentido horário ou anti-horário com visualização instantânea.", reviewed: true },
      hi: { slug: "rotate-pdf", name: "Rotate PDF", description: "PDF पेजों को 90, 180 या 270 डिग्री घुमाएं।", reviewed: true },
      vi: { slug: "xoay-file-pdf", name: "Xoay file PDF", description: "Xoay trang PDF theo chiều kim đồng hồ hoặc ngược lại dễ dàng.", reviewed: false },
    }
  },
  {
    id: "add-page-numbers",
    slug: "add-page-numbers",
    name: "Page Numbers",
    shortDescription: "Insert customized page numbers into your PDF with flexible positioning.",
    longDescription: "Add sequential page numbers to headers or footers. Customize text format ('Page 1 of N', '1', 'Document - 1'), font, size, and margin offsets.",
    category: "edit",
    icon: "ListOrdered",
    color: "#7C3AED",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Add Page Numbers to PDF - Number PDF Pages Online",
      description: "Insert page numbers into PDF documents easily. Choose position, font, and formatting.",
      keywords: ["add page numbers to pdf", "number pdf pages", "page numbering online"],
      faq: [
        {
          question: "Can I exclude the cover page from numbering?",
          answer: "Yes! You can specify starting page offset and choose which pages to number."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Choose position (bottom right, bottom center, top right), format, and font size.",
      "Click 'Add Page Numbers' and download."
    ],
    localized: {
      es: { slug: "numerar-paginas-pdf", name: "Numerar Páginas PDF", description: "Añade números de página a tus documentos PDF con formato personalizado.", reviewed: true },
      fr: { slug: "numeroter-pdf", name: "Numéroter PDF", description: "Ajoutez facilement des numéros de page à votre document PDF.", reviewed: true },
      id: { slug: "nomor-halaman-pdf", name: "Nomor Halaman PDF", description: "Tambahkan nomor halaman yang dapat disesuaikan ke header atau footer PDF Anda.", reviewed: true },
      "pt-BR": { slug: "numerar-paginas-pdf", name: "Numerar Páginas PDF", description: "Insira números de página personalizados no cabeçalho ou rodapé do seu PDF.", reviewed: true },
      hi: { slug: "add-page-numbers", name: "Page Numbers", description: "अपने PDF दस्तावेज़ में पेज नंबर जोड़ें।", reviewed: true },
      vi: { slug: "danh-so-trang-pdf", name: "Đánh số trang PDF", description: "Thêm số trang tùy chỉnh vào tiêu đề đầu hoặc chân trang PDF.", reviewed: false },
    }
  },
  {
    id: "watermark-pdf",
    slug: "watermark-pdf",
    name: "Add Watermark",
    shortDescription: "Stamp text or logo watermarks over or behind PDF pages with opacity controls.",
    longDescription: "Protect your intellectual property or brand your documents. Add text or image watermarks with custom rotation angles, opacity sliders, and 9-point grid alignment.",
    category: "edit",
    icon: "Stamp",
    color: "#7C3AED",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Add Watermark to PDF - Stamp Text or Image Online",
      description: "Stamp customized text or image watermarks onto PDF pages with custom opacity and positioning.",
      keywords: ["watermark pdf", "add watermark to pdf", "stamp pdf", "confidential watermark"],
      faq: [
        {
          question: "Can I use my company logo as a watermark?",
          answer: "Yes, upload any PNG or JPG logo and set transparency and placement."
        }
      ]
    },
    howTo: [
      "Upload your PDF file.",
      "Choose between Text or Image watermark, adjust opacity, rotation, and position.",
      "Click 'Apply Watermark' and download."
    ]
  },
  {
    id: "crop-pdf",
    slug: "crop-pdf",
    name: "Crop PDF",
    shortDescription: "Trim margins and crop specific areas across pages in your PDF.",
    longDescription: "Adjust page boundaries, remove wide margins, or crop specific regions with interactive visual bounding box controls.",
    category: "edit",
    icon: "Crop",
    color: "#7C3AED",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Crop PDF - Trim PDF Margins and Pages Online",
      description: "Crop PDF pages online. Select custom boundaries to remove whitespace or crop content.",
      keywords: ["crop pdf", "trim pdf", "remove pdf margins"],
      faq: [
        {
          question: "Can I crop all pages to the same size?",
          answer: "Yes, you can apply your crop dimensions to the current page or across all pages simultaneously."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "Drag the crop boundary handles over the document preview.",
      "Click 'Crop PDF' and download."
    ]
  },
  {
    id: "edit-pdf",
    slug: "edit-pdf",
    name: "Edit PDF",
    shortDescription: "Add text, annotations, shapes, images, and freehand drawings to your PDF.",
    longDescription: "Full-featured online PDF editor: insert text boxes, draw freehand annotations, highlight sections, add geometric shapes, and place custom images.",
    category: "edit",
    icon: "PenTool",
    color: "#7C3AED",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 1,
    seo: {
      title: "Edit PDF - Free Online PDF Editor",
      description: "Edit PDF documents directly in your browser. Add text, shapes, highlights, and annotations.",
      keywords: ["edit pdf", "online pdf editor", "annotate pdf", "draw on pdf"],
      faq: [
        {
          question: "Can I add text directly over PDF pages?",
          answer: "Yes, click the 'Text' tool to create text boxes anywhere on your document with customizable fonts and colors."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "Use the toolbar to add text, drawings, highlights, or images.",
      "Click 'Save and Download' to get your annotated PDF."
    ]
  },

  // SECURITY
  {
    id: "unlock-pdf",
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortDescription: "Remove password protection and printing restrictions from your PDF.",
    longDescription: "Unlock password-protected PDF files to remove printing, copying, and editing restrictions permanently.",
    category: "security",
    icon: "Unlock",
    color: "#E11D48",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Unlock PDF - Remove PDF Password & Restrictions",
      description: "Remove passwords and security restrictions from PDF files quickly and easily.",
      keywords: ["unlock pdf", "remove pdf password", "decrypt pdf"],
      faq: [
        {
          question: "Do I need the password to unlock the document?",
          answer: "If the document has an open password, you must enter it once so our engine can decrypt the stream. Permission locks (print/copy restrictions) can be stripped automatically."
        }
      ]
    },
    howTo: [
      "Upload your password-protected PDF.",
      "Enter the document password if required.",
      "Download your unrestricted PDF."
    ],
    localized: {
      es: { slug: "desbloquear-pdf", name: "Desbloquear PDF", description: "Quita la contraseña de los archivos PDF y desbloquea permisos de impresión.", reviewed: true },
      fr: { slug: "deverrouiller-pdf", name: "Déverrouiller PDF", description: "Supprimez le mot de passe et les restrictions de vos fichiers PDF.", reviewed: true },
      id: { slug: "buka-kunci-pdf", name: "Buka Kunci PDF", description: "Hapus kata sandi dan batasan keamanan dari file PDF secara cepat dan mudah.", reviewed: true },
      "pt-BR": { slug: "desbloquear-pdf", name: "Desbloquear PDF", description: "Remova a senha e as restrições de segurança do seu arquivo PDF.", reviewed: true },
      hi: { slug: "unlock-pdf", name: "Unlock PDF", description: "PDF से पासवर्ड और सुरक्षा प्रतिबंध हटाएं।", reviewed: true },
      vi: { slug: "mo-khoa-file-pdf", name: "Mở khóa file PDF", description: "Xóa mật khẩu và hạn chế bảo mật khỏi tệp PDF nhanh chóng.", reviewed: false },
    }
  },
  {
    id: "protect-pdf",
    slug: "protect-pdf",
    name: "Protect PDF",
    shortDescription: "Encrypt your PDF with strong AES-256 password protection.",
    longDescription: "Secure confidential documents with military-grade AES encryption. Require a password to open, view, or modify the file.",
    category: "security",
    icon: "Lock",
    color: "#E11D48",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 10,
    seo: {
      title: "Protect PDF - Password Protect PDF Online",
      description: "Encrypt your PDF with a password to prevent unauthorized access. Fast, secure, and free.",
      keywords: ["protect pdf", "password protect pdf", "encrypt pdf"],
      faq: [
        {
          question: "How secure is the encryption?",
          answer: "We use standard AES-256 bit encryption, the industry gold standard for document confidentiality."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Enter and confirm your chosen password.",
      "Click 'Protect PDF' and download your encrypted document."
    ],
    localized: {
      es: { slug: "proteger-pdf", name: "Proteger PDF", description: "Protege documentos PDF con una contraseña y cifrado fuerte.", reviewed: true },
      fr: { slug: "proteger-pdf", name: "Protéger PDF", description: "Protégez vos fichiers PDF avec un mot de passe fort et chiffrement AES.", reviewed: true },
      id: { slug: "kunci-pdf", name: "Kunci PDF", description: "Enkripsi PDF Anda dengan kata sandi AES-256 yang kuat untuk perlindungan maksimal.", reviewed: true },
      "pt-BR": { slug: "proteger-pdf", name: "Proteger PDF", description: "Proteja seus documentos PDF com senha forte e criptografia AES-256.", reviewed: true },
      hi: { slug: "protect-pdf", name: "Protect PDF", description: "मजबूत AES-256 पासवर्ड से अपने PDF को सुरक्षित करें।", reviewed: true },
      vi: { slug: "khoa-file-pdf", name: "Khóa file PDF", description: "Bảo vệ tệp PDF bằng mật khẩu mã hóa AES-256 mạnh mẽ.", reviewed: false },
    }
  },
  {
    id: "sign-pdf",
    slug: "sign-pdf",
    name: "Sign PDF",
    shortDescription: "Create your electronic signature and sign PDF documents online.",
    longDescription: "Draw your signature with a mouse/touchpad, type your name in elegant script, or upload a scanned signature image. Place it seamlessly on any page.",
    category: "security",
    icon: "FileSignature",
    color: "#E11D48",
    clientExecutable: true,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Sign PDF online - Free Electronic Signature Tool",
      description: "Sign PDF documents online with legally binding electronic signatures. Draw, type, or upload your signature.",
      keywords: ["sign pdf", "electronic signature pdf", "esign pdf", "draw signature on pdf"],
      faq: [
        {
          question: "Can I sign documents on my phone or tablet?",
          answer: "Yes, our drawing canvas supports smooth touch input on smartphones, iPads, and touch-screen devices."
        }
      ]
    },
    howTo: [
      "Upload the PDF you need to sign.",
      "Draw, type, or upload your signature.",
      "Drag and place the signature onto the document, then click 'Download Signed PDF'."
    ],
    localized: {
      es: { slug: "firmar-pdf", name: "Firmar PDF", description: "Firma documentos PDF en línea con tu firma digital o dibuja tu firma fácilmente.", reviewed: true },
      fr: { slug: "signer-pdf", name: "Signer PDF", description: "Signez vos documents PDF en ligne avec une signature électronique sécurisée.", reviewed: true },
      id: { slug: "tanda-tangani-pdf", name: "Tanda Tangani PDF", description: "Buat tanda tangan elektronik dan tandatangani dokumen PDF secara online dengan aman.", reviewed: true },
      "pt-BR": { slug: "assinar-pdf", name: "Assinar PDF", description: "Crie sua assinatura eletrônica e assine documentos PDF online com facilidade.", reviewed: true },
      hi: { slug: "sign-pdf", name: "Sign PDF", description: "अपने PDF दस्तावेज़ों पर इलेक्ट्रॉनिक हस्ताक्षर बनाएं और लगाएं।", reviewed: true },
      vi: { slug: "ky-ten-file-pdf", name: "Ký tên file PDF", description: "Tạo chữ ký điện tử và ký tài liệu PDF trực tuyến nhanh chóng.", reviewed: false },
    }
  },
  {
    id: "redact-pdf",
    slug: "redact-pdf",
    name: "Redact PDF",
    shortDescription: "Permanently scrub sensitive text, numbers, and images from your PDF.",
    longDescription: "Ensure true confidentiality. Black out and permanently sanitize sensitive private data, social security numbers, and confidential text.",
    category: "security",
    icon: "EyeOff",
    badge: "PRO",
    color: "#E11D48",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 5,
    seo: {
      title: "Redact PDF - Black Out Sensitive Information Online",
      description: "Permanently remove and black out confidential text and sensitive images from PDF files.",
      keywords: ["redact pdf", "black out pdf", "sanitize pdf", "remove sensitive info"],
      faq: [
        {
          question: "Is redacted text completely irrecoverable?",
          answer: "Yes, true redaction removes the underlying text objects and raster pixels from the PDF binary stream, not just placing a box over it."
        }
      ]
    },
    howTo: [
      "Upload your PDF.",
      "Draw black selection boxes over sensitive text or images.",
      "Click 'Apply Redaction' and download your sanitized file."
    ]
  },
  {
    id: "compare-pdf",
    slug: "compare-pdf",
    name: "Compare PDF",
    shortDescription: "Compare two PDF documents side-by-side to highlight visual and text differences.",
    longDescription: "Upload two revisions of a document. Our comparison engine highlights added, deleted, or modified text and visual elements side-by-side.",
    category: "security",
    icon: "GitCompare",
    badge: "PRO",
    color: "#E11D48",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 2,
    seo: {
      title: "Compare PDF Documents - Side-by-Side PDF Diff",
      description: "Compare two PDF files online and highlight visual and textual differences immediately.",
      keywords: ["compare pdf", "pdf diff", "compare two pdfs", "document comparison"],
      faq: [
        {
          question: "How are differences displayed?",
          answer: "Differences are color-coded: green for additions, red for deletions, and yellow for modified text."
        }
      ]
    },
    howTo: [
      "Upload the original and the revised PDF files.",
      "Review the synchronized split-screen comparison.",
      "Export the comparison summary report."
    ]
  },

  // AI TOOLS
  {
    id: "ai-summarize-pdf",
    slug: "ai-summarize-pdf",
    name: "AI Summarize",
    shortDescription: "Generate executive summaries and key bullet points using AI.",
    longDescription: "Extract deep insights from lengthy reports, academic research, and legal briefs. Our AI analyzes your document and generates structured summaries.",
    category: "ai",
    icon: "Sparkles",
    badge: "AI",
    color: "#6366F1",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 3,
    seo: {
      title: "AI PDF Summarizer - Summarize PDF Online with AI",
      description: "Summarize long PDF documents instantly with AI. Extract key points, summaries, and action items.",
      keywords: ["ai summarize pdf", "summarize pdf", "ai pdf summary", "chatgpt pdf"],
      faq: [
        {
          question: "Can I summarize multi-page books or research papers?",
          answer: "Yes, our chunking pipeline handles large multi-page documents and extracts structured key findings."
        }
      ]
    },
    howTo: [
      "Upload your PDF document.",
      "Click 'Generate AI Summary'.",
      "Read, copy, or download the executive summary."
    ]
  },
  {
    id: "ai-translate-pdf",
    slug: "ai-translate-pdf",
    name: "AI Translate",
    shortDescription: "Translate full PDF documents into 50+ languages while preserving layout.",
    longDescription: "Translate documents seamlessly between languages without losing typography, headers, or formatting structure.",
    category: "ai",
    icon: "Languages",
    badge: "AI",
    color: "#6366F1",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 3,
    seo: {
      title: "AI PDF Translator - Translate PDF to Any Language",
      description: "Translate PDF documents online into over 50 languages with AI accuracy.",
      keywords: ["ai translate pdf", "translate pdf online", "multilingual pdf translator"],
      faq: [
        {
          question: "Does it support right-to-left languages like Arabic?",
          answer: "Yes, translations into Arabic, Hebrew, and Persian format proper RTL typography."
        }
      ]
    },
    howTo: [
      "Upload your document.",
      "Choose your target language.",
      "Click 'Translate' and download your translated PDF."
    ]
  },
  {
    id: "chat-pdf",
    slug: "chat-pdf",
    name: "Chat with PDF",
    shortDescription: "Ask questions, analyze tables, and converse directly with your PDF.",
    longDescription: "Turn any document into an interactive assistant. Ask specific questions, query data, and get cited answers instantly.",
    category: "ai",
    icon: "MessageSquare",
    badge: "AI",
    color: "#6366F1",
    clientExecutable: false,
    acceptedFileTypes: ["application/pdf"],
    maxFiles: 1,
    seo: {
      title: "Chat with PDF - Interactive AI Document Assistant",
      description: "Chat with your PDF files using AI. Ask questions, extract answers, and analyze reports.",
      keywords: ["chat with pdf", "ask pdf questions", "ai document chat"],
      faq: [
        {
          question: "Does it cite page numbers for answers?",
          answer: "Yes, every answer includes exact page citations so you can cross-verify information."
        }
      ]
    },
    howTo: [
      "Upload your document.",
      "Ask any question in the chat bar.",
      "Receive detailed answers with document citations."
    ]
  }
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug || Object.values(t.localized || {}).some((l) => l.slug === slug));
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

