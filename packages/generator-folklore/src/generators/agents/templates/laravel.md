## Backend (PHP / Laravel)

### Architecture
- Use **Entity** defined in `app/Contracts/Entities` and `app/Entities` instead of using directly Models. Entity wraps models and provide a typehinted interface to interact with data
- Use typed entities when representing an entity with variations (ex: Page entity might have HomePage, ContactPage)
- Use **Repository** defined in `app/Contracts/Repositories` and `app/Repositories` instead of querying models directly

### Style and conventions
- Use Contracts and dependency injection
- Typehint methods and properties
- Use `once` in class to prevent recreation of objects
- Treat Entity as immutable
- Create class property in constructor when needed
