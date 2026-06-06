# Exam Courses Admin Panel Guide

## Overview
The exam courses system allows admins to manage and display courses on individual exam pages (NEET, CET, CA, School Boards). Users can explore different courses by exam type and enroll through the managed links.

## How It Works

### For Users
1. Navigate to any exam page (e.g., `/exams/neet`)
2. See all available courses for that exam displayed in a card grid
3. Each course shows:
   - Course image thumbnail
   - Badge (ONLINE/OFFLINE/etc)
   - Instructor name
   - Price with discount indicator
   - Key features preview
   - Duration and start date
   - "ENROLL NOW" or custom CTA button

### For Admins
1. Go to **Admin Panel → Exam Courses** (`/admin/exam-courses`)
2. View, add, edit, or delete exam courses
3. Control which courses appear on each exam page
4. Set prices, discounts, features, and course links

## Admin Panel Features

### Managing Courses

**View Courses**
- See all active and inactive courses
- Filter by exam type (NEET, CET, CA, School Boards)
- Sort by order number (determines display sequence)

**Create New Course**
- Click "+ New" button
- Fill in all required fields
- Upload course image (400x300px recommended)
- Click "Save"

**Edit Course**
- Click the pencil icon on any course
- Update fields as needed
- Click "Save"

**Delete Course**
- Click the trash icon on any course
- Confirm deletion

**Activate/Deactivate**
- Toggle the "Active" checkbox to show/hide courses on the site

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Course Title** | Full course name | "Arjuna NEET 2.0 2027" |
| **Exam** | Which exam this course is for | neet, cet, ca, school-boards |
| **Display Order** | Position on the page (1 = first) | 1, 2, 3 |
| **Course Image** | Thumbnail image | Upload PNG/JPG |
| **Badge Text** | Short label | "ONLINE", "OFFLINE" |
| **Badge Color** | Badge background color | Select from options |
| **Description** | One-line course summary | "Comprehensive NEET prep..." |
| **Price (₹)** | Current selling price | 4999 |
| **Features** | Key course features (comma-separated) | "500+ hours, Live classes, Mock tests" |
| **Button Text** | CTA button label | "ENROLL NOW" |
| **Course Link** | Where button leads to | "/courses/neet-arjuna" |

### Optional Fields

| Field | Description |
|-------|-------------|
| **Original Price** | Leave blank for no discount indicator |
| **Instructor Name** | Name of course instructor |
| **Start Date** | When course begins (display only) |
| **End Date** | When course ends (display only) |
| **Duration** | Course length e.g., "30 months" |

## Display Examples

### NEET Exam Page Courses
The NEET page (`/exams/neet`) displays up to 3 featured courses:
1. Arjuna NEET 2.0 2027 (₹4,999)
2. Arjuna NEET 2027 + Lakshya NEET 2028 (₹48,000)
3. Vidyapeeth 11 NEET (Target 2028) (₹5,000)

### Course Card Layout
```
+---+---+---+---+---+---+
| COURSE IMAGE            |  ← Upload here
+---+---+---+---+---+---+
| BADGE | DISCOUNT BADGE  |  ← e.g., "ONLINE", "39% off"
| Instructor Name        |
| Short description...   |
| ✓ Feature 1           |
| ✓ Feature 2           |
| +2 more features      |
| ⏱ 30 months           |
| ₹4,999 ₹5,500         |  ← Price and original price
| [ENROLL NOW BUTTON]   |
+---+---+---+---+---+---+
```

## API Endpoints

### Fetch Courses by Exam
```
GET /api/exam-courses?exam=neet
```
Returns active courses for the NEET exam.

### Fetch All Courses (Admin)
```
GET /api/admin/exam-courses
```
Returns all courses for admin management (requires auth).

## Common Tasks

### Add a New NEET Course
1. Go to `/admin/exam-courses`
2. Click "+ New"
3. Fill in:
   - Title: "New NEET Batch 2027"
   - Exam: "neet"
   - Order: "4" (after existing 3)
   - Upload image
   - Badge: "ONLINE"
   - Price: "3999"
   - Features: "600+ hours, Live sessions, Mock tests"
4. Click Save

### Change Course Display Order
1. Edit the course
2. Update "Display Order" field
3. Save
- **Order 1** = top/first on page
- **Order 2** = second
- **Order 3** = third, etc.

### Hide a Course Without Deleting
1. Edit the course
2. Uncheck "Active" checkbox
3. Save
(Course stays in database but won't show on website)

### Add Discount Pricing
1. Set **Price** to new discounted amount
2. Set **Original Price** to original amount
3. The badge automatically shows discount percentage
- Example: Price: 3999, Original Price: 5999 = 33% off badge

## Troubleshooting

### Course Not Appearing on Exam Page
- ✓ Check "Active" checkbox is enabled
- ✓ Verify "Exam" field matches exam slug (neet, cet, ca, school-boards)
- ✓ Clear browser cache or wait for page reload

### Image Not Showing
- ✓ Ensure image file is uploaded correctly
- ✓ Use PNG or JPG format
- ✓ Recommended size: 400×300 pixels or larger

### Price Not Showing Discount
- ✓ Set both "Price" and "Original Price"
- ✓ Original Price must be higher than Price
- ✓ System calculates and displays percentage automatically

### Features Not Displaying Correctly
- ✓ Use commas to separate features: "Feature 1, Feature 2, Feature 3"
- ✓ Features are limited to first 2 on card, rest show as "+N more features"

## Best Practices

✅ **DO:**
- Use consistent pricing (round numbers like 3999, 4999, etc.)
- Keep course titles to 50 characters max for mobile
- Use ONLINE/OFFLINE badges for clarity
- Set 1-3 courses per exam for clean layout
- Order by popularity or price tier
- Update course links to working pages
- Use descriptive feature names

❌ **DON'T:**
- Leave required fields empty
- Use very large images (will slow down page)
- Set Order numbers inconsistently (e.g., 1, 3, 7)
- Use HTML or special characters in fields
- Upload corrupted image files

## Support

For issues or questions about the admin panel:
1. Check troubleshooting section above
2. Verify all required fields are filled
3. Test in incognito/private browser window
4. Contact development team if issue persists
