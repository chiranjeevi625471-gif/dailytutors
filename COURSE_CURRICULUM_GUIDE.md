# Course Curriculum Management Guide

## Overview
The platform now supports adding course chapters, topics, hours, and preview videos to exam courses. Users can click an "EXPLORE" button to view the full curriculum before enrolling.

## Features Added

### 1. **Explore Button on Course Cards**
- Each course with chapters now displays an "EXPLORE" button alongside the "ENROLL NOW" button
- Clicking "EXPLORE" opens a modal showing:
  - Chapter titles
  - Hours per chapter
  - Topics covered in each chapter
  - Preview video links (if available)

### 2. **Curriculum Management in Admin Panel**
- New "Manage" button in the Exam Courses admin table
- Dedicated page to add, edit, and delete chapters
- Tracks total hours automatically

### 3. **Chapter Data Structure**
Each chapter contains:
- **Title**: Name of the chapter (e.g., "Physics Fundamentals")
- **Hours**: Duration in hours (e.g., 120)
- **Topics**: Learning topics covered (comma-separated, e.g., "Mechanics, Thermodynamics, Waves")
- **Preview Video URL**: Optional YouTube/video link for preview

---

## How to Use

### For Admins: Adding Chapters to a Course

1. **Navigate to Admin Panel**
   - Go to `/admin/exam-courses`
   
2. **Click "Manage" Button**
   - Find the course you want to add chapters to
   - Click the blue "Manage" button in the "Curriculum" column
   
3. **Add Chapters**
   - Fill in the chapter details:
     - **Chapter Title**: e.g., "Physics Fundamentals"
     - **Hours**: e.g., 120
     - **Topics**: e.g., "Mechanics, Thermodynamics, Oscillations, Waves"
     - **Preview Video URL** (optional): e.g., "https://youtu.be/abc123"
   
   - Click "Add Chapter"
   - Repeat for each chapter
   
4. **Save Curriculum**
   - Click "Save Curriculum" at the bottom
   - The course now has chapters that users can explore

### For Users: Exploring Course Curriculum

1. **Navigate to Exam Page**
   - Go to an exam page (e.g., `/exams/neet`)
   
2. **View Course Cards**
   - Each course with chapters shows both buttons:
     - Blue "EXPLORE" button: View curriculum
     - Red "ENROLL NOW" button: Enroll in course
   
3. **Explore Curriculum**
   - Click "EXPLORE" to see:
     - All chapters and their hours
     - Topics covered in each chapter
     - Preview video links (clickable to watch)
     - Total course hours
   
4. **Enroll**
   - Click "Enroll Now" button in the modal or on the course card

---

## Example: NEET Course Curriculum

**Course**: Arjuna NEET 2.0 2027 (500 total hours)

**Chapters**:
1. **Physics Fundamentals** - 120 hours
   - Topics: Mechanics, Thermodynamics, Oscillations, Waves
   - Preview: https://youtu.be/sample

2. **Chemistry Essentials** - 140 hours
   - Topics: Atomic Structure, Bonding, Organic Chemistry, Stoichiometry
   - Preview: https://youtu.be/sample

3. **Biology Complete** - 150 hours
   - Topics: Cell Structure, Genetics, Evolution, Human Anatomy
   - Preview: https://youtu.be/sample

4. **Mock Tests & Practice** - 90 hours
   - Topics: Full-length tests, Topic tests, Chapter quizzes, Time management
   - Preview: https://youtu.be/sample

---

## API Endpoints

### Get All Exam Courses (Admin)
```
GET /api/admin/exam-courses
```
Returns all exam courses with chapters (requires authentication).

### Get Specific Course
```
GET /api/exam-courses?exam=neet
```
Returns active courses for a specific exam (public).

### Update Course with Chapters
```
PUT /api/admin/exam-courses/{id}
Content-Type: application/json

{
  "id": "neet-arjuna-2.0-2027",
  "title": "Arjuna NEET 2.0 2027",
  ...other fields...,
  "chapters": [
    {
      "id": "ch1-phy",
      "title": "Physics Fundamentals",
      "hours": 120,
      "topics": ["Mechanics", "Thermodynamics", "Oscillations", "Waves"],
      "previewVideoUrl": "https://youtu.be/sample"
    }
  ],
  "totalHours": 500
}
```

---

## Best Practices

1. **Chapter Titles**: Use clear, descriptive titles (e.g., "Chapter 1: Motion and Forces")
2. **Hours**: Estimate realistic hours per chapter
3. **Topics**: List 3-5 main topics per chapter for clarity
4. **Video URLs**: Use YouTube or video hosting service links
5. **Order**: Add chapters in the order students will study them
6. **Total Hours**: System calculates this automatically

---

## Troubleshooting

### Explore button not showing?
- Make sure the course has at least one chapter added
- Save the curriculum after adding chapters
- Refresh the page to see updates

### Topics not displaying properly?
- Ensure topics are separated by commas
- The system will automatically trim whitespace
- Each topic should be under 50 characters

### Video preview not working?
- Check that the video URL is valid (YouTube, Vimeo, etc.)
- Ensure URL includes the full protocol (https://)
- Test the link in a browser first

---

## Frontend Components

### ExamCourses.tsx
- Displays course cards with explore and enroll buttons
- Shows curriculum modal when explore is clicked
- Displays chapter breakdown with topics and hours

### Curriculum Modal Features
- Sticky header with course title and total hours
- Chapter cards showing:
  - Chapter number and title
  - Hours spent on chapter
  - Topics covered (as tags)
  - Preview video link
- Sticky footer with close and enroll buttons

---

## Database Structure

**ExamCourse Type** now includes:
```typescript
type Chapter = {
  id: string;
  title: string;
  hours: number;
  topics: string[];
  previewVideoUrl?: string;
};

type ExamCourse = {
  // ...existing fields...
  chapters?: Chapter[];
  totalHours?: number;
};
```

---

## Future Enhancements

Possible additions:
- Reorder chapters by dragging
- Upload chapter PDFs or notes
- Attach quizzes to chapters
- Student progress tracking per chapter
- Chapter-wise instructor assignments
- Pricing tiers by chapter access
