# OneOfUs - Vara.Eth Deployment

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your private key
```

## Deployment Flow

### 1. Upload WASM Code (⚠️ Currently not working on Hoodi after Osaka hardfork)

Upload and validate your compiled WASM code:

```bash
npm run upload
```

This creates a `CODE_ID`. Add it to `.env`:

```
CODE_ID=0x...
```

**Note:** EIP-4844 blob transactions are not supported after Osaka hardfork. Use an existing CODE_ID or wait for network update.

### 2. Create Program

Create a program instance from validated code:

```bash
npm run create
```

This creates a `PROGRAM_ID` and **waits for validation** by Vara.Eth validators. Add it to `.env`:

```
PROGRAM_ID=0x...
```

**Important:** Program is created and validated, but NOT initialized yet!

### 3. Fund Program

**Programs need wVARA balance BEFORE initialization!**

```bash
npm run fund
```

This will check program is validated, approve wVARA, and top up executable balance.

### 4. Initialize Program

Send the initialization message via Ethereum:

```bash
npm run init
```

This will send init message through Mirror contract and wait for program reply.

**Important:** Program MUST have wVARA balance before init!

### 5. Test with Injected Transactions

Test program using injected transactions (bypasses Ethereum):

```bash
npm test
```

This script tests JoinUs function and queries state.

**Note:** Injected transactions return `Accept/Reject` status from validators, not the actual program execution result.

## Scripts

- `upload-code.ts` - Upload WASM via blob transactions (⚠️ currently broken after Osaka)
- `create-program.ts` - Create and validate program from CODE_ID
- `fund-program.ts` - Fund program with wVARA (must run BEFORE init)
- `init-program.ts` - Initialize program via Ethereum (must run AFTER fund)
- `test-injected.ts` - Test using injected transactions

## Environment Variables

Required in `.env`:

- `PRIVATE_KEY` - Your Ethereum private key
- `ROUTER_ADDRESS` - Router contract address
- `WVARA_ADDRESS` - wVARA token address
- `RPC_URL` - Vara.Eth RPC endpoint
- `ETH_RPC` - Ethereum RPC endpoint
- `CODE_ID` - Validated code ID (after upload)
- `PROGRAM_ID` - Program instance ID (after create)
