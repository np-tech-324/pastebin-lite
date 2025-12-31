# 📋 Pastebin Lite

A lightweight, modern pastebin application built with Next.js 16. Share text snippets with optional expiration times and view limits.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## ✨ Features

- **📝 Simple Text Sharing** - Create and share text snippets instantly
- **⏱️ Time-Based Expiration** - Set custom TTL (Time To Live) in seconds
- **👁️ View Limits** - Restrict paste access to a maximum number of views
- **🔄 Real-time Countdown** - Live timer showing remaining time before expiration
- **📊 View Counter** - Track how many times a paste has been viewed
- **🎨 Clean UI** - Modern, responsive design with gradient backgrounds
- **⚡ Fast & Lightweight** - Built with Next.js App Router for optimal performance

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Runtime**: React 19.2.3
- **ID Generation**: nanoid 5.1.6
- **Styling**: Vanilla CSS with custom component styles

### Project Structure

```
pastebin-lite/
├── src/
│   └── app/
│       ├── api/
│       │   └── pastes/
│       │       ├── route.ts              # POST endpoint to create pastes
│       │       └── [id]/
│       │           └── route.ts          # GET endpoint to retrieve pastes
│       ├── p/
│       │   └── [id]/
│       │       ├── page.tsx              # Paste viewer page wrapper
│       │       ├── PasteViewer.tsx       # Client component for viewing pastes
│       │       └── pasteViewer.css       # Styles for paste viewer
│       ├── page.tsx                      # Homepage with paste creation form
│       ├── page.css                      # Styles for homepage
│       ├── globals.css                   # Global styles and CSS variables
│       └── layout.tsx                    # Root layout
├── public/                               # Static assets
├── package.json                          # Dependencies and scripts
└── README.md                             # This file
```

## 🔄 Application Workflow

### 1. **Creating a Paste**

```
User Input → Form Submission → API Request → Generate ID → Store Data → Return URL
```

**Process:**
1. User enters text content in the textarea on the homepage
2. Optionally sets TTL (seconds) and/or max views
3. Clicks "Create Paste" button
4. Frontend sends POST request to `/api/pastes`
5. Backend generates unique 10-character ID using nanoid
6. Paste data stored in-memory with metadata:
   - `content`: The text content
   - `views`: View counter (starts at 0)
   - `createdAt`: Timestamp
   - `expiresAt`: Optional expiration timestamp
   - `maxViews`: Optional view limit
7. Returns shareable URL: `http://localhost:3000/p/{id}`

### 2. **Viewing a Paste**

```
Access URL → Fetch Data → Validate → Increment Views → Display Content
```

**Process:**
1. User navigates to `/p/{id}`
2. Client component fetches paste from `/api/pastes/{id}`
3. Backend validates:
   - Paste exists
   - Not expired (time-based)
   - Not exceeded max views
4. Increments view counter
5. Returns paste data
6. Frontend displays:
   - Content in code block
   - Current views / max views
   - Remaining time (live countdown)
   - Warning if approaching view limit

### 3. **Expiration Logic**

**Time-Based Expiration:**
- When TTL is set, `expiresAt = createdAt + (ttl_seconds * 1000)`
- Client-side countdown updates every second
- Server validates on each request
- Paste deleted when expired

**View-Based Expiration:**
- When max views reached, paste is deleted
- Warning shown when views remaining < max views
- Each page load increments counter

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd pastebin-lite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📖 Usage Examples

### Create a Simple Paste

1. Enter your text in the textarea
2. Click "Create Paste"
3. Share the generated URL

### Create a Paste with 5-Minute Expiration

1. Enter your text
2. Set TTL to `300` (5 minutes × 60 seconds)
3. Click "Create Paste"
4. Paste will auto-delete after 5 minutes

### Create a One-Time View Paste

1. Enter your text
2. Set Max Views to `1`
3. Click "Create Paste"
4. Paste will be deleted after first view

### Combine Time and View Limits

1. Enter your text
2. Set TTL to `3600` (1 hour)
3. Set Max Views to `10`
4. Paste expires after 1 hour OR 10 views (whichever comes first)

## 🎨 UI Components

### Homepage (`page.tsx` + `page.css`)
- **Layout**: Centered card with gradient background
- **Form Elements**:
  - Textarea for content input
  - Number input for TTL (seconds)
  - Number input for max views
  - Submit button
- **Feedback**: Success message with clickable URL or error message

### Paste Viewer (`PasteViewer.tsx` + `pasteViewer.css`)
- **States**:
  - Loading: Shows "Loading paste…"
  - Error: Displays error with "Create New Paste" button
  - Success: Shows paste content with metadata
- **Content Display**:
  - Pre-formatted text block (preserves whitespace)
  - View counter with optional max views
  - Warning badge when views remaining
  - Live countdown timer for expiring pastes
  - "Create New Paste" button

## 🗄️ Data Storage

**Current Implementation**: In-memory storage using `globalThis`

```typescript
const store = globalThis as unknown as {
  pastes?: Map<string, PasteData>;
};
```

**Limitations**:
- Data lost on server restart
- Not suitable for production at scale
- No persistence across deployments

**Production Alternatives**:
- **Vercel KV** (Redis) - Already included in dependencies
- **PostgreSQL** with Prisma
- **MongoDB** with Mongoose
- **Supabase** for serverless database

## 🔐 Environment Variables

Create a `.env.local` file for configuration:

```env
# Base URL for paste links (optional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# For Vercel KV (if using Redis storage)
KV_URL=your_kv_url
KV_REST_API_URL=your_api_url
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (if needed)
   - Deploy

3. **Upgrade Storage** (Recommended):
   - Enable Vercel KV in your project dashboard
   - Update API routes to use KV instead of in-memory storage

### Deploy to Other Platforms

- **Netlify**: Use `next export` for static export
- **Railway**: Connect GitHub repo and deploy
- **DigitalOcean App Platform**: Deploy from GitHub
- **Self-hosted**: Use `npm run build` and `npm start`

## 🛠️ Development Workflow

### Adding New Features

1. **Plan**: Define the feature requirements
2. **API**: Update API routes if backend changes needed
3. **UI**: Create/modify components and styles
4. **Test**: Test locally with `npm run dev`
5. **Build**: Verify production build with `npm run build`
6. **Deploy**: Push to repository and deploy

### Code Style

- **TypeScript**: Strict typing for all components and API routes
- **React**: Functional components with hooks
- **CSS**: Component-scoped CSS files with descriptive class names
- **Naming**: Descriptive variable and function names

## 🐛 Known Limitations

1. **In-Memory Storage**: Data lost on server restart
2. **No Authentication**: Anyone can create pastes
3. **No Editing**: Pastes cannot be modified after creation
4. **No Deletion**: No manual delete option (only auto-expiration)
5. **No Syntax Highlighting**: Plain text display only
6. **No Rate Limiting**: Potential for abuse

## 🔮 Future Enhancements

- [ ] Persistent storage (Redis/PostgreSQL)
- [ ] Syntax highlighting for code
- [ ] User accounts and paste management
- [ ] Password-protected pastes
- [ ] Custom URLs/slugs
- [ ] Paste editing
- [ ] Rate limiting and spam protection
- [ ] API key authentication
- [ ] Dark/light mode toggle
- [ ] Copy to clipboard button
- [ ] Download paste as file
- [ ] Paste statistics dashboard

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Next.js documentation

---

**Built with ❤️ using Next.js 16**
