// Oddiy JSON-fayl ombori. Kichik loyiha uchun yetarli;
// trafik oshsa, PostgreSQL yoki MongoDB ga o‘tkazish tavsiya etiladi.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.resolve(__dirname, '../data');
const STORE_DIR = path.resolve(__dirname, '../storage');

export async function readData(name) {
  const raw = await fs.readFile(path.join(DATA_DIR, `${name}.json`), 'utf8');
  return JSON.parse(raw);
}

// Yozishlar ketma-ket bajarilishi uchun navbat
const queues = new Map();

async function readStore(name) {
  try {
    const raw = await fs.readFile(path.join(STORE_DIR, `${name}.json`), 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function appendStore(name, item) {
  const prev = queues.get(name) || Promise.resolve();
  const next = prev.then(async () => {
    await fs.mkdir(STORE_DIR, { recursive: true });
    const list = await readStore(name);
    list.push(item);
    const file = path.join(STORE_DIR, `${name}.json`);
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(list, null, 2), 'utf8');
    await fs.rename(tmp, file);
  });
  queues.set(name, next.catch(() => {}));
  return next;
}

export async function listStore(name) {
  await (queues.get(name) || Promise.resolve());
  return readStore(name);
}
