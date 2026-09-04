# Contributing to LaunchPad Web

Thank you for considering contributing to LaunchPad Web. This document outlines the rules and guidelines to keep the ship kit consistent.

## Cursor/Windsurf Rules

### Code Organization

1. **Consistent File Structure**

   - All components must be in `src/components/` categorized by function
   - All pages must be in the `src/app/` directory following Next.js App Router conventions
   - Server-only code in `src/server/` directory
   - Utilities in `src/lib/` directory
   - React hooks in `src/hooks/` directory

2. **Naming Conventions**

   - Components: PascalCase (e.g., `UserProfile.tsx`)
   - Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
   - Utilities: camelCase (e.g., `formatDate.ts`)
   - Page files: `page.tsx` inside appropriate route folders
   - Layout files: `layout.tsx` in appropriate folders

3. **Import Order**
   - React and Next.js imports first
   - Third-party libraries second
   - Internal components and utilities third
   - Types and interfaces fourth
   - CSS/SCSS imports last

### Coding Standards

1. **TypeScript Typing**

   - Always use proper TypeScript types
   - Avoid `any` type wherever possible
   - Use Zod for runtime validation
   - Create interfaces/types in component files unless shared

2. **Component Structure**

   - Use TypeScript functional components
   - Define prop interfaces above components
   - Use destructuring for props
   - Export components as default when the file contains one main component

3. **CSS/Styling**

   - Use Tailwind CSS classes primarily
   - Create utility classes for repeated patterns
   - Follow mobile-first approach
   - Use CSS variables for theming

4. **State Management**
   - Use React hooks for local state
   - SWR or React Query for server state
   - Context API for global state when needed
   - Keep state as local as possible

### Git Workflow

1. **Branching Strategy**

   - `main` - production-ready code
   - `develop` - integration branch for features
   - `feature/feature-name` - for new features
   - `fix/bug-description` - for bug fixes
   - `refactor/description` - for code refactoring

2. **Commit Messages**

   - Follow conventional commits format
   - Structure: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Example: `feat(auth): add Google social login`

3. **Pull Requests**
   - Create PR against `develop` branch
   - Use PR template
   - Require at least one reviewer
   - Include tests when applicable
   - Ensure all checks pass before merging

### Testing Guidelines

1. **Test Coverage**

   - Write tests for new features and bug fixes
   - Test components with React Testing Library
   - Test utilities with Jest
   - Aim for 80%+ coverage

2. **Testing Structure**
   - Place test files alongside the files they test with `.test.ts` or `.test.tsx` extension
   - Use descriptive test names following the pattern: `it('should do something when something happens')`

### Documentation

1. **Code Documentation**

   - Document complex functions with JSDoc
   - Add comments for non-obvious code sections
   - Keep README and other docs up to date

2. **Component Documentation**
   - Document props using TypeScript interfaces
   - Add usage examples for reusable components

### Performance Considerations

1. **Bundle Size**

   - Avoid large dependencies
   - Use dynamic imports for code splitting
   - Monitor bundle size changes

2. **Rendering Optimization**
   - Use memoization for expensive calculations
   - Implement virtualization for long lists
   - Optimize images and assets

### Accessibility

1. **A11y Standards**

   - Ensure WCAG 2.1 AA compliance
   - Proper heading structure
   - Keyboard navigation support
   - Appropriate ARIA attributes

2. **Inclusive Design**
   - Support high contrast mode
   - Ensure sufficient color contrast
   - Support screen readers
   - Add alt text to all images

## Getting Started with Development

1. **Setup**

   ```bash
   git clone https://github.com/memins/launchpad-web.git
   cd launchpad-web
   npm install
   cp .env.example .env.local
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Run Tests**

   ```bash
   npm run test
   ```

4. **Lint Code**

   ```bash
   npm run lint
   ```

5. **Format Code**
   ```bash
   npm run format
   ```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if needed
3. The PR may be merged once you have the sign-off of at least one reviewer
4. Ensure all checks are passing before merging

Thank you for helping make LaunchPad Web better.
