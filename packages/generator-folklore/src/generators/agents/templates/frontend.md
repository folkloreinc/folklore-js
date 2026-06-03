## Frontend (TypeScript / React / CSS)

### Tech stack
- React 19 (with React compiler)
- Typescript
- CSS Modules (PostCSS processing with nesting supported)
- React Query for network request
- React Intl (format-js) for i18n

### Architecture
- Use custom contexts for global access to data
- Create custom hooks when appropriate
- Use API class to handle data fetching and mutation

### Style and conventions
- Don't use memoisation `useCallback` and `useMemo` (project use react-compiler)
- Use pure function components with type hinted props. Make a separate interface for component props
- Extends props interface when composing components
- Organize global types in `.d.ts` files in the `types` folder
- Add className props for style composition and when needed add className props for inner elements
- Don't write string, use i18n components from react-intl
