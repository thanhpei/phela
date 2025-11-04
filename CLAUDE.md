# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PheLa Web is a full-stack e-commerce application for tea products with dual interfaces: customer-facing website and admin management dashboard. The project consists of a React frontend with separate admin/customer builds and a Spring Boot backend API.

**CRITICAL: This is a Vietnamese language application.** All UI text, error messages, notifications, and user-facing content must be in Vietnamese.

## Architecture

### Frontend (fe_phela/)
- **Framework**: React 19 with React Router v7
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Key Libraries**: Axios, Chart.js, Leaflet maps, React Icons, React Toastify, STOMP WebSocket client
- **Dual Mode Architecture**: Separate builds for admin (`admin` mode) and customer (`customer` mode)

### Backend (be_phela/)
- **Framework**: Spring Boot 3.4.3 with Java 22
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL with JPA/Hibernate
- **Key Features**: RESTful APIs, WebSocket chat, file uploads (Cloudinary), email service, VNPay payment integration
- **Architecture**: Layered architecture with Controllers, Services, Repositories, DTOs, and MapStruct mappers

## Development Commands

### Frontend Development
```bash
# Run customer interface (port 3001)
npm run dev:customer

# Run admin interface (port 3000) 
npm run dev:admin

# Build production
npm run build:customer
npm run build:admin

# Type checking
npm run typecheck
```

### Backend Development
```bash
# Run Spring Boot application (from be_phela/)
./mvnw spring-boot:run

# Run tests
./mvnw test

# Clean and compile
./mvnw clean compile

# Package application
./mvnw package
```

### Database Setup
```bash
# Start MySQL with Docker (from be_phela/src/main/java/)
docker-compose up -d mysqldb

# Or run full stack with Docker
docker-compose up
```

## Key Configuration

### Environment Setup
- Backend runs on port 8080
- Customer frontend runs on port 3001 (dev)
- Admin frontend runs on port 3000 (dev)
- MySQL database on port 3306
- Database name: `phela` (dev) / `phela_db` (docker)

### Frontend Mode Configuration
The frontend uses Vite's mode feature to build separate applications:
- `VITE_ROLE=admin` for admin interface
- `VITE_ROLE=customer` for customer interface

### Authentication Architecture
- **JWT-based authentication** with separate user types (admin/customer)
- **Token storage**: JWT stored in localStorage, attached via axios interceptor
- **Role extraction**: Backend extracts role from UserDetails, strips `ROLE_` prefix for JWT claim, JWT filter adds it back
- **Structured API responses**: Auth endpoints return `ApiResponse<AuthenticationResponse>` wrapper with `{success, status, message, data, timestamp}`
- **Profile endpoints**: `/api/customer/{username}` and `/api/admin/{username}` return DTOs directly (NOT wrapped)
- **Password reset**: OTP via email with token-based verification
- **Account activation**: Email verification required before login (`status == ACTIVE`)

### CORS Configuration
- Backend: `allowedOrigins` set to `http://localhost:3000` and `http://localhost:3001`
- Frontend: All axios instances must have `withCredentials: true`
- **IMPORTANT**: Wildcard `*` origin NOT compatible with credentials
- OPTIONS preflight requests explicitly permitted in SecurityConfig

## Core Business Domains

### E-commerce Features
- Product catalog with categories
- Shopping cart and order management
- Payment integration (VNPay)
- Inventory and branch management
- Promotions and discount codes

### Admin Management
- Dashboard with analytics
- Product, category, and inventory management
- Order processing and reporting
- News/banner content management
- Staff and branch management
- Customer support chat

### Additional Features  
- Job posting and recruitment system
- Real-time chat support (WebSocket)
- File upload handling (CV, product images)
- Email notifications
- Location-based services with distance calculation

## Important File Locations

### Configuration Files
- `fe_phela/vite.config.ts` - Vite configuration
- `be_phela/src/main/resources/application.properties` - Spring Boot config
- `be_phela/pom.xml` - Maven dependencies
- `fe_phela/package.json` - NPM dependencies

### Key Source Files
- `fe_phela/app/root.tsx` - Root React component with auth routing + global ToastContainer
- `fe_phela/app/AuthContext.tsx` - Authentication context provider
- `fe_phela/app/config/axios.ts` - Axios instance with JWT interceptor
- `fe_phela/app/utils/notificationConfig.tsx` - Unified notification system
- `fe_phela/app/utils/exportUtils.ts` - Report export utilities (Excel/Word/Print)
- `be_phela/src/main/java/com/example/be_phela/BePhelaApplication.java` - Spring Boot main class
- `be_phela/src/main/java/com/example/be_phela/config/SecurityConfig.java` - Security configuration
- `be_phela/src/main/java/com/example/be_phela/config/CorsConfig.java` - CORS configuration
- `be_phela/src/main/java/com/example/be_phela/filter/JwtAuthenticationFilter.java` - JWT filter

## Database Schema
The application uses MySQL with JPA entities for:
- User management (Admin, Customer, Address)
- Product catalog (Product, Category, Branch)
- E-commerce (Cart, Order, OrderItem, Promotion)
- Content (News, Banner, Contact)
- Recruitment (JobPosting, Application)
- Communication (ChatMessage)

## Testing Strategy
- Backend: Spring Boot Test with JUnit
- Run backend tests with: `./mvnw test`
- Frontend: TypeScript checking with: `npm run typecheck`

## Critical Architecture Patterns

### Frontend Notification System
- **Global ToastContainer** configured in `root.tsx` - do NOT add `<ToastContainer />` to individual pages
- **Use unified API**: Import `notify` from `~/utils/notificationConfig`
- Available methods: `notify.success()`, `notify.error()`, `notify.warning()`, `notify.info()`, `notify.loading()`, `notify.promise()`
- All notifications auto-styled with icons, colors, and Vietnamese text

### API Response Handling
Two distinct patterns exist in the backend:
1. **Auth endpoints** (`/auth/**`): Return `ApiResponse<T>` wrapper
   ```typescript
   const response = await loginCustomer(credentials);
   const { token, username, role } = response.data; // data is inside ApiResponse.data
   ```
2. **Other endpoints** (e.g., `/api/customer/{username}`): Return DTO directly
   ```typescript
   const response = await api.get(`/api/customer/${username}`);
   const profile = response.data; // data is the DTO itself
   ```

### Frontend Service Pattern
- **Public endpoints**: Create separate `publicApi` axios instance (no auth, for guest access)
- **Authenticated endpoints**: Use main `api` instance (includes JWT interceptor)
- **Error handling**: Always check `error.response?.data?.message` || `error.message` || fallback

### Product Endpoints (Backend)
Backend expects specific structure for product create/update:
- `@RequestPart("product")` - JSON blob with `{productName, description, originalPrice}` (NO categoryCode or imageUrl)
- `@RequestPart("categoryCode")` - Separate string parameter
- `@RequestPart("image")` - MultipartFile for image upload

### Order Status Workflow
Strict state machine enforced by role:
```
PENDING → CONFIRMED → DELIVERING → DELIVERED
   ↓          ↓            ↓
CANCELLED  CANCELLED   CANCELLED
```
- **ADMIN/SUPER_ADMIN**: All transitions
- **STAFF**: Can confirm, start delivery, cancel
- **DELIVERY_STAFF**: Can only mark delivered
- Frontend only shows valid next-step statuses (not all statuses)

### Revenue Report Features
- **Multiple chart types**: Line, Bar, Combined (dual Y-axis), Table view
- **Export functionality**: Print, Word (.doc), Excel (CSV with UTF-8 BOM)
- **Combined chart** (default): Shows revenue (bars) + order count (line) with dual axes

### Branch Assignment
- When updating admin's branch, set `branch` field to `branchCode` (not branchName)
- State update: `{...admin, branch: branchCode}` ensures immediate display without reload

## API Endpoint Conventions

### Authentication Endpoints
- POST `/auth/admin/register` - Admin registration
- POST `/auth/customer/register` - Customer registration
- POST `/auth/admin/login` - Admin login
- POST `/auth/customer/login` - Customer login
- POST `/auth/forgot-password/send-otp` - Send OTP for password reset
- POST `/auth/forgot-password/reset` - Reset password with OTP

### Public Product Endpoints
- GET `/api/product/all` - Get all products (paginated)
- GET `/api/product/get/{productId}` - Get product by ID
- GET `/api/product/category/{categoryCode}` - Get products by category
- GET `/api/product/status/{status}` - Get products by status

### Admin Product Endpoints
- POST `/api/admin/product/create` - Create product (multipart/form-data)
- PUT `/api/admin/product/{productId}` - Update product
- PATCH `/api/admin/product/{productId}/toggle-status` - Toggle product status
- GET `/api/admin/product/search` - Search products

### Order Management
- GET `/api/order/status/{status}` - Get orders by status
- PATCH `/api/order/{orderId}/status?status={newStatus}&username={username}` - Update order status

### User Profile
- GET `/api/customer/{username}` - Get customer profile
- GET `/api/admin/{username}` - Get admin profile
- PUT `/api/customer/updateInfo/{username}` - Update customer profile
- PUT `/api/admin/updateInfo/{username}?curentUsername={currentUsername}` - Update admin profile

## Common Pitfalls & Solutions

### Issue: "Failed to fetch customer profile" 403 Error
- **Cause**: Account not verified (status != ACTIVE) or missing JWT token
- **Solution**: Ensure email verification before login, check token in localStorage

### Issue: CORS preflight OPTIONS 403
- **Cause**: SecurityConfig not allowing OPTIONS, or CORS config has wildcard with credentials
- **Solution**: Add `registry.requestMatchers(request -> "OPTIONS".equals(request.getMethod())).permitAll()` in SecurityConfig

### Issue: Product endpoints returning "No static resource"
- **Cause**: URL mismatch - frontend calling `/api/product/{id}` but backend expects `/api/product/get/{id}`
- **Solution**: Use correct endpoint paths as documented above

### Issue: State updates not reflecting immediately
- **Cause**: Updating wrong field in state (e.g., branchName instead of branchCode)
- **Solution**: Always update state with exact field structure from backend

### Issue: Notifications not styled correctly
- **Cause**: Individual ToastContainer in page overriding global config
- **Solution**: Remove `<ToastContainer />` from pages, use global one in root.tsx

## Important Reminders

1. **Always use Vietnamese** for user-facing text
2. **Never use wildcard CORS** with credentials enabled
3. **Check both `response.data` structures** (wrapped vs direct) depending on endpoint
4. **Use `notify.promise()`** for async operations with automatic loading/success/error states
5. **Validate order status transitions** - only show next valid steps
6. **Extract error messages properly** from API responses
7. **Backend must be restarted** after CORS/Security config changes
8. **Frontend services** need `withCredentials: true` for all axios instances