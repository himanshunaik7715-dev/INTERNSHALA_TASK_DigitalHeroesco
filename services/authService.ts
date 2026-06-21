import { SignJWT, jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.GUEST_JWT_SECRET || 'your-super-secret-key'
);

export async function createGuestJWT() {
  const guestId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const token = await new SignJWT({ guestId, isGuest: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  await dbConnect();
  await User.create({
    isGuest: true,
    guestId,
  });

  return { token, guestId, expiresAt };
}

export async function verifyGuestJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function migrateGuestToUser(guestId: string, clerkId: string, email: string) {
  await dbConnect();
  const user = await User.findOneAndUpdate(
    { guestId, isGuest: true },
    {
      $set: {
        clerkId,
        email,
        isGuest: false,
        guestId: null,
      },
    },
    { new: true }
  );
  return user;
}

export async function getUserById(userId: string) {
  await dbConnect();
  const user = await User.findOne({
    $or: [{ clerkId: userId }, { guestId: userId }],
  });
  return user;
}