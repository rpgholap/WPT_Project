# Spare Parts Inventory Management System Explanation

This is a **Spare Parts Inventory Management System** built with a **Node.js/Express backend** and a **React frontend**. The application manages spare parts inventory with role-based access for Users (browsing/purchasing parts), Suppliers (responding to requests), and Admins (overseeing users, suppliers, inventory, and orders). It uses MySQL for data storage, JWT for authentication, bcrypt for password hashing, and Bootstrap for responsive UI. The backend handles API endpoints for CRUD operations, while the frontend provides a user interface for interactions.

The app works as follows: Users register/login, browse parts, add to cart/buy now, and view orders. Suppliers receive requests from admins, respond with quantities, and track deliveries. Admins manage users/suppliers, send requests to suppliers, approve responses, and monitor inventory/orders. Authentication uses JWT tokens stored in localStorage, with middleware verifying roles. Data flows via Axios from frontend to backend APIs, with MySQL queries handling persistence.

Below, I'll explain each file's role, operations, important syntax/regex/validations/functions, and responsiveness (where applicable). Files are grouped by backend/frontend.

## Backend Files

### `backend/package.json`

- **Role**: Defines project metadata, dependencies, and scripts. It's the entry point for npm/yarn management.
- **Operations**: Lists dependencies like `express` (web framework), `mysql2` (database driver), `bcrypt` (password hashing), `jsonwebtoken` (JWT auth), `cors` (cross-origin requests), and `dotenv` (environment variables). Scripts include `"start": "nodemon index.js"` for development.
- **Important Syntax/Functions**: JSON format for dependencies. No regex/validations here.
- **How it works in app**: Ensures all backend packages are installed; `nodemon` restarts the server on changes.

### `backend/index.js`

- **Role**: Main server file that sets up Express app, middleware, routes, and starts the server.
- **Operations**: Imports dependencies, configures CORS and JSON parsing, defines routes for auth (login/registration), user operations (get parts, cart, orders), supplier operations (respond to requests), and admin operations (manage users/suppliers/inventory). Connects to DB on startup and listens on port 3200.
- **Important Syntax/Functions**: Express app setup (`app.use`, `app.get/post/put`). Routes like `app.post("/login", loginCheck)`. No regex, but uses bcrypt/compareSync implicitly via imports.
- **How it works in app**: Central hub for all API endpoints; handles requests/responses, integrates controllers/middlewares.

### `backend/src/configs/dbConfigs.js`

- **Role**: Manages MySQL database connection.
- **Operations**: Exports `connectDB()` to establish connection using `mysql2/promise` with host/user/password/port/database. Exports `getConnection()` to retrieve the connection instance.
- **Important Syntax/Functions**: `createConnection()` with config object. Error handling with try/catch.
- **How it works in app**: Called in `index.js` to connect to DB; used in controllers for queries.

### `backend/src/constants/Roles.js`

- **Role**: Defines constants for user roles and table mappings.
- **Operations**: Exports `ROLES` object (ADMIN:1, SUPPLIER:2, USER:3) and `TABLES` array for login checks across tables.
- **Important Syntax/Functions**: Object/array literals. Used in middleware for role-based access.
- **How it works in app**: Ensures consistent role IDs; `TABLES` allows dynamic login across user/supplier/admin tables.

### `backend/src/controllers/registrations.js`

- **Role**: Handles user/supplier registration.
- **Operations**: Validates input, checks for existing email/phone via UNION query, hashes password with bcrypt, inserts into appropriate table (suppliers/users) based on role/supplier_code.
- **Important Syntax/Functions**: Regex for email/phone checks (implicit via DB query). Password hashing: `hashSync(password, 12)`. SQL queries like `INSERT INTO suppliers...`. Validations: Checks supplier_code === "supplier123" for suppliers.
- **How it works in app**: Creates accounts; prevents duplicates; returns success/error messages.

### `backend/src/controllers/login.js`

- **Role**: Authenticates users.
- **Operations**: Loops through `TABLES`, queries each for email, compares hashed password, generates JWT token with user_id/role if valid.
- **Important Syntax/Functions**: `jwt.sign()` with payload and SECRET_KEY. `compareSync()` for password. No regex, but email validation via DB.
- **How it works in app**: Issues tokens for authenticated sessions; used by middleware.

### `backend/src/middlewares/VerifyTokens.js`

- **Role**: JWT verification and role-based authorization.
- **Operations**: `verifyToken` extracts/decodes JWT from Authorization header, attaches user_id/role to request. `authorize` checks if role is in allowedRoles.
- **Important Syntax/Functions**: `jwt.verify(token, SECRET_KEY)`. Middleware functions: `next()` on success, `response.status(401/403)` on failure.
- **How it works in app**: Protects routes; ensures only authorized users access endpoints.

### `backend/src/controllers/usersOperations.js`

- **Role**: Manages user-facing operations like viewing/buying parts, cart, orders.
- **Operations**: `getAllSpareParts`/`getSparePartById`: Fetch parts with current stock via subquery. `addToCart`/`buyNow`: Create orders/orderDetails, update inventory. `editOrderDetails`/`cancelOrderById`/`viewOrderDetails`: Modify/cancel/view orders, adjust stock.
- **Important Syntax/Functions**: Complex SQL with JOINs/subqueries (e.g., `COALESCE((SELECT remainingStock...))`). Inventory updates: `INSERT INTO inventorymanagement...`. Validations: Stock checks (e.g., `if (currentStock < quantity)`).
- **How it works in app**: Handles e-commerce flow; ensures stock consistency.

### `backend/src/controllers/adminOperations.js`

- **Role**: Admin CRUD for users/suppliers/parts/inventory/orders.
- **Operations**: Fetch lists (e.g., `getAllUsers`), send requests to suppliers, approve responses (update stock), mark requests complete, get summaries/transactions.
- **Important Syntax/Functions**: SQL aggregations (e.g., `SUM`, `GROUP BY` in summaries). Inventory logic: Updates `spareparts.quantityInStock` and logs in `inventorymanagement`. Validations: Status checks (e.g., `if (request.fulfilled_quantity < request.requested_quantity)`).
- **How it works in app**: Admin oversight; triggers supplier interactions.

### `backend/src/controllers/supplierOperations.js`

- **Role**: Supplier responses to requests and delivery tracking.
- **Operations**: `receivedSparePartsRequest`: Fetch pending requests. `respondToRequest`: Update request status/fulfilled_quantity. `getDeliveryStatus`: Fetch completed requests.
- **Important Syntax/Functions**: SQL WHERE clauses for status filtering. Accumulates fulfilled_quantity. Status logic: Sets "Responded"/"Partial-Fulfilled" based on progress.
- **How it works in app**: Allows suppliers to fulfill admin requests.

## Frontend Files

### `frontend/package.json`

- **Role**: Defines React project metadata, dependencies, and scripts.
- **Operations**: Lists dependencies like `react`/`react-dom`, `axios` (HTTP client), `react-router-dom` (routing), `bootstrap` (UI), `react-toastify` (notifications). Scripts: `"dev": "vite"` for dev server.
- **Important Syntax/Functions**: JSON for deps. No regex/validations.
- **How it works in app**: Manages frontend packages; Vite builds/serves the app.

### `frontend/index.html`

- **Role**: HTML template for React app.
- **Operations**: Includes meta tags, favicon, fonts (Poppins/Inter), and root div for React mounting.
- **Important Syntax/Functions**: Standard HTML. Responsive meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- **How it works in app**: Base template; ensures fonts and responsiveness.

### `frontend/src/main.jsx`

- **Role**: React entry point.
- **Operations**: Renders App with BrowserRouter, imports Bootstrap CSS and custom styles.
- **Important Syntax/Functions**: `createRoot().render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>)`.
- **How it works in app**: Initializes React app with routing.

### `frontend/src/App.jsx`

- **Role**: Main app component with routing.
- **Operations**: Defines routes for public pages (Home/About/Contact/Login/Register) and protected routes (Parts/Orders/Dashboards) with PrivateRoute.
- **Important Syntax/Functions**: `<Routes><Route path="..." element={<Component />} /></Routes>`. Uses ROLES for protection.
- **How it works in app**: Handles navigation; role-based access.

### `frontend/src/constants/APIConstants.js`

- **Role**: API URL constants.
- **Operations**: Defines base URLs for backend endpoints.
- **Important Syntax/Functions**: String constants (e.g., `API_BASE_URL = "http://localhost:3200"`).
- **How it works in app**: Centralizes API paths for services.

### `frontend/src/constants/RoleConstant.js`

- **Role**: Role constants for frontend.
- **Operations**: Mirrors backend ROLES.
- **Important Syntax/Functions**: Object literal.
- **How it works in app**: Used in components for role checks.

### `frontend/src/services/LoginServices.js` / `RegistrationService.js` / `TokenService.js` / `UserService.js` / `RoleService.js`

- **Role**: Handle auth and storage.
- **Operations**: `LoginServices`: Axios POST to `/login`. `RegistrationService`: POST to `/registration`. `TokenService`/`UserService`/`RoleService`: localStorage get/set/remove for token/user_id/role.
- **Important Syntax/Functions**: Axios calls. localStorage methods.
- **How it works in app**: Manages auth state; tokens sent in headers.

### `frontend/src/services/UserPartService.js` / `UserOrderServices.js` / `AdminServices.js` / `SupplierServices.js`

- **Role**: API service layers for operations.
- **Operations**: Axios GET/POST/PUT to endpoints (e.g., `getAllParts()`, `addToCart()`). Includes token headers.
- **Important Syntax/Functions**: Axios with config (headers: Bearer token).
- **How it works in app**: Abstracts API calls; handles data fetching/submitting.

### `frontend/src/components/PrivateRoute.jsx`

- **Role**: Protects routes based on roles.
- **Operations**: Checks token/role; renders Outlet or AccessDenied/redirects to login.
- **Important Syntax/Functions**: `getToken()`/`getRole()`. `<Outlet />` for nested routes.
- **How it works in app**: Enforces access control.

### `frontend/src/components/AccessDenied.jsx`

- **Role**: Error page for unauthorized access.
- **Operations**: Displays message with "Go Back Home" button.
- **Important Syntax/Functions**: `useNavigate()`.
- **How it works in app**: User-friendly denial.

### `frontend/src/components/Layouts/Layout.jsx` / `NavigationBar.jsx` / `Footer.jsx`

- **Role**: Layout components.
- **Operations**: `Layout`: Conditionally hides navbar/footer on auth pages. `NavigationBar`: Responsive nav with role-based links, scroll effects. `Footer`: Static footer with links/icons.
- **Important Syntax/Functions**: `useLocation()` for hiding. Bootstrap Nav/Offcanvas for mobile. Scroll listener: `window.addEventListener("scroll")`.
- **Responsiveness**: Navbar uses Offcanvas for mobile. Footer adjusts on small screens (`@media (max-width: 768px)`).

### `frontend/src/components/Pages/Home.jsx` / `About.jsx` / `Contact.jsx` / `Login.jsx` / `Registration.jsx`

- **Role**: Public pages.
- **Operations**: `Home`: Carousel/testimonials. `Login`/`Registration`: Forms with validation. Uses toast for feedback.
- **Important Syntax/Functions**: Regex in forms (e.g., email: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`, password: `/^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/`). `useState` for forms. Bootstrap Carousel/Form.
- **Responsiveness**: Cards/forms adapt via Bootstrap grid.

### `frontend/src/components/Pages/PartList.jsx` / `PartDetail.jsx` / `UserOrders.jsx`

- **Role**: User pages for parts/orders.
- **Operations**: Fetch/display parts, handle cart/buy, edit/cancel orders.
- **Important Syntax/Functions**: `useEffect` for fetches. `toast` for notifications. Table/Button interactions.
- **Responsiveness**: Bootstrap Row/Col, responsive tables.

### `frontend/src/components/Pages/Dashboard/Admin/AdminDashboard.jsx` / SupplierDashboard.jsx

- **Role**: Dashboard layouts with tabs.
- **Operations**: Tab.Container with Nav/Panes for sub-components.
- **Important Syntax/Functions**: React-Bootstrap Tab components.
- **Responsiveness**: Tabs stack on mobile.

### `frontend/src/assets/css/style.css`

- **Role**: Custom styles.
- **Operations**: Defines variables, navbar/footer styles, page-specific CSS (e.g., gradients, transitions).
- **Important Syntax/Functions**: CSS variables (`--primary-color`). Media queries for responsiveness (e.g., `@media (max-width: 768px)`). Transitions (e.g., `transform 0.3s`).
- **Responsiveness**: Navbar shrinks on scroll, footer adjusts links, forms/cards hover effects. Mobile-first with breakpoints.

Overall, the app is responsive via Bootstrap (grid, components) and custom CSS (media queries). Validations use regex in forms and backend checks. Functions like JWT verification and SQL queries ensure security/data integrity. No testing was performed as this is an explanatory task.
