# Daily Tutors - Complete Architecture & API Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│                    TypeScript + Tailwind CSS                 │
│                      ShadCN UI Components                    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  API Layer (Next.js Routes)                 │
│  ├─ Authentication (/api/auth/*)                            │
│  ├─ Courses (/api/courses/*)                                │
│  ├─ Articles (/api/articles/*)                              │
│  ├─ Quizzes (/api/quizzes/*)                                │
│  ├─ Payments (/api/payments/*)                              │
│  └─ Automation (/api/cron/*)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐  ┌────▼─────┐  ┌──▼──────────┐
│  MongoDB   │  │   AI     │  │  External   │
│   Atlas    │  │ (Groq)   │  │   APIs      │
└────────────┘  └──────────┘  └─────────────┘
```

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique),
  name: string,
  password: string (hashed),
  role: 'student' | 'admin' | 'moderator',
  image: string,
  phone: string,
  enrolledCourses: [{
    courseId: ObjectId,
    enrolledAt: Date,
    progress: number,
    status: 'active' | 'completed' | 'paused'
  }],
  subscription: {
    type: 'free' | 'monthly' | 'quarterly' | 'yearly',
    startDate: Date,
    endDate: Date,
    active: boolean
  },
  stats: {
    quizzesTaken: number,
    totalScore: number,
    averageScore: number,
    articlesRead: number,
    lastActive: Date
  },
  verified: boolean,
  status: 'active' | 'inactive' | 'suspended',
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique),
  description: string,
  shortDescription: string,
  image: string,
  category: 'prelims' | 'mains' | 'optional' | 'editorials' | 'current-affairs',
  price: number,
  originalPrice: number,
  isPaid: boolean,
  isActive: boolean,
  level: 'beginner' | 'intermediate' | 'advanced',
  duration: {
    value: number,
    unit: 'weeks' | 'months'
  },
  modules: [{
    id: ObjectId,
    title: string,
    lessons: [{
      id: ObjectId,
      title: string,
      type: 'video' | 'pdf' | 'quiz' | 'reading',
      content: string,
      duration: number
    }]
  }],
  learningOutcomes: [string],
  enrolledStudents: number,
  rating: {
    average: number,
    count: number
  },
  tags: [string],
  status: 'draft' | 'published' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

### Articles Collection
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string (unique),
  source: string,
  originalUrl: string,
  summary: string,
  content: string,
  image: string,
  category: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' | 'Prelims',
  subcategories: [string],
  keyPoints: [string],
  prelimsFacts: [string],
  mainsAnalysis: string,
  constitutionalLinks: [string],
  keywords: [string],
  wayForward: string,
  relatedTopics: [string],
  mcqs: [{
    question: string,
    options: [string],
    correctAnswer: number,
    explanation: string,
    difficulty: 'easy' | 'medium' | 'hard'
  }],
  pyqs: [{
    year: number,
    question: string,
    answerKey: string
  }],
  aiGenerated: boolean,
  aiModel: 'groq' | 'openai' | 'gemini',
  status: 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected',
  moderatedBy: ObjectId,
  publishedAt: Date,
  viewCount: number,
  likes: number,
  shares: number,
  pdfUrl: string,
  magazine: ObjectId,
  tags: [string],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
```javascript
// Full-text search
db.articles.createIndex({ title: 'text', summary: 'text', keywords: 'text' })

// Category and status filtering
db.articles.createIndex({ category: 1, status: 1, publishedAt: -1 })

// User queries
db.users.createIndex({ email: 1 })

// Quiz leaderboards
db.quizAttempts.createIndex({ quizId: 1, score: -1 })
```

## API Endpoints

### Authentication APIs

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "secure_password"
}

Response: 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "student"
    }
  }
}
```

### Course APIs

#### Get Courses
```
GET /api/courses?category=prelims&page=1&limit=12
Content-Type: application/json

Response: 200
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": {
    "courses": [
      {
        "_id": "course_id",
        "title": "UPSC Prelims GS Paper 1",
        "slug": "upsc-prelims-gs-1",
        "category": "prelims",
        "price": 4999,
        "isPaid": true
      }
    ],
    "pagination": {
      "total": 25,
      "pages": 3,
      "currentPage": 1
    }
  }
}
```

#### Create Course (Admin)
```
POST /api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

Request:
{
  "title": "UPSC Prelims GS Paper 1",
  "slug": "upsc-prelims-gs-1",
  "description": "Complete preparation for UPSC Prelims GS Paper 1",
  "shortDescription": "GS Paper 1 comprehensive course",
  "category": "prelims",
  "price": 4999,
  "level": "intermediate",
  "learningOutcomes": ["Learn GS Paper 1 topics", "Practice MCQs"]
}

Response: 201
{
  "success": true,
  "message": "Course created successfully",
  "data": { ... }
}
```

### Article APIs

#### Get Articles
```
GET /api/articles?category=GS1&page=1&limit=12&search=economy
Content-Type: application/json

Response: 200
{
  "success": true,
  "message": "Articles fetched successfully",
  "data": {
    "articles": [
      {
        "_id": "article_id",
        "title": "Current economic policy...",
        "slug": "current-economic-policy",
        "category": "GS2",
        "summary": "Brief summary...",
        "publishedAt": "2024-01-15T10:30:00Z",
        "viewCount": 1524
      }
    ],
    "pagination": { ... }
  }
}
```

#### Create Article (Auto-generated or Admin)
```
POST /api/articles
Authorization: Bearer <admin_token>
Content-Type: application/json

Request:
{
  "title": "Indian Economic Policy Update",
  "slug": "indian-economic-policy",
  "source": "the-hindu",
  "content": "Full article content...",
  "category": "GS2"
}

Response: 201
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "_id": "article_id",
    "title": "Indian Economic Policy Update",
    "summary": "AI-generated summary",
    "keywords": ["economy", "policy", "india"],
    "mcqs": [ ... ],
    "status": "pending-review"
  }
}
```

### Quiz APIs

#### Get Quizzes
```
GET /api/quizzes?category=daily-quiz&page=1&limit=10
Content-Type: application/json

Response: 200
{
  "success": true,
  "message": "Quizzes fetched successfully",
  "data": {
    "quizzes": [
      {
        "_id": "quiz_id",
        "title": "Daily Quiz - 15 Jan 2024",
        "totalQuestions": 10,
        "duration": 15,
        "type": "prelims"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Submit Quiz Attempt
```
POST /api/quizzes/[quiz_id]/submit
Authorization: Bearer <user_token>
Content-Type: application/json

Request:
{
  "answers": [
    { "questionId": "q1", "selectedOption": 0 },
    { "questionId": "q2", "selectedOption": 2 }
  ],
  "timeTaken": 900
}

Response: 200
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "attemptId": "attempt_id",
    "score": 75,
    "percentage": 75,
    "isPassed": true,
    "correctAnswers": 7,
    "wrongAnswers": 3,
    "rank": 42
  }
}
```

### Payment APIs

#### Create Razorpay Order
```
POST /api/payments/create-order
Authorization: Bearer <user_token>
Content-Type: application/json

Request:
{
  "courseId": "course_id",
  "userId": "user_id",
  "email": "user@example.com",
  "phone": "+91XXXXXXXXXX",
  "amount": 4999
}

Response: 200
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_id",
    "amount": 499900,
    "currency": "INR",
    "keyId": "rzp_live_xxxxx",
    "paymentId": "payment_record_id"
  }
}
```

#### Verify Payment
```
POST /api/payments/verify
Content-Type: application/json

Request:
{
  "orderId": "order_id",
  "paymentId": "razorpay_payment_id",
  "signature": "signature_hash"
}

Response: 200
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "payment_record_id",
    "status": "completed"
  }
}
```

### Automation APIs

#### Fetch & Process News (Cron)
```
GET /api/cron/fetch-news
Authorization: Bearer <cron_secret>

Response: 200
{
  "success": true,
  "message": "Cron job completed successfully",
  "results": {
    "fetchedArticles": 45,
    "processedArticles": 38,
    "errors": 7
  }
}
```

## AI Processing Pipeline

### News Fetching
```
1. Fetch from RSS feeds (The Hindu, Indian Express, PIB)
2. Fetch from News APIs (if available)
3. Remove duplicates by title
4. Filter irrelevant articles
```

### AI Processing (Groq)
```
For each article:
1. Clean HTML content
2. Send to Groq AI with custom prompt
3. Extract:
   - Summary (2-3 lines)
   - Keywords (10 important terms)
   - Prelims Facts (5-10 key points)
   - Mains Analysis (detailed explanation)
   - GS Paper Mapping (which GS paper covers it)
   - MCQs (5 questions with options)
   - Related Topics
   - Constitutional Links
   - Way Forward
4. Save to MongoDB with "pending-review" status
5. Admin reviews and publishes
```

### Cron Job Schedule
```
/api/cron/fetch-news     → Every 1 hour
/api/cron/daily-affairs  → Every day at 7 AM (IST)
/api/cron/daily-quiz     → Every day at 8 AM (IST)
```

## Authentication Flow

```
1. User Registration
   → POST /api/auth/register
   → Hash password with bcryptjs
   → Save to MongoDB
   → Return success message

2. User Login
   → POST /api/auth/login
   → Validate credentials
   → Generate JWT token
   → Return token and user data
   → Store token in localStorage (client-side)

3. Protected Routes
   → Include Authorization header: "Bearer <token>"
   → Verify JWT on server
   → Return error if invalid
   → Process request if valid

4. Google OAuth
   → Redirect to Google login
   → Callback to /api/auth/callback/google
   → Create user if doesn't exist
   → Return session
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

## Rate Limiting

Recommended rate limits:
- Authentication endpoints: 10 requests/minute
- Course/Article listing: 100 requests/minute
- Quiz submission: 1 request per quiz
- Payment endpoints: 5 requests/minute

## Security Best Practices

1. **Password Security**
   - Minimum 6 characters
   - Hashed with bcryptjs (cost = 10)
   - Never stored in plain text

2. **Token Security**
   - JWT expires in 7 days
   - Refresh token expires in 30 days
   - Store in httpOnly cookies (server-side)

3. **API Security**
   - Validate all inputs
   - Sanitize user inputs
   - Check authorization on protected routes
   - Use HTTPS only in production

4. **Database Security**
   - Use strong credentials
   - Enable encryption at rest
   - Regular backups
   - No sensitive data in logs

## Performance Metrics

### Target Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Database Query Performance
- Article listing: < 200ms
- Course retrieval: < 150ms
- Quiz submission: < 500ms

## Monitoring & Logging

### Key Metrics to Monitor
- API response times
- Database query performance
- Error rates
- User engagement
- Payment success rate
- AI processing success rate

### Logging Strategy
```typescript
// Error logging
console.error('Error:', error.message);

// Info logging
console.log('✅ Article processed:', articleId);

// Warning logging
console.warn('⚠️ AI processing failed:', articleTitle);
```

## Scalability Roadmap

### Phase 1 (Current)
- Single Vercel deployment
- MongoDB Atlas M10
- ~1000 concurrent users

### Phase 2 (Growth)
- Vercel Edge Network
- MongoDB Atlas M20
- Caching layer (Redis)
- ~10,000 concurrent users

### Phase 3 (Scale)
- Multiple region deployment
- MongoDB sharding
- CDN for static assets
- ~100,000+ concurrent users

---

**Last Updated**: 2024
**API Version**: 1.0
**Status**: Production Ready ✅
