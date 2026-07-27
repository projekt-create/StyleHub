# 📊 Dashboard

## Goal

Create an administrator dashboard for monitoring the store and accessing the main management sections.

## Route

- `/`
- `/dashboard`

Both routes render the dashboard content.

## Features

### Dashboard Layout

- Responsive dashboard layout
- Sidebar navigation
- StyleHub branding
- Light and dark theme toggle

### Statistics

The dashboard displays:

- Total products
- Active products
- Low-stock products
- Total inventory value

### Products

- Fetches products from the API
- Displays the latest products in a card grid
- Shows product image, category, price, rating, and stock
- Provides a link to each product details page
- Supports pagination

### UI States

- Loading state while products are being fetched
- Error state when the API request fails
- Empty state when no products are available

### Sidebar

- Dashboard navigation
- Products navigation
- Users navigation
- Profile navigation
- Documentation navigation
- Theme switching
- Logout button

When the `Chiqish` button is clicked:

- The logout API request is sent
- Access and refresh tokens are removed
- The stored user is removed from `localStorage`
- The authentication state is cleared
- The user is redirected to `/login`

## Main Files

- `src/app/page.jsx` — Home dashboard route
- `src/app/dashboard/page.jsx` — Dashboard route
- `src/components/dashboard/DashboardContent.jsx` — Dashboard content and product data
- `src/components/saiidbar/SaidBar.jsx` — Sidebar navigation and logout
- `src/components/saiidbar/sidebar.css` — Dashboard and sidebar styles

## Status

✅ Completed
