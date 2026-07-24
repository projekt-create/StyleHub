# 📁 File Structure

This document explains the purpose of every important folder and file used in the StyleHub project.

---

# Root

## public/

Stores static assets that are served directly by Next.js.

Examples:

- Images
- Icons
- Fonts
- Favicon

---

## src/

Contains all application source code.

---

# App Router

## src/app/

Contains all application pages, layouts, routing, and global styles.

### dashboard/

Dashboard pages.

### doc/

Documentation pages.

### login/

Authentication page.

### product/

Single product page.

### products/

Products listing page.

### profile/

User profile page.

### user/

Single user page.

### users/

Users listing page.

### globals.css

Global styles shared across the application.

### layout.js

Root layout.

Responsibilities:

- Global layout
- Metadata
- Providers
- Navigation wrapper

### page.js

Home page.

---

# Components

## src/components/

Reusable UI components.

### navbar/

Navigation bar.

### footer/

Website footer.

### lenis/

Smooth scrolling configuration using Lenis.

---

# Context

## src/context/

Global application state using React Context API.

### AuthContext.js

Handles:

- Login
- Logout
- Authentication state
- Current user

### GlobalContext.js

Stores global shared states across the application.

### ProductContext.js

Manages:

- Product list
- Product state
- Product actions

### UIContext.js

Controls UI state.

Examples:

- Theme
- Sidebar
- Modal
- Loading

### UserContext.js

Stores user-related information.

---

# Hooks

## src/hooks/

Reusable custom React hooks.

### useAuth.js

Authentication helper hook.

### useProduct.js

Returns a single product.

### useProducts.js

Returns all products.

### useUser.js

Returns current user.

### useUsers.js

Returns all users.

---

# Providers

## src/providers/

Application providers.

### GlobalProviders.jsx

Wraps all providers together.

Example:

- Theme Provider
- Auth Provider
- Context Providers

### QueryProviders.jsx

Configures TanStack Query.

Responsibilities:

- QueryClient
- QueryClientProvider
- Devtools

---

# Services

## src/service/

Contains all communication with backend APIs.

Business logic is separated from UI components.

### Api.js

Creates the main Axios instance.

Responsibilities:

- Base URL
- Headers
- Interceptors
- Common configuration

### AuthService.js

Authentication API.

Methods include:

- Login
- Register
- Logout
- Refresh Token

### ProductService.js

Product API.

Methods include:

- Get products
- Get product
- Create product
- Update product
- Delete product

### UserService.js

User API.

Methods include:

- Get profile
- Update profile
- Delete account

---

# Architecture

```
UI Components
      │
      ▼
Custom Hooks
      │
      ▼
Context / TanStack Query
      │
      ▼
Services
      │
      ▼
Axios (Api.js)
      │
      ▼
Backend API
```

---

# Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| app | Routing and Pages |
| components | Reusable UI Components |
| context | Global State Management |
| hooks | Custom React Hooks |
| providers | Application Providers |
| service | Backend Communication |
| public | Static Assets |

---

# Notes

- Components should never communicate directly with APIs.
- API requests should always go through the Service layer.
- Shared state should be managed using Context or TanStack Query.
- Reusable logic should be extracted into Custom Hooks.
- Every folder has a single responsibility to keep the project scalable and maintainable.