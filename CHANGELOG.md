# Changelog

## 2025-10-14

### Added
- **Auth & RBAC (UI):**
  - Implemented login functionality with API integration.
  - Set up protected routes and role-based menu rendering.
  - Implemented logout functionality.
- **Dashboard:**
  - Dynamic display of post summaries (draft, published, scheduled).
  - Display of recent posts.
  - Buttons for generating Sitemap and RSS feeds with API integration.
- **Post Management:**
  - Post listing page with filtering and search.
  - Post editor for creating and editing posts.
  - Rich Text Editor integration for post content.
  - Client-side validation using Zod.
  - Autosave functionality for post editor.
  - Content sanitization using DOMPurify for preview.
- **Media Management:**
  - Media manager page with media listing and search.
  - Drag-and-drop media uploader with pre-signed URL support and progress tracking.
  - Media deletion functionality.
- **Taxonomy Management:**
  - CRUD operations for Categories (create, read, update, delete).
  - CRUD operations for Tags (create, read, update, delete).
  - Tabbed interface for Categories and Tags.
- **User Management:**
  - User listing page.
  - Functionality to change user roles.
- **API Client:**
  - Centralized API client (`api-client.ts`) for consistent API interactions.

### Fixed
- Resolved multiple ESLint errors and warnings, including:
  - `Parsing error: Unterminated regular expression literal` in `PostEditor.tsx`.
  - `Parsing error: JSX expressions must have one parent element` in `DashboardPage.tsx`.
  - `Unexpected any` type errors across various files.
  - Unused imports and variables.
  - `React Hook useCallback` missing dependencies.
