import { readFileSync } from 'fs';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import {
  EthereumClient,
  getRouterClient,
  VaraEthApi,
  HttpVaraEthProvider,
  InjectedTransaction,
} from '@vara-eth/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import {
  PRIVATE_KEY,
  ROUTER_ADDRESS,
  RPC_URL,
  ETH_RPC,
  CODE_ID,
  PROGRAM_ID,
  IDL_PATH,
  HOODI_CHAIN_ID,
} from './config.ts';

const hoodi = defineChain({
  id: HOODI_CHAIN_ID,
  name: 'Hoodi Testnet',
  network: 'hoodi',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: [ETH_RPC] },
    public: { http: [ETH_RPC] },
  },
  testnet: true,
});

async function main() {
  const account = privateKeyToAccount(PRIVATE_KEY);

  const publicClient = createPublicClient({
    chain: hoodi,
    transport: http(ETH_RPC),
  });

  const walletClient = createWalletClient({
    account,
    chain: hoodi,
    transport: http(ETH_RPC),
  });

  const ethereumClient = new EthereumClient(publicClient, walletClient);
  const router = getRouterClient(ROUTER_ADDRESS, ethereumClient);
  const api = new VaraEthApi(
    new HttpVaraEthProvider(RPC_URL as any),
    ethereumClient,
    ROUTER_ADDRESS
  );

  let programId: `0x${string}`;

  if (PROGRAM_ID) {
    console.log('Using existing program:', PROGRAM_ID);
    programId = PROGRAM_ID;
  } else {
    if (!CODE_ID) {
      console.error('Error: Neither PROGRAM_ID nor CODE_ID set in .env');
      console.log('Run "npm run upload" first to get CODE_ID');
      process.exit(1);
    }
    console.log('Creating new program from CODE_ID:', CODE_ID);
    const createTx = await router.createProgram(CODE_ID);
    await createTx.sendAndWaitForReceipt();
    programId = await createTx.getProgramId();
    console.log('Program created:', programId);
    console.log('Add to .env: PROGRAM_ID=' + programId);
  }

  const idlContent = readFileSync(IDL_PATH, 'utf-8');
  const parser = await SailsIdlParser.new();
  const sails = new Sails(parser);
  await sails.parseIdl(idlContent);

  console.log('\n--- Init ---');
  const initPayload = sails.ctors.New.encodePayload();
  const initTx = new InjectedTransaction({
    destination: programId,
    payload: initPayload,
    value: 0n,
  });

  try {
    const initInjected = await api.createInjectedTransaction(initTx);
    const initResult = await initInjected.send();
    console.log('Transaction accepted:', initResult);
  } catch (error: any) {
    console.log('Init error:', error.message);
  }

  console.log('\n--- JoinUs ---');
  const joinUsPayload = sails.services.OneOfUs.functions.JoinUs.encodePayload();
  const joinUsTx = new InjectedTransaction({
    destination: programId,
    payload: joinUsPayload,
    value: 0n,
  });

  try {
    const joinUsInjected = await api.createInjectedTransaction(joinUsTx);
    const txHash = await joinUsInjected.send();
    console.log('Transaction accepted:', txHash);
    console.log('Note: Injected tx returns Accept/Reject, not program result');
    console.log('Use query to verify actual registration state');
  } catch (error: any) {
    console.log('JoinUs error:', error.message);
  }

  console.log('\n--- Query Count ---');
  try {
    const countPayload = sails.services.OneOfUs.queries.Count.encodePayload();
    const countReply = await api.call.program.calculateReplyForHandle(
      account.address,
      programId,
      countPayload
    );
    const count = sails.services.OneOfUs.queries.Count.decodeResult(
      countReply.payload
    );
    console.log('Participant count:', count);
  } catch (error: any) {
    console.log('Query error:', error.message);
  }

  console.log('\n--- Verify Registration ---');
  try {
    const actorId = account.address.slice(2).padStart(64, '0');
    const addressArray: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 16; i++) {
      addressArray[i] = parseInt(actorId.substring(i * 4, i * 4 + 4), 16);
    }

    const isOneOfUsPayload =
      sails.services.OneOfUs.queries.IsOneOfUs.encodePayload(addressArray);
    const isOneOfUsReply = await api.call.program.calculateReplyForHandle(
      account.address,
      programId,
      isOneOfUsPayload
    );
    const isRegistered = sails.services.OneOfUs.queries.IsOneOfUs.decodeResult(
      isOneOfUsReply.payload
    );

    if (isRegistered) {
      console.log('✅ Account is registered as One of Us');
    } else {
      console.log('❌ Account is NOT registered');
    }
  } catch (error: any) {
    console.log('Verification error:', error.message);
  }

  console.log('\n✓ Test completed');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
