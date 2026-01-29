# Angular Frontend Structure

Comprehensive Angular frontend for the e-commerce recipe platform with modular architecture.

## Project Structure

```
src/app/
├── core/                    # Core singleton services
│   ├── models/              # User models and DTOs
│   ├── services/            # Auth, Storage, WebSocket, Loading
│   ├── guards/              # Auth and Role guards
│   └── interceptors/        # HTTP interceptors
│
├── features/                # Feature modules
│   ├── auth/                # Authentication (login, register)
│   ├── recipes/             # Recipe browsing and management
│   ├── orders/              # Order history and checkout
│   ├── payments/            # Stripe payment integration
│   ├── comments/            # Recipe comments
│   ├── follows/             # Follow/unfollow chefs
│   ├── notifications/       # Real-time notifications
│   └── profile/             # User profile and chef dashboard
│
├── shared/                  # Reusable components
│   ├── components/          # Button, Card, Modal, Loader, Toast, Rating
│   ├── pipes/               # TimeAgo pipe
│   └── directives/          # LazyLoad directive
│
├── layout/                  # App shell
│   ├── header/              # Navigation header
│   └── footer/              # Site footer
│
└── environments/            # Environment configurations
```

## Architecture Principles

### Core Module
- **Singleton Services**: Loaded once at app startup
- **Guards**: Protect routes based on authentication and roles
- **Interceptors**: Handle JWT tokens, errors, and loading states

### Feature Modules
- **Smart Components**: Manage state and business logic
- **Dumb Components**: Pure presentation components
- **Services**: API communication and data management
- **Models**: TypeScript interfaces and DTOs

### Shared Module
- **Reusable Components**: Used across multiple features
- **Pipes**: Transform data for display
- **Directives**: Extend HTML behavior

## Key Technologies

- **Angular 17+**: Standalone components, Signals
- **RxJS**: Reactive programming
- **TypeScript**: Type safety
- **Stripe**: Payment processing
- **WebSocket**: Real-time notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Build
```bash
npm run build
# or
ng build
```

## Environment Configuration

Update `src/environments/environment.ts` with your backend URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  wsUrl: 'ws://localhost:8080/ws'
};
```

> **Note**: Payment integration (Stripe or other) can be added later as needed.

## State Management

This application uses **Angular Signals** for reactive state management:
- `AuthService`: Current user and authentication state
- `NotificationService`: Unread notification count
- `LoadingService`: Global loading state
- `ToastService`: Toast notifications

## Routing

Routes are protected based on authentication and user roles:
- **Public**: `/auth/login`, `/auth/register`, `/recipes`
- **Authenticated**: `/profile`, `/orders`, `/notifications`
- **Chef Only**: `/my-recipes`, `/dashboard`
- **Buyer Only**: `/checkout`

## HTTP Interceptors

1. **AuthInterceptor**: Adds JWT token to requests
2. **ErrorInterceptor**: Handles errors globally (401, 403, 500)
3. **LoadingInterceptor**: Tracks request loading states

## WebSocket Integration

Real-time notifications via WebSocket:
```typescript
WebSocketService.connect(wsUrl, token);
WebSocketService.getMessagesByType('notification').subscribe(...);
```

## Styling

- **Component Styles**: Scoped to individual components
- **Global Styles**: In `src/styles.css`
- **Responsive**: Mobile-first approach

## Next Steps

1. Create additional feature components
2. Implement recipe list and detail views
3. Build checkout flow with Stripe
4. Add real-time notification UI
5. Create chef dashboard with analytics

## License

Private - All Rights Reserved
