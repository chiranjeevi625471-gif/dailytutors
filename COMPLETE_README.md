# 🎓 Daily Tutors - AI-Powered UPSC Preparation Platform

> A production-ready, fully-automated AI-powered UPSC preparation platform built with Next.js 15, MongoDB, and Groq AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Vercel Pro account
- Razorpay account
- Groq API access

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/dailytutors.git
cd dailytutors

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials
nano .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📋 Features

### ✅ Completed
- **Authentication System**
  - Email/password registration
  - Google OAuth login
  - JWT-based sessions
  - Admin authentication

- **Course Platform**
  - Course creation and management
  - Module and lesson organization
  - Video, PDF, and reading content
  - Progress tracking
  - Student enrollment

- **Payment Integration**
  - Razorpay payment processing
  - Secure checkout flow
  - Payment verification
  - Order management

- **AI-Powered Current Affairs**
  - Automated news fetching from multiple sources
  - AI-powered content generation (Groq)
  - MCQ generation
  - Summary and keyword extraction
  - Category mapping (GS1-GS4, Essay, Prelims)

- **Quiz System**
  - Multiple quiz types (daily, weekly, mock tests)
  - Timer-based quizzes
  - Auto-grading
  - Performance tracking
  - Leaderboard support

- **Admin Dashboard**
  - User management
  - Content moderation
  - Analytics
  - Payment management
  - Article approval workflow

- **Database**
  - MongoDB with 12 collections
  - Optimized indexes
  - Data validation
  - Backup support

- **Deployment**
  - Vercel-ready
  - GitHub Actions CI/CD
  - Automated cron jobs
  - Environment configuration

### 🏗️ Architecture

```
Daily Tutors
├── Frontend (Next.js 15)
│   ├── Pages (app router)
│   ├── Components (ShadCN UI)
│   ├── Styling (Tailwind CSS)
│   └── State Management (React Hooks)
│
├── Backend (Next.js API Routes)
│   ├── Authentication
│   ├── Course Management
│   ├── Article Management
│   ├── Quiz System
│   ├── Payment Processing
│   └── Automation (Cron Jobs)
│
├── Database (MongoDB Atlas)
│   ├── Users
│   ├── Courses
│   ├── Articles
│   ├── Quizzes
│   ├── Payments
│   └── More...
│
├── AI/Automation
│   ├── News Fetching
│   ├── AI Processing (Groq)
│   ├── MCQ Generation
│   └── Content Enrichment
│
└── Infrastructure
    ├── Vercel (Hosting)
    ├── GitHub Actions (CI/CD)
    └── Environment Variables
```

## 📁 Project Structure

```
dailytutors/
├── src/
│   ├── app/                    # Next.js 15 app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── courses/       # Course management
│   │   │   ├── articles/      # Article management
│   │   │   ├── quizzes/       # Quiz system
│   │   │   ├── payments/      # Payment processing
│   │   │   └── cron/          # Automated jobs
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Student dashboard
│   │   ├── admin/             # Admin panel
│   │   ├── current-affairs/   # Articles listing
│   │   ├── courses/           # Courses
│   │   ├── daily-quiz/        # Daily quizzes
│   │   └── page.tsx           # Home page
│   │
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and helpers
│   │   ├── models/            # MongoDB schemas
│   │   ├── api-utils.ts       # API response helpers
│   │   ├── auth.ts            # Authentication logic
│   │   ├── ai.ts              # AI processing
│   │   ├── news.ts            # News fetching
│   │   ├── utils.ts           # Helper functions
│   │   ├── mongodb.ts         # DB connection
│   │   └── types.ts           # TypeScript types
│   │
│   └── middleware.ts          # Auth middleware
│
├── public/                    # Static files
├── data/                      # Sample data
├── scripts/                   # Utility scripts
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions
├── .env.local.example         # Environment template
├── vercel.json                # Vercel configuration
├── next.config.mjs            # Next.js config
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
└── package.json               # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (admin)
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course (admin)

### Articles
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article (admin)
- `GET /api/articles/[slug]` - Get article details
- `PUT /api/articles/[id]/moderate` - Moderate article (admin)

### Quizzes
- `GET /api/quizzes` - List quizzes
- `POST /api/quizzes` - Create quiz (admin)
- `POST /api/quizzes/[id]/submit` - Submit quiz attempt

### Payments
- `POST /api/payments/create-order` - Create order
- `POST /api/payments/verify` - Verify payment

### Automation
- `GET /api/cron/fetch-news` - Fetch & process news (hourly)
- `GET /api/cron/daily-affairs` - Daily current affairs (daily)
- `GET /api/cron/daily-quiz` - Daily quiz generation (daily)

See [ARCHITECTURE_AND_API_DOCS.md](./ARCHITECTURE_AND_API_DOCS.md) for detailed API documentation.

## 🗄️ Database Collections

1. **users** - User accounts and profiles
2. **courses** - Course information
3. **enrollments** - Student enrollments
4. **articles** - Current affairs articles
5. **quizzes** - Quiz definitions
6. **quizAttempts** - Quiz attempt records
7. **payments** - Payment transactions
8. **subscriptions** - Subscription plans
9. **magazines** - PDF magazines
10. **notes** - Student notes
11. **categories** - Article categories
12. **tags** - Content tags

See [ARCHITECTURE_AND_API_DOCS.md](./ARCHITECTURE_AND_API_DOCS.md) for complete schema details.

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ CSRF protection
- ✅ Input validation
- ✅ Rate limiting ready
- ✅ Secure environment variables
- ✅ HTTPS in production

## 🚀 Deployment

### Prerequisites
1. GitHub repository
2. Vercel Pro account
3. MongoDB Atlas cluster
4. Razorpay API keys
5. Google OAuth credentials
6. Groq API key

### One-Click Deployment

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to Vercel dashboard
# 3. Click "New Project"
# 4. Select GitHub repository
# 5. Add environment variables
# 6. Click "Deploy"
```

### Manual Deployment

See [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Performance Metrics

### Target Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Database Performance
- Article listing: < 200ms
- Course retrieval: < 150ms
- Quiz submission: < 500ms

## 💰 Cost Estimation

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Pro | $20/month | Hosting & deployment |
| MongoDB M10 | $57/month | Database |
| Razorpay | 2% per transaction | Payment processing |
| Groq API | Free | AI processing (30K req/day) |
| Total Base | ~$77/month | Varies with usage |

## 🔄 Automation Pipeline

### Hourly (Every Hour)
```
→ Fetch latest news from multiple sources
→ Clean and remove duplicates
→ Process with AI (Groq)
→ Generate MCQs and summaries
→ Map to GS papers
→ Save to database (pending review)
```

### Daily (7 AM IST)
```
→ Process approved articles
→ Generate current affairs digest
→ Prepare for publication
```

### Daily (8 AM IST)
```
→ Generate daily quizzes
→ Select MCQs from articles
→ Create quiz schedule
```

## 📚 Documentation

- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Deployment instructions
- [ARCHITECTURE_AND_API_DOCS.md](./ARCHITECTURE_AND_API_DOCS.md) - Complete architecture & API docs
- [.env.local.example](./.env.local.example) - Environment variables template

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library
- **Framer Motion** - Animations
- **React Hook Form** - Form management

### Backend
- **Next.js API Routes** - Serverless API
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database
- **Mongoose** - ODM

### AI/ML
- **Groq API** - LLM inference
- **OpenAI** - Alternative AI (optional)
- **Gemini** - Alternative AI (optional)

### Infrastructure
- **Vercel** - Hosting & deployment
- **MongoDB Atlas** - Cloud database
- **Razorpay** - Payment processing
- **GitHub Actions** - CI/CD
- **Cloudinary/AWS S3** - Media storage

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Groq Documentation](https://console.groq.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for reliable database
- Vercel for seamless deployment
- Groq for powerful AI inference
- All contributors and users

## 📞 Support

For questions and support:
1. Check [FAQ](./FAQ.md) (coming soon)
2. Read documentation
3. Open GitHub issues
4. Check error logs in Vercel

## 🗺️ Roadmap

### Q1 2024
- ✅ Complete backend API
- ✅ Payment integration
- ✅ AI automation
- [ ] Frontend UI (in progress)

### Q2 2024
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] Marketing website

### Q3 2024
- [ ] Machine learning features
- [ ] Personalized learning paths
- [ ] Video hosting
- [ ] Enterprise features

### Q4 2024
- [ ] Mobile apps (iOS/Android)
- [ ] Community features
- [ ] Advanced search
- [ ] Global expansion

## ⭐ Star Us

If you find this project useful, please star it on GitHub!

---

**Status**: 🚀 Production Ready  
**Last Updated**: 2024  
**Version**: 1.0.0  
**Maintainers**: Daily Tutors Team
