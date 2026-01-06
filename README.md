# Whear - Fashion Style Assistant App

A complete MVP mobile app built with Expo, React Native, and TypeScript. This app helps users manage their wardrobe, generate outfit suggestions, and track their style history.

## Tech Stack

- **Expo SDK 50** - Compatible with Node.js v20.9.0
- **React Native 0.73.2**
- **TypeScript 5.3.3**
- **React Native Paper** - UI component library with Material Design
- **Zustand** - State management
- **React Navigation** - Navigation (Native Stack + Bottom Tabs)
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client (with mock adapter)
- **AsyncStorage** - Local storage
- **Expo ImagePicker** - Image selection
- **Expo Location** - Location services (optional)

## Project Structure

```
src/
├── app/              # App entry point and providers
├── navigation/       # Navigation stacks and tabs
├── screens/          # Screen components (auth, profile, closet, outfit, etc.)
├── components/       # Reusable UI components
├── features/         # Zustand stores (auth, profile, closet, outfit, entitlements, theme)
├── services/         # API service layer (auth, profile, closet, outfit, catalog, entitlements)
├── data/            # Mock JSON data
├── models/          # TypeScript interfaces and types
├── utils/           # Helper functions (API client, date, colors)
├── constants/       # Theme, routes, limits
└── hooks/           # Custom hooks
```

## Setup Instructions

### Prerequisites

- Node.js v20.9.0
- npm or yarn
- Expo CLI (installed globally or via npx)
- iOS Simulator (for Mac) or Android Emulator
- Expo Go app on your phone (for testing)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on specific platform:**
   - iOS Simulator: Press `i` or run `npx expo start --ios`
   - Android Emulator: Press `a` or run `npx expo start --android`
   - Expo Go: Scan the QR code with Expo Go app

## Features

### Authentication & Account
- ✅ Onboarding/Welcome screen
- ✅ Register (email, password, confirm password)
- ✅ Login (email, password)
- ✅ Verify account (simulated OTP)
- ✅ Forgot password
- ✅ Reset password
- ✅ Logout

### Profile
- ✅ View profile
- ✅ Edit profile (gender, height, weight, skin tone, style preferences)
- ✅ Settings (theme toggle, delete account, app info)

### Closet (Wardrobe Management)
- ✅ Closet screen with list/grid toggle
- ✅ Filters (category, color, tags)
- ✅ Add item (camera/gallery with Expo ImagePicker)
- ✅ AI scan simulation (auto-fills category, colors, tags)
- ✅ Item detail screen
- ✅ Edit item
- ✅ Delete item

### Outfit Generator
- ✅ Outfit generator (select occasion, weather context)
- ✅ Outfit results (3-6 suggestions)
- ✅ Outfit detail (view, "Wear Today", replace slots)
- ✅ Outfit history (calendar-like, prevents repeats within 7 days)

### Catalog & Subscription
- ✅ Catalog fallback (missing pieces suggestions)
- ✅ Subscription/Upgrade screen (Free vs Pro plans)
- ✅ Entitlement limits enforcement

## Mock API

The app uses a mock API layer that simulates real API calls:

- **Location**: `src/utils/api.ts` - Axios instance with custom adapter
- **Services**: All services in `src/services/` use the mock adapter
- **Data**: Hardcoded JSON data in `src/data/mockData.ts`
- **Features**:
  - Artificial latency (300-800ms)
  - 10% chance of network errors
  - Proper error handling
  - Token injection via interceptors

### Demo Credentials

- **Email**: `demo@whear.com`
- **Password**: `demo123`
- **Verification Code**: `123456`
- **Reset Code**: `123456`

## Theming

The app supports light/dark themes with a custom brand palette:

- **Primary Color**: Teal (#2DD4BF)
- **Secondary Color**: Coral (#FF6B6B)
- **Background**: Off-white (light) / Dark (dark mode)
- **Text**: Charcoal (light) / Off-white (dark mode)

Theme can be toggled in Settings.

## State Management

Uses Zustand stores with persistence:

- `authStore` - Authentication state (persisted)
- `profileStore` - User profile
- `closetStore` - Closet items, filters, view mode
- `outfitStore` - Generated outfits, history
- `entitlementsStore` - Subscription plan, limits (persisted)
- `themeStore` - Theme preference (persisted)

## Navigation

- **Auth Stack**: Onboarding → Register/Login → Verify → Main
- **Main Tabs**: Closet | Outfit | Profile
- **Main Stack**: All detail screens, settings, etc.

## Limits & Entitlements

### Free Plan
- Max 30 closet items
- 5 outfit generates per day

### Pro Plan
- Max 1000 closet items
- 50 outfit generates per day

Limits are enforced in the app logic and show upgrade prompts when exceeded.

## Manual QA Checklist

### Authentication
- [ ] Onboarding screen displays correctly
- [ ] Register flow works (use demo@whear.com or new email)
- [ ] Login works with demo credentials
- [ ] Verify account accepts code 123456
- [ ] Forgot password sends reset code
- [ ] Reset password works
- [ ] Logout clears session

### Profile
- [ ] View profile shows user info
- [ ] Edit profile saves changes
- [ ] Settings theme toggle works
- [ ] Delete account shows confirmation

### Closet
- [ ] Closet list/grid toggle works
- [ ] Filters work (category, color, tag)
- [ ] Add item opens camera/gallery
- [ ] AI scan auto-fills data
- [ ] Item detail shows all info
- [ ] Edit/delete item works

### Outfit Generator
- [ ] Generate outfits with occasion/weather
- [ ] Results show 3-6 outfits
- [ ] Outfit detail shows all items
- [ ] "Wear Today" saves to history
- [ ] Replace slot works
- [ ] History groups by date
- [ ] Prevents wearing same outfit within 7 days

### Subscription
- [ ] Upgrade screen shows plans
- [ ] Upgrade to Pro works (simulated)
- [ ] Limits enforced correctly
- [ ] Paywall prompts show when limits reached

### General
- [ ] Dark mode toggle works
- [ ] Navigation flows smoothly
- [ ] Loading states show
- [ ] Error messages display
- [ ] Empty states show when no data

## Known Limitations

- Mock API only (no real backend)
- Image storage uses local URIs (not persisted)
- No real payment processing
- Location weather is simulated
- AI scan is simulated with random data

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache with `npx expo start -c`
2. **TypeScript errors**: Run `npm install` to ensure all types are installed
3. **Navigation errors**: Ensure all routes are properly defined in `navigation/types.ts`
4. **Image picker not working**: Check permissions in app.json

## Development

### Linting & Formatting

```bash
npm run lint
npm run format
```

### Building

For production builds, use EAS Build:

```bash
npm install -g eas-cli
eas build
```

## License

Private project - All rights reserved




