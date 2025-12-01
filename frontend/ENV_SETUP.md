# Environment Setup

## 📝 Создание .env файла

Создайте файл `.env` в корне папки `frontend/`:

```bash
cd frontend
touch .env
```

## ⚙️ Конфигурация переменных

Добавьте следующие переменные в `.env`:

```env
# Vara.Eth Configuration

# Router contract address (manages programs on Ethereum)
VITE_ROUTER_ADDRESS=0x579D6098197517140e5aec47c78d6f7181916dd6

# Program ID (your deployed program address)
VITE_PROGRAM_ID=0xe1e91aaa2e33dcb5472abda548a875fc955d2c95

# WVARA ERC20 wrapper address (for gas payments)
VITE_WVARA_ADDRESS=0x7e01A323534AA027Ac3aD17e7DBf8C90d4FFEf8e

# Vara.Eth RPC Endpoints
# HTTP endpoint for queries and calls
VITE_VARA_ETH_HTTP=https://hoodi-reth-rpc.gear-tech.io

# WebSocket endpoint for subscriptions and real-time operations
VITE_VARA_ETH_WS=wss://hoodi-reth-rpc.gear-tech.io/ws
```

## 🔒 Безопасность

- **НЕ коммитьте `.env` файл в git**
- Файл `.env` уже добавлен в `.gitignore`
- Используйте `.env.example` для документирования необходимых переменных

## 🌍 Разные окружения

### Development
```env
VITE_VARA_ETH_HTTP=https://hoodi-reth-rpc.gear-tech.io
VITE_VARA_ETH_WS=wss://hoodi-reth-rpc.gear-tech.io/ws
```

### Production
Создайте `.env.production` для продакшн настроек.

## 📦 Использование в коде

Все переменные окружения доступны через `import.meta.env`:

```typescript
// config/env.ts
export const ENV = {
  ROUTER_ADDRESS: import.meta.env.VITE_ROUTER_ADDRESS as `0x${string}`,
  PROGRAM_ID: import.meta.env.VITE_PROGRAM_ID as `0x${string}`,
  // ...
}
```

## ✅ Проверка

После создания `.env` файла, перезапустите dev server:

```bash
npm run dev
```

Проверьте в консоли браузера, что переменные загружены корректно.

