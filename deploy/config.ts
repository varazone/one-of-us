import 'dotenv/config';

export const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
export const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS as `0x${string}`;
export const WVARA_ADDRESS = process.env.WVARA_ADDRESS as `0x${string}`;
export const RPC_URL = process.env.RPC_URL!;
export const ETH_RPC = process.env.ETH_RPC!;
export const CODE_ID = process.env.CODE_ID as `0x${string}` | undefined;
export const PROGRAM_ID = process.env.PROGRAM_ID as `0x${string}` | undefined;

export const IDL_PATH = '../target/wasm32-gear/release/one_of_us.idl';
export const WASM_PATH = '../target/wasm32-gear/release/one_of_us.opt.wasm';

export const HOODI_CHAIN_ID = 560048;
export const WVARA_TOP_UP_AMOUNT = BigInt(10 * 1e12);

