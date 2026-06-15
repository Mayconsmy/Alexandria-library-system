# Changelog

## [1.0.0] - 2026-06-15

### Features

- **Dashboard**: Redesigned with hero stats, reading progress, goals, and recent reviews section
- **Biblioteca**: Modern book grid with cover placeholders, genre chips, and enhanced filters
- **Leituras**: New dedicated reading management page with status grouping and progress tracking
- **Resenhas**: New dedicated reviews page with user reviews, filters, and hero stats
- **Grupos**: Enhanced group cards with member avatars and improved detail page with messaging
- **Perfil**: Redesigned profile with avatar builder, reading stats, goals, and review gallery
- **Metas**: Goal management with progress bars and active/completed views
- **Review editing and deletion**: Inline edit/delete on own reviews across all pages
- **Avatar system**: Customizable avatar builder with multiple colors, accessories, and styles
- **Dark mode persistence**: Theme persisted via localStorage across all pages with flash prevention

### Visual Improvements

- Glass-morphism design system applied to cards, modals, and navigation
- Consistent CSS variables architecture with light/dark theme support
- Smooth animations and transitions throughout the interface
- Responsive layout for devices up to 720px
- Enhanced navigation bar with theme toggle and mobile support
- Toast notification system with success/error/warning variants
- Custom scrollbar styling
- Gradient heroes and enhanced visual hierarchy

### Bug Fixes

- Fixed dark mode text colors (hardcoded `#fff`/`#000` replaced with CSS variables)
- Fixed review rating calculation not updating statistics after create/update/delete
- Fixed avatar not appearing in review cards
- Fixed CSS star rating icons disappearing due to hardcoded colors
- Fixed textarea white text in light mode
- Fixed profile name invisible on dark gradient banner
- Fixed "Failed to fetch" due to CSP issues and http.js header override bug
- Fixed theme not persisting across pages (inline script in `<head>`)
- Fixed review edit validation error (missing `idLivro` in PUT payload)
- Fixed UTF-8 encoding issues in text rendering
- Fixed CORS configuration for development environment
- Fixed login error handling and authentication flow
- Fixed goals synchronization with reading progress

### Structural Changes

- Extracted shared CSS variables into dedicated `variables.css`
- Created component-based CSS architecture (navbar, modal, toast, form, avatar)
- Removed dead CSS classes and unused variables
- Empty `card.css` removed from all page includes
- Removed legacy `api.js` in favor of modular API functions
- Added proper error handling with `GlobalExceptionHandler`
- Enhanced DTOs with validation annotations
- Added Flyway migration for database schema enhancements

### Technical Details

- Backend: Spring Boot with `@Valid` DTO validation, service layer, and repository pattern
- Frontend: Vanilla JS with ES6+ features, modular file organization
- Database: MySQL with Flyway migrations
- Authentication: JWT-based with token persistence in localStorage
