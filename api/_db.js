import { put, get, list } from '@vercel/blob';

const BLOB_KEY = 'club-users.json';

/**
 * Read all users from Blob storage.
 * Returns a Map of email -> { email, name, passwordHash, createdAt }
 */
export async function getUsers() {
  try {
    const blob = await get(BLOB_KEY);
    if (!blob) return new Map();
    const data = await blob.text();
    return new Map(Object.entries(JSON.parse(data)));
  } catch {
    return new Map();
  }
}

/**
 * Save users Map to Blob storage.
 */
export async function saveUsers(usersMap) {
  const obj = Object.fromEntries(usersMap);
  await put(BLOB_KEY, JSON.stringify(obj), {
    contentType: 'application/json',
    access: 'private',
  });
}

/**
 * Add a new user. Returns false if email already exists.
 */
export async function addUser(email, name, passwordHash) {
  const users = await getUsers();
  if (users.has(email)) return false;
  users.set(email, { email, name, passwordHash, createdAt: new Date().toISOString() });
  await saveUsers(users);
  return true;
}

/**
 * Find a user by email.
 */
export async function findUser(email) {
  const users = await getUsers();
  return users.get(email) || null;
}
