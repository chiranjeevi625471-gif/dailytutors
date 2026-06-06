# Admin Panel - Course Management Guide

## Overview
The admin panel now includes complete course management with two new sections:
1. **Course Categories** - Manage exam types (NEET, CET, CA, etc.)
2. **Exam Courses** - Manage courses and their curriculum/chapters

---

## Part 1: Course Categories Management

### Access
**Admin Panel → Course Categories** (`/admin/course-categories`)

### What is a Course Category?
A category groups courses by exam type. Each category has:
- **Name**: Display name (e.g., "NEET Medical Entrance")
- **Slug**: URL identifier (e.g., "neet")
- **Icon**: Emoji representing the category
- **Color**: Background color for styling
- **Description**: Brief explanation of the category
- **Status**: Active/Inactive toggle

### Default Categories
The system comes with 4 pre-configured categories:

| Category | Icon | Slug | Courses |
|----------|------|------|---------|
| NEET | 🧬 | neet | 3 |
| CET | ⚙️ | cet | 1 |
| CA | 📊 | ca | 1 |
| School Boards | 📚 | school-boards | 0 |

### How to Add a New Category

1. **Click "Add Category" button** (top right)
2. **Fill in the form**:
   - **Name**: "UPSC CSE" 
   - **Slug**: "upsc" (lowercase, no spaces)
   - **Description**: "Civil services competitive exam"
   - **Icon**: Select from 8 emoji options
   - **Color**: Choose from 8 color options
3. **Click "Add Category"**

### How to Edit a Category

1. Click the **pencil icon** on any category card
2. Update the fields as needed
3. Click "Update Category"

### How to Delete a Category

1. Click the **trash icon** on any category card
2. Confirm deletion

### How to Activate/Deactivate

- Click the **"Active" / "Inactive" button** on a category card
- Inactive categories are shown with reduced opacity
- Users won't see courses in inactive categories on the frontend

---

## Part 2: Exam Courses Management

### Access
**Admin Panel → Exam Courses** (`/admin/exam-courses`)

### What is an Exam Course?
Exam courses are specific offerings for each category. Each course has:
- **Title**: Course name
- **Exam Type**: Which category it belongs to
- **Price & Discount**: Pricing information
- **Duration**: Course length
- **Instructor**: Name of instructor
- **Features**: Key course highlights
- **Chapters**: Curriculum breakdown with topics and hours

### Course Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Full course name | "Arjuna NEET 2.0 2027" |
| **Exam Type** | Category (neet, cet, ca, etc.) | neet |
| **Display Order** | Position on page (1 = first) | 1, 2, 3... |
| **Badge** | Short label | "ONLINE", "OFFLINE" |
| **Badge Color** | Background color for badge | "bg-purple-600" |
| **Instructor** | Course instructor name | "Arjun Singh" |
| **Description** | One-line summary | "Comprehensive NEET prep..." |
| **Price** | Current price in ₹ | 4999 |
| **Original Price** | Original price (for discount) | 5500 |
| **Start Date** | Course start date | "01 Jan 2026" |
| **End Date** | Course end date | "30 Jun 2028" |
| **Duration** | Course length | "30 months" |
| **Features** | Key features (comma-separated) | "500+ hours, Live classes, Mock tests" |
| **Button Text** | CTA button label | "ENROLL NOW" or "EXPLORE" |
| **Course Link** | Enrollment URL | "/courses/neet-arjuna-2027" |
| **Status** | Active on site? | Yes/No |

### How to Add a New Course

1. **Click "+ New" button** in the Exam Courses table
2. **Fill in all required fields** (marked with *)
3. **Upload course image** (400x300px recommended)
4. **Click "Save"**
5. **Add Curriculum** (optional):
   - Click "Manage" button on the newly created course
   - Add chapters with topics and hours
   - Students can then click "EXPLORE" to see curriculum

### How to Edit a Course

1. **Click the pencil icon** on any course in the table
2. **Update fields** as needed
3. **Click "Save"**

### How to Manage Course Curriculum

1. **Find the course** in the Exam Courses table
2. **Click "Manage" button** in the Curriculum column
3. **Add Chapters**:
   - **Chapter Title**: e.g., "Physics Fundamentals"
   - **Hours**: e.g., 120
   - **Topics**: e.g., "Mechanics, Thermodynamics, Waves"
   - **Preview Video** (optional): YouTube link
4. **Click "Add Chapter"** for each chapter
5. **Click "Save Curriculum"** to finalize

### Example: NEET Arjuna Course

**Basic Details**:
- Title: "Arjuna NEET 2.0 2027"
- Exam: neet
- Price: ₹4,999
- Duration: 30 months

**Chapters** (500 total hours):
1. Physics Fundamentals (120 hrs)
   - Topics: Mechanics, Thermodynamics, Oscillations, Waves
   - Preview: https://youtu.be/...

2. Chemistry Essentials (140 hrs)
   - Topics: Atomic Structure, Bonding, Organic Chemistry, Stoichiometry
   - Preview: https://youtu.be/...

3. Biology Complete (150 hrs)
   - Topics: Cell Structure, Genetics, Evolution, Human Anatomy
   - Preview: https://youtu.be/...

4. Mock Tests & Practice (90 hrs)
   - Topics: Full-length tests, Topic tests, Chapter quizzes
   - Preview: https://youtu.be/...

---

## Part 3: Frontend Features

### What Students See

#### Course Cards (with EXPLORE button)
When a course has chapters, students see:
- **EXPLORE button** (blue) - Click to view curriculum
- **ENROLL NOW button** (red) - Click to enroll

#### Curriculum Modal
When students click "EXPLORE":
- All chapters listed with hours
- Topics as clickable tags
- Preview video links (clickable)
- Total course hours at top
- "Close" and "Enroll Now" buttons at bottom

---

## Best Practices

### Course Categories
1. **Use clear names**: "NEET Medical Entrance" not just "NEET"
2. **Unique slugs**: No spaces, lowercase only
3. **Consistent icons**: One per category
4. **Keep active**: Only active categories appear to users

### Exam Courses
1. **Clear titles**: Include year/version if needed
2. **Realistic prices**: Set discounts appropriately
3. **Complete features**: List 5-7 key features
4. **Accurate hours**: Calculate total hours from chapters
5. **Chapter organization**: Order by difficulty/progression
6. **Preview videos**: Provide real YouTube/Vimeo links
7. **Course links**: Use consistent URL structure

### Chapters
1. **Logical order**: Arrange chapters by difficulty
2. **Equal distribution**: Balance hours across chapters
3. **Specific topics**: Be clear about what's covered
4. **Quality previews**: Link to real preview videos
5. **Topic count**: 3-5 topics per chapter for clarity

---

## Troubleshooting

### EXPLORE button not showing?
- ✅ Course must have at least one chapter added
- ✅ Save the curriculum after adding chapters
- ✅ Refresh the page to see updates

### Courses not appearing on exam page?
- ✅ Course must be "Active" (toggle in admin)
- ✅ Course examSlug must match exam page slug
- ✅ Check display order (lower = appears first)

### Image not uploading?
- ✅ Max file size: 5MB
- ✅ Supported formats: PNG, JPG, WebP
- ✅ Recommended size: 400x300 pixels

### Price not showing discount?
- ✅ Original Price must be higher than Price
- ✅ Both must be numbers (no currency symbol)
- ✅ Refresh to see calculated discount percentage

---

## Database Structure

### CategoryType
```typescript
{
  id: string;
  name: string;
  slug: string;
  icon: string;          // emoji
  color: string;         // Tailwind class
  accentColor: string;   // gradient
  description: string;
  totalCourses: number;
  active: boolean;
}
```

### ExamCourse
```typescript
{
  id: string;
  examSlug: string;
  title: string;
  image: string;
  badge: string;
  badgeColor: string;
  instructor: string;
  price: number;
  originalPrice: number;
  startDate: string;
  endDate: string;
  duration: string;
  features: string[];
  description: string;
  cta: string;
  link: string;
  chapters?: Chapter[];
  totalHours?: number;
  active: boolean;
}
```

### Chapter
```typescript
{
  id: string;
  title: string;
  hours: number;
  topics: string[];
  previewVideoUrl?: string;
}
```

---

## API Endpoints

### Get Categories
```
GET /api/admin/exam-courses (returns courses with chapters)
GET /api/exam-courses?exam=neet (public, active courses only)
```

### Create/Update Categories
```
POST /api/admin/[entity]
PUT /api/admin/[entity]/[id]
DELETE /api/admin/[entity]/[id]
```

---

## Future Enhancements

Possible additions:
- Reorder chapters by drag-and-drop
- Attach quizzes to chapters
- Student progress tracking per chapter
- Chapter-wise resource attachments
- Pricing tiers by chapter access
- Instructor ratings per chapter
- Bulk import courses from CSV
- Course templates/duplicates
