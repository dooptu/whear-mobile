# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npx expo start
```

### 3. Run on Platform

- **iOS Simulator**: Press `i` in the terminal or run `npx expo start --ios`
- **Android Emulator**: Press `a` in the terminal or run `npx expo start --android`
- **Expo Go**: Scan the QR code with the Expo Go app on your phone

## Initial Setup from Empty Folder

If starting from an empty folder, the project is already initialized. Just run:

```bash
npm install
npx expo start
```

## Project Structure

```
whear-v2/
├── src/
│   ├── app/              # App entry point
│   ├── navigation/       # Navigation setup
│   ├── screens/          # All screen components
│   ├── components/       # Reusable UI components
│   ├── features/         # Zustand stores
│   ├── services/         # API services
│   ├── data/            # Mock data
│   ├── models/          # TypeScript types
│   ├── utils/           # Utilities
│   ├── constants/       # Constants
│   └── hooks/           # Custom hooks
├── assets/              # Images, icons
├── App.tsx              # Root component
├── package.json         # Dependencies
└── app.json            # Expo config
```

## Demo Credentials

- **Email**: `demo@whear.com`
- **Password**: `demo123`
- **Verification Code**: `123456`
- **Reset Code**: `123456`

## Troubleshooting

### Clear Cache
```bash
npx expo start -c
```

### Reset Metro Bundler
```bash
npx expo start --clear
```

### Install Missing Dependencies
If you see module not found errors, run:
```bash
npm install
```

## Next Steps

1. Run `npm install` to install all dependencies
2. Run `npx expo start` to start the development server
3. Open in Expo Go or simulator
4. Test all features using the demo credentials




