# Frontend Architecture

## 📁 Project Structure

```
frontend/src/
├── components/           # Presentational components
│   ├── StarsBackground/  # WebGL background with star animation
│   ├── Header/          # Header with wallet
│   ├── Footer/          # Footer with links
│   ├── SloganCarousel/  # Slogan carousel
│   ├── Stats/           # Member statistics
│   ├── JoinSection/     # Join section with button
│   ├── FloatingCat/     # Floating cat
│   └── index.ts         # Component exports
│
├── hooks/               # Business logic and hooks
│   ├── useWallet.tsx         # MetaMask connection
│   ├── useSails.tsx          # Working with Sails IDL
│   ├── useVaraApi.tsx        # Initializing Vara.Eth API
│   ├── useMemberCount.tsx    # Getting member count
│   └── useJoinProgram.tsx    # Join program logic
│
├── config/              # Configuration
│   ├── env.ts           # Environment variables
│   └── constants.ts     # Application constants
│
├── App.tsx              # Main component (pure composition)
├── App.css              # Global styles
├── index.tsx            # Entry point
└── index.css            # Base styles

```

## 🏗️ Architectural Principles

### 1. **Separation of Concerns**

- **Components**: UI only, receive data via props
- **Hooks**: Business logic, API interaction, state
- **Config**: Configuration and constants

### 2. **Composition over Inheritance**

```tsx
<App>
  <StarsBackground />
  <FloatingCat />
  <Header {...headerProps} />
  <main>
    <SloganCarousel />
    <Stats memberCount={memberCount} />
    <JoinSection {...joinProps} />
  </main>
  <Footer />
</App>
```

### 3. **Hooks for Logic**

Each hook is responsible for one task:

- `useWallet` - MetaMask management
- `useVaraApi` - Vara.Eth API initialization
- `useMemberCount` - getting and updating the counter
- `useJoinProgram` - join program logic

### 4. **Configuration via ENV**

```typescript
// config/env.ts
export const ENV = {
  ROUTER_ADDRESS: import.meta.env.VITE_ROUTER_ADDRESS,
  PROGRAM_ID: import.meta.env.VITE_PROGRAM_ID,
  VARA_ETH_HTTP: import.meta.env.VITE_VARA_ETH_HTTP,
  VARA_ETH_WS: import.meta.env.VITE_VARA_ETH_WS,
};
```

## 🎨 Components

### StarsBackground

WebGL component with animated star background. Self-contained, doesn't require props.

### Header

Displays wallet connection status and connect/disconnect buttons.

**Props:**

- `address`, `chainId`, `isConnected`, `isConnecting`
- `isMetaMaskInstalled`, `error`
- `onConnect`, `onDisconnect`

### JoinSection

Main section with join button and transaction status display.

**Props:**

- Statuses: `isConnected`, `isJoined`, `loading`, `sailsLoading`
- Data: `preConfirmed`, `finalized`, `error`
- Callbacks: `onConnect`, `onJoin`

### Stats

Displays member statistics.

**Props:**

- `memberCount: number`

## 🔗 Hooks

### useVaraApi

Creates and manages an instance of `VaraEthApi`.

```tsx
const varaApi = useVaraApi(ethereumClient, isConnected);
```

### useMemberCount

Gets the number of participants from the program and updates every 10 seconds.

```tsx
const { memberCount, refetchCount } = useMemberCount(varaApi, sails, address);
```

### useJoinProgram

Manages the program join process.

```tsx
const { isJoined, loading, preConfirmed, finalized, handleJoin } = useJoinProgram(varaApi, sails, address, isConnected);
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root of `frontend/`:

```env
VITE_ROUTER_ADDRESS=0x579D6098197517140e5aec47c78d6f7181916dd6
VITE_PROGRAM_ID=0xe1e91aaa2e33dcb5472abda548a875fc955d2c95
VITE_WVARA_ADDRESS=0x7e01A323534AA027Ac3aD17e7DBf8C90d4FFEf8e
VITE_VARA_ETH_HTTP=https://hoodi-reth-rpc.gear-tech.io
VITE_VARA_ETH_WS=wss://hoodi-reth-rpc.gear-tech.io/ws
```

### Constants

```typescript
// config/constants.ts
export const SLOGANS = ['STOP FRAGMENTING', 'STOP BRIDGING', 'STOP COMPLICATING', 'STOP SACRIFICING', 'BE PART OF US!'];

export const SLOGAN_INTERVAL_MS = 2000;
export const MEMBER_COUNT_REFRESH_MS = 10000;
```

## 🚀 Running

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

- **React 18** - UI library
- **@vara-eth/api** - Vara.Eth blockchain integration
- **sails-js** - Sails framework client
- **viem** - Ethereum interactions
- **TypeScript** - Type safety
- **Vite** - Build tool

## 🎯 Best Practices

1. **One component = one file** - each component in its own folder with CSS
2. **Props interfaces** - all props typed via TypeScript
3. **CSS modules per component** - isolated styles
4. **Custom hooks for logic** - reusable business logic
5. **ENV for configuration** - don't hardcode addresses and settings
6. **Clean-up in useEffect** - always clean up subscriptions and timers

## 🔄 Data Flow

```
User Action → Hook → API Call → State Update → Component Re-render
     ↓
handleJoin() → useJoinProgram → VaraEthApi → setIsJoined(true) → JoinSection
```

## 📝 Adding a New Component

1. Create a folder in `components/`
2. Create files `Component.tsx` and `Component.css`
3. Export in `components/index.ts`
4. Use in `App.tsx`

```tsx
// components/NewComponent/NewComponent.tsx
import './NewComponent.css';

interface NewComponentProps {
  title: string;
}

export const NewComponent = ({ title }: NewComponentProps) => {
  return <div className="new-component">{title}</div>;
};
```

## 🐛 Debugging

- Check browser console for logs
- Use React DevTools
- Check Network tab for API requests
- Check MetaMask connection









