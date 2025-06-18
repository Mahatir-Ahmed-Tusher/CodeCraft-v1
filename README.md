# CodeCraft - AI-Powered No-Code Platform

CodeCraft is an innovative bilingual (English/Bengali) no-code platform that empowers users to create web applications and perform data science through natural language prompts. Built with cutting-edge technologies, it democratizes software development by making it accessible to everyone, regardless of coding expertise.

## 🌟 Features

### Core Functionality
- **Natural Language to Code**: Describe your app in plain English or Bengali and watch it come to life
- **Live Preview**: Real-time preview using WebContainer technology
- **Bilingual Support**: Full English and Bengali language support with Hind Siliguri font
- **Interactive Code Editor**: Monaco editor with syntax highlighting and IntelliSense
- **Project Management**: Save, organize, and download projects as ZIP files
- **DataGenie Integration**: AI-powered data science assistant for dataset generation and ML workflows

### User Interface
- **Responsive Design**: Mobile-first design with hamburger navigation
- **Dark/Light Theme**: System-aware theme switching
- **Modern Animations**: Smooth transitions and hover effects
- **Settings Management**: Centralized settings for theme and language preferences

### Platform Pages
- **Landing Page**: Hero section with animated elements and DataGenie promotion
- **Blog Section**: Latest insights on web development and data science
- **About Page**: Detailed information about CodeCraft and developer Mahatir Ahmed Tusher
- **Settings Page**: Theme and language configuration
- **Project Gallery**: Manage and view your generated applications

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for state management
- **Monaco Editor** for code editing
- **Radix UI** components for accessibility
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Groq API** with llama-3.3-70b-versatile model
- **WebContainer** for browser-based code execution
- **In-memory storage** with planned database integration

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **PostCSS** with Autoprefixer
- **Drizzle ORM** for database operations

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **VSCode** (recommended)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd codecraft
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Groq API key:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   NODE_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint

# Format code
npm run format
```

## 🏗 Project Structure

```
codecraft/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn/ui components
│   │   │   ├── chat-interface.tsx
│   │   │   ├── code-editor.tsx
│   │   │   ├── preview-frame.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── LanguageContext.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── use-webcontainer.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/           # Utility libraries
│   │   │   ├── utils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── groq-client.ts
│   │   ├── pages/         # Page components
│   │   │   ├── landing.tsx
│   │   │   ├── home.tsx
│   │   │   ├── chat.tsx
│   │   │   ├── projects.tsx
│   │   │   ├── datagenie.tsx
│   │   │   ├── blog.tsx
│   │   │   ├── about.tsx
│   │   │   ├── settings.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # App entry point
│   │   └── index.css      # Global styles
│   └── index.html         # HTML template
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schemas
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🔧 Key Development Areas

### Working on Code Generation Features
**Primary Files:**
- `server/routes.ts` - AI prompt handling and code generation logic
- `client/src/lib/groq-client.ts` - Groq API integration
- `client/src/components/chat-interface.tsx` - User interaction handling

**Key Functions:**
- `parseBoltArtifact()` - Parses AI-generated code artifacts
- `formatMessagesForGroq()` - Formats messages for Groq API
- `extractCodeBlocks()` - Extracts code from AI responses

### Working on WebContainer/Preview Features
**Primary Files:**
- `client/src/hooks/use-webcontainer.ts` - WebContainer integration
- `client/src/components/preview-frame.tsx` - Preview rendering
- `client/src/components/enhanced-webcontainer.tsx` - Advanced preview features

**Key Areas:**
- File system mounting for generated projects
- npm install and dev server automation
- Error handling and build status reporting
- Cross-origin isolation requirements

### Working on UI/UX Features
**Primary Files:**
- `client/src/pages/landing.tsx` - Main landing page
- `client/src/contexts/LanguageContext.tsx` - Bilingual support
- `client/src/components/mobile-nav.tsx` - Mobile navigation
- `client/src/pages/settings.tsx` - User preferences

**Key Areas:**
- Theme switching (light/dark mode)
- Language switching (English/Bengali)
- Responsive design improvements
- Animation and interaction enhancements

### Working on Data Management
**Primary Files:**
- `server/storage.ts` - Data persistence layer
- `shared/schema.ts` - Type definitions and schemas
- `client/src/lib/queryClient.ts` - API client configuration

**Key Areas:**
- Project CRUD operations
- Chat message persistence
- File upload and download handling
- Database migrations (when implemented)

## 🌐 Deployment Considerations

### Production Environment
- Ensure Groq API key is properly configured
- Set up Cross-Origin-Isolation headers for WebContainer support
- Configure proper CORS settings
- Set up environment-specific configurations

### WebContainer Requirements
WebContainer requires specific browser headers:
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### Performance Optimizations
- Implement code splitting for large components
- Optimize bundle size with proper tree shaking
- Add service worker for offline functionality
- Implement proper caching strategies

## 🤝 Contributing

### Code Style Guidelines
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Development Workflow
1. Create feature branch from main
2. Implement changes with proper testing
3. Ensure all TypeScript errors are resolved
4. Test across different browsers and devices
5. Submit pull request with detailed description

### Testing Areas
- Cross-browser compatibility
- Mobile responsiveness
- Language switching functionality
- Theme switching
- Code generation accuracy
- WebContainer integration

## 📚 Additional Resources

### API Documentation
- [Groq API Documentation](https://groq.com/docs)
- [WebContainer API Reference](https://webcontainer.io/api)

### UI Components
- [Radix UI Documentation](https://radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)

### Development Tools
- [Vite Documentation](https://vitejs.dev)
- [React Query Documentation](https://tanstack.com/query)

## 🐛 Troubleshooting

### Common Issues

**WebContainer Not Working:**
- Check browser console for SharedArrayBuffer errors
- Verify Cross-Origin-Isolation headers are set
- Try in a different browser (Chrome/Edge recommended)

**API Key Issues:**
- Verify Groq API key is correctly set in .env
- Check API key permissions and quotas
- Ensure environment variables are loaded

**Build Errors:**
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration
- Verify all imports are correct

**Language/Theme Not Persisting:**
- Check localStorage in browser developer tools
- Verify context providers are properly wrapped
- Clear browser cache and try again

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 👥 Team

**Lead Developer:** Mahatir Ahmed Tusher
- VIT-AP University Computer Science Student
- Machine Learning & Full-Stack Development Expert
- Research Publications: 5+ papers with 69 citations
- GitHub: 25+ repositories

For questions, support, or contributions, please contact the development team or open an issue in the repository.