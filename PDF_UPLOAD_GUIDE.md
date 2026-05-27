# Free PDF Downloads Admin Guide

## Overview
The Free PDF Downloads system allows admins to upload and manage PDF files that users can download from the `/downloads` page.

## How to Add a PDF

1. **Go to Admin Panel** → Click "Downloads" in the sidebar
2. **Click "Add new"** button
3. **Fill in the Details:**
   - **Title**: Name of the PDF (e.g., "Monthly CA Magazine April 2026")
   - **Description**: Brief description of what's in the PDF (e.g., "Comprehensive coverage of all major news stories relevant to UPSC exams")
   - **Type**: Choose from Magazine, Compilation, Notes, or PYQ
   - **Pages**: Number of pages in the PDF
   - **Date**: Publication date
   - **PDF File**: Upload the actual PDF file (max 100MB)
   - **Active**: Check this box to publish on site

4. **Upload PDF**: 
   - Click the file upload field
   - Select your PDF file from your computer
   - The system automatically calculates file size and generates a download URL
   - Wait for upload to complete (shows "Uploading..." indicator)

5. **Save**: Click the "Save" button

## Features

✅ **Auto File Size Calculation**: System automatically detects file size (in MB)  
✅ **Secure Storage**: PDFs stored in `/public/pdfs` folder  
✅ **Easy Management**: Search, edit, or delete any PDF  
✅ **Toggle Visibility**: Use Active checkbox to publish/unpublish  
✅ **Descriptions**: Add detailed descriptions for each PDF  
✅ **User Experience**: Users see file size, page count, date, and description

## File Management

- **Maximum file size**: 100MB per PDF
- **Supported format**: PDF only
- **Storage location**: `/public/pdfs/` (accessible to users)
- **Automatic naming**: Files are auto-renamed with unique IDs to prevent conflicts

## User View

Users visiting `/downloads` will see:
- 📄 PDF icon with type badge (Magazine/Compilation/Notes/PYQ)
- 📝 Title and description
- 📅 Publication date
- 📊 Page count and file size
- ⬇️ Download button (direct PDF download)

---
**Admin Panel Location**: `/admin/downloads`  
**User Page**: `/downloads`
