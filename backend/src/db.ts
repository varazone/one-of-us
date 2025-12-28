import Database from 'better-sqlite3';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { CONFIG } from './config.js';

const dataDir = dirname(CONFIG.DB_PATH);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(CONFIG.DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT UNIQUE NOT NULL,
    tx_hash TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_address ON members(address);
  CREATE INDEX IF NOT EXISTS idx_joined_at ON members(joined_at);
`);

export interface Member {
  id: number;
  address: string;
  tx_hash: string | null;
  joined_at: string;
}

export function addMember(address: string, txHash?: string): boolean {
  const normalizedAddress = address.toLowerCase();

  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO members (address, tx_hash)
      VALUES (?, ?)
    `);
    const result = stmt.run(normalizedAddress, txHash || null);
    return result.changes > 0;
  } catch {
    return false;
  }
}

export function isMember(address: string): boolean {
  const normalizedAddress = address.toLowerCase();
  const stmt = db.prepare('SELECT 1 FROM members WHERE address = ?');
  return !!stmt.get(normalizedAddress);
}

export function getMember(address: string): Member | null {
  const normalizedAddress = address.toLowerCase();
  const stmt = db.prepare('SELECT * FROM members WHERE address = ?');
  return stmt.get(normalizedAddress) as Member | null;
}

export function getAllMembers(page = 0, pageSize = 100): Member[] {
  const offset = page * pageSize;
  const stmt = db.prepare(
    'SELECT * FROM members ORDER BY joined_at DESC LIMIT ? OFFSET ?'
  );
  return stmt.all(pageSize, offset) as Member[];
}

export function getMemberCount(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM members');
  const result = stmt.get() as { count: number };
  return result.count;
}

export function updateMemberTxHash(address: string, txHash: string): boolean {
  const normalizedAddress = address.toLowerCase();
  try {
    const stmt = db.prepare('UPDATE members SET tx_hash = ? WHERE address = ?');
    const result = stmt.run(txHash, normalizedAddress);
    return result.changes > 0;
  } catch {
    return false;
  }
}

export default db;
