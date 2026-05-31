# 📋 HukumVibe

> **AI-Powered Indonesian Employment Contract Analysis Platform**

HukumVibe adalah platform SaaS berbasis Next.js yang dirancang khusus untuk analisis kontrak kerja Indonesia. Platform ini menggunakan AI untuk mengekstrak, memvalidasi, dan menganalisis dokumen PDF kontrak kerja secara otomatis.

## 🌟 Fitur Utama

- **PDF Contract Upload** - Unggah dokumen kontrak kerja dalam format PDF
- **AI-Powered Analysis** - Analisis otomatis menggunakan Google Gemini AI
- **Smart Validation** - Validasi dokumen untuk memastikan format kontrak kerja yang valid
- **Interactive Insights** - Visualisasi insight yang terhubung langsung dengan sumber dokumen
- **Chat Assistant** - ChatBuddy untuk pertanyaan lanjutan dalam bahasa Indonesia
- **Document History** - Riwayat analisis tersimpan dalam local storage
- **Responsive Design** - UI yang responsif dan modern menggunakan Tailwind CSS

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **UI Components** | Shadcn-style primitives + Lucide Icons |
| **AI Integration** | Google Generative AI (Gemini) |
| **PDF Processing** | pdf-parse + PDF.js |
| **Validation** | Zod |
| **Database** | Supabase (optional) |

## 📦 Prerequisites

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** v18+ dan **npm** atau **yarn**
- **Git** untuk version control
- **Google Gemini API Key** (gratis di [Google AI Studio](https://aistudio.google.com))

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/hukumvibe.git
cd hukumvibe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Kemudian edit `.env.local` dan tambahkan:

```env
GEMINI_API_KEY=your_api_key_here
# Optional: untuk demo tanpa API key
# ALLOW_DEMO_ANALYSIS=true
```

### 4. Run Development Server

```bash
npm run dev
```

Akses aplikasi di [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

Untuk menjalankan aplikasi dalam container Docker:

```bash
docker compose up --build
```

Container production mendengarkan di port `8080` dan siap dideploy ke Google Cloud Run.

## 📍 Routes & Pages

| Route | Deskripsi |
|-------|-----------|
| `/` | Landing page - pengenalan aplikasi |
| `/dashboard` | Workspace upload dan riwayat dokumen |
| `/analyze/[id]` | Split-screen: PDF viewer & AI insights |
| `/library` | Koleksi analisis dari session browser |
| `/cara-kerja` | Panduan cara kerja aplikasi |

## 🔌 API Endpoints

### POST `/api/analyze`
Analisis dokumen kontrak kerja dari PDF upload.

**Request:**
- Form data dengan file PDF

**Response:**
```json
{
  "id": "uuid",
  "contractType": "string",
  "keyClause": "object",
  "insights": "array",
  "metadata": "object"
}
```

### POST `/api/chat`
Streaming respons chat follow-up dalam bahasa Indonesia.

**Request:**
```json
{
  "message": "Pertanyaan tentang kontrak",
  "analysisId": "uuid"
}
```

## 📚 Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── api/          # API routes
│   ├── dashboard/    # Dashboard page
│   ├── analyze/      # Analysis page
│   └── library/      # Library page
├── components/       # React components
│   ├── analyze/      # Analysis-specific components
│   ├── dashboard/    # Dashboard components
│   └── ui/          # Reusable UI primitives
├── hooks/           # Custom React hooks
├── lib/             # Utilities & core logic
│   ├── ai/          # AI integration
│   ├── documents/   # Document storage
│   └── pdf/         # PDF utilities
└── types/           # TypeScript type definitions
```

## 📖 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build untuk production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Type checking dengan TypeScript
```

## 🔐 Security & Storage

Fitur storage saat ini:
- **Session Storage**: Full analyses dalam `sessionStorage` (browser session)
- **Local Storage**: History cards dalam `localStorage` (persistent)

**Untuk Production Multi-User:**
Ganti `src/lib/documents/storage.ts` dengan:
- Database-backed document service
- Signed object storage untuk PDF files
- Proper authentication & authorization

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Buat branch** fitur (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Buka Pull Request**

## 📝 License

Project ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 👨‍💼 Author

Dibuat dengan ❤️ untuk membantu profesional hukum Indonesia menganalisis kontrak kerja dengan lebih efisien.

## 📞 Support

Untuk pertanyaan atau laporan bug, silakan buat [GitHub Issue](https://github.com/yourusername/hukumvibe/issues).
